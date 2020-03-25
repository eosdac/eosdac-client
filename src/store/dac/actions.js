export async function initRoutine ({ state, commit, dispatch }, vm) {
  commit('setIsLoaded', false)
  const api = await dispatch('global/getDacApi', false, { root: true })

  const custodianconfig = await api.getContractConfig('custodian')
  console.log('custodian config', custodianconfig)
  // requests to get dac info, doesn't require user to be logged in
  let requests = [
    api.getMemberTerms(),
    api.getCustodians(custodianconfig.numelected),
    api.getTokenStats()
  ]

  const [memberterms, custodians, tokenstats] = await Promise.all(requests)
  commit('setMemberTerms', memberterms)
  commit('setTokenStats', tokenstats)
  commit('setCustodians', custodians)
  commit('setCustodianConfig', custodianconfig)
  commit('setIsLoaded', true)
  // load in background
  dispatch('fetchActiveCandidates')
  dispatch('fetchDacAdmins')
}

/// //////////////////////////////////////////////////////////////////////////////////////////////

export async function fetchCustodians ({ state, commit, dispatch }) {
  const api = await dispatch('global/getDacApi', false, { root: true })

  const custodians = await api.getCustodians()
  console.log('custodians', custodians)
  if (custodians) {
    commit('setCustodians', custodians)
    return custodians
  } else {
    return []
  }
}

export async function fetchActiveCandidates ({ state, commit, dispatch }) {
  const api = await dispatch('global/getDacApi', false, { root: true })

  let candidates = await api.getCandidates()

  if (candidates) {
    candidates = candidates.filter(c => c.is_active)
  } else {
    return []
  }

  candidates.sort((a, b) => {
    return b.total_votes - a.total_votes
  })

  candidates = candidates.map((c, i) => {
    c.rank = i + 1
    c.selected = false
    return c
  })

  const candidateNames = candidates.map(c => c.candidate_name)
  const profiles = await this._vm.$profiles.getProfiles(candidateNames)
  candidates.forEach(c => {
    const candProfile = profiles.find(p => p.account === c.candidate_name)
    if (candProfile) {
      c.profile = candProfile.profile
    } else {
      c.profile = false
    }
  })
  console.log('active candidates with profile', candidates)
  commit('setCandidates', candidates)
  return candidates
}

export async function fetchDacAdmins ({ commit, dispatch }) {
  const api = await dispatch('global/getDacApi', false, { root: true })
  const authAccount = this._vm.$dir.getAccount(this._vm.$dir.ACCOUNT_AUTH)
  const res = await api.getAccount(authAccount)
  if (res && res.permissions) {
    let admins = res.permissions.find(p => p.perm_name === 'admin')
    if (!admins) return
    admins = admins.required_auth.accounts.map(a => a.permission.actor)

    if (admins && admins.length) {
      console.log('Dac Admins', admins)
      commit('setDacAdmins', admins)
    }
  }
}

export async function fetchControlledAccounts ({ dispatch }) {
  const api = await dispatch('global/getDacApi', false, { root: true })
  const authAccount = this._vm.$dir.getAccount(this._vm.$dir.ACCOUNT_AUTH)
  const ctrl = await api.getControlledAccounts(
    authAccount
  )
  console.log(ctrl)
}

export async function fetchTokenStats ({ commit, dispatch, state }) {
  const api = await dispatch('global/getDacApi', false, { root: true })
  const stats = await api.getTokenStats()
  if (stats) {
    commit('setTokenStats', stats)
    console.log('stats', stats)
    return stats
  }
}

export async function fetchCustodianContractState ({ commit, dispatch, state }) {
  const api = await dispatch('global/getDacApi', false, { root: true })
  const xstate = await api.getCustodianContractState()
  if (xstate) {
    console.log('custodianState', xstate)
    commit('setCustodianState', xstate)
    return xstate
  }
}

export async function fetchWpConfig ({ commit, dispatch, state }) {
  const api = await dispatch('global/getDacApi', false, { root: true })
  const conf = await api.getContractConfig('wp')
  if (conf) {
    commit('setWpConfig', conf)
  }
}

export async function fetchTokenConfig ({ commit, dispatch, state }) {
  const api = await dispatch('global/getDacApi', false, { root: true })
  const conf = await api.getContractConfig('token')
  if (conf) {
    console.log(`Token config`, conf)
    commit('setTokenConfig', conf)
  }
}

export async function fetchReferendumConfig ({ commit, dispatch, state }) {
  const api = await dispatch('global/getDacApi', false, { root: true })
  const conf = await api.getContractConfig('referendum')
  if (conf) {
    console.log(`Referendum config`, conf)
    commit('setReferendumConfig', conf)
  }
}

export async function fetchActivationStats ({ commit, dispatch, state }) {
  const api = await dispatch('global/getDacApi', false, { root: true })
  const conf = await api.getContractConfig('custodian')
  const tokenStats = await api.getTokenStats()
  const custodianState = await api.getCustodianContractState()

  const activationStats = {
    active: true,
    canActivate: false,
    votePercentage: null,
    voteQuorum: null,
    numCandidates: null,
    requiredCandidates: null
  }

  if (custodianState.met_initial_votes_threshold || custodianState.lastperiodtime !== '1970-01-01T00:00:00') {
    console.log('state', custodianState)
    commit('setActivationStats', activationStats)
    return
  }

  activationStats.active = false
  const requiredCandidates = conf.numelected
  let numCandidates = 0

  // this.$store.dispatch("api/getTokenStats");
  if (
    custodianState.total_weight_of_votes !== null &&
    tokenStats.supply !== null
  ) {
    let [amount] = tokenStats.supply.split(' ')
    const totalsupply = parseFloat(amount) * Math.pow(10, tokenStats.precision)
    const quorum =
      totalsupply *
      (conf.initial_vote_quorum_percent / 100)

    const percentage = (custodianState.total_weight_of_votes / quorum) * 100
    // console.log(percentage)
    activationStats.votePercentage = percentage / 100
    activationStats.voteQuorum = conf.initial_vote_quorum_percent

    // if (percentage <= 100) {
    // check enough candidates
    // console.log('config', conf)

    // Calculate number of viable candidates
    const res = await this._vm.$eosApi.rpc.get_table_rows({
      code: this._vm.$dir.getAccount(this._vm.$dir.ACCOUNT_CUSTODIAN),
      scope: this._vm.$dir.dacId,
      table: 'candidates',
      index_position: 2,
      key_type: 'i64',
      limit: conf.numelected * 3
    })
    for (let c = 0; c < res.rows.length; c++) {
      const row = res.rows[c]
      if (row.is_active && parseInt(row.total_votes) > 0) {
        numCandidates++
      }
      if (numCandidates >= requiredCandidates) {
        break
      }
    }

    console.log(`numCandidates ${numCandidates} / ${requiredCandidates}`)

    if (numCandidates >= requiredCandidates) {
      activationStats.canActivate = true
    }
    // }
  }

  activationStats.numCandidates = numCandidates
  activationStats.requiredCandidates = requiredCandidates

  commit('setActivationStats', activationStats)
}

export async function fetchCustodianPermissions ({
  commit,
  dispatch,
  state,
  rootState
}) {
  const api = await dispatch('global/getDacApi', false, { root: true })
  let customCandPermissions = await api.getCandidatePermissions()
  console.log('custom cand permissions', customCandPermissions)

  let requested = rootState.dac.candidates
    .slice(0, rootState.dac.custodianConfig.numelected * 2)
    .map(c => {
      let permission = 'active' // default
      let custom = customCandPermissions.find(
        ccp => ccp.cand === c.candidate_name
      )
      if (custom) {
        permission = custom.permission
      }
      return { actor: c.candidate_name, permission: permission }
    })
  commit('setCustodianPermissions', requested)
  return requested
}

export async function fetchWorkerProposal ({ commit, dispatch }, payload = {}) {
  const api = await dispatch('global/getDacApi', false, { root: true })
  const wps = api.getWpsById(payload)
  // commit('setWorkerProposals', wps)
  return wps
}

export async function fetchWorkerProposals ({ commit, dispatch }, payload = {}) {
  const api = await dispatch('global/getDacApi', false, { root: true })
  const wps = api.getWps(payload)
  commit('setWorkerProposals', wps)
  return wps
}

export async function fetchWorkerProposalsInbox (obj, payload = {}) {
  let url = this._vm.$configFile.get('dacapi')
  const header = {
    'X-DAC-Name': this._vm.$dir.dacId
  }
  return this._vm
    .$axios({
      method: 'get',
      url: `${url}/proposals_inbox`,
      params: payload,
      headers: header
    })
    .then(r => {
      // console.log(r.data)
      return r.data
    })
    .catch(e => {
      console.log('could not load worker proposals from api')
      return []
    })
}

// canceltoken to fix glitch when multiple requests are made fast
var call
export async function fetchMsigProposals (obj, payload = {}) {
  // {status: 1, limit:0, skip: 1}
  if (call) {
    call.cancel()
  }
  call = this._vm.$axios.CancelToken.source()
  let url = this._vm.$configFile.get('dacapi')
  const header = {
    'X-DAC-Name': this._vm.$dir.dacId
  }
  return this._vm
    .$axios({
      method: 'get',
      url: `${url}/msig_proposals`,
      params: payload,
      headers: header,
      cancelToken: call.token
    })
    .then(r => {
      // console.log(r.data)
      return r.data
    })
    .catch(e => {
      console.log('could not load worker proposals from api')
      // return [];
    })
}

export async function fetchReferendums (obj, payload = {}) {
  if (call) {
    call.cancel()
  }
  call = this._vm.$axios.CancelToken.source()
  let url = this._vm.$configFile.get('dacapi')
  const header = {
    'X-DAC-Name': this._vm.$dir.dacId
  }
  return this._vm
    .$axios({
      method: 'get',
      url: `${url}/referendums`,
      params: payload,
      headers: header,
      cancelToken: call.token
    })
    .then(r => {
      console.log(r.data)
      return r.data
    })
    .catch(e => {
      console.log('could not load referendums from api')
      // return [];
    })
}

export async function fetchTokenTimeLine (obj, payload = {}) {
  // {account: 'piecesnbitss', contract:'kasdactokens', symbol:'KASDAC', start_block:10000000, end_block:17000000}
  let url = this._vm.$configFile.get('dacapi')
  const header = {
    'X-DAC-Name': this._vm.$dir.dacId
  }
  return this._vm
    .$axios({
      method: 'get',
      url: `${url}/balance_timeline`,
      params: payload,
      headers: header
    })
    .then(r => {
      // console.log(r.data)
      return r.data
    })
    .catch(e => {
      console.log('could not load token timeline from api')
      return []
    })
}

export async function fetchDACTokenTransfers (obj, payload = {}) {
  let url = this._vm.$configFile.get('dacapi')
  const header = {
    'X-DAC-Name': this._vm.$dir.dacId
  }
  return this._vm
    .$axios({
      method: 'get',
      url: `${url}/transfers`,
      params: payload,
      headers: header
    })
    .then(r => {
      // console.log(r.data)
      return r.data
    })
    .catch(e => {
      console.log('could not load transfers from api')
      return []
    })
}

export async function fetchMemberCounts (obj, payload = {}) {
  let url = this._vm.$configFile.get('dacapi')
  const header = {
    'X-DAC-Name': this._vm.$dir.dacId
  }
  return this._vm
    .$axios({
      method: 'get',
      url: `${url}/member_counts`,
      params: payload,
      headers: header
    })
    .then(r => {
      console.log(r.data)
      return r.data
    })
    .catch(e => {
      console.log('could not load membercounts from api')
      return []
    })
}

export async function fetchVotesTimeline (obj, payload = {}) {
  let url = this._vm.$configFile.get('dacapi')
  const header = {
    'X-DAC-Name': this._vm.$dir.dacId
  }
  return this._vm
    .$axios({
      method: 'get',
      url: `${url}/votes_timeline`,
      params: payload,
      headers: header
    })
    .then(r => {
      console.log(r.data)
      return r.data
    })
    .catch(e => {
      console.log('could not load votes_timeline from api')
      return []
    })
}

export async function fetchTokenMarketData (obj, payload = {}) {
  const pricefeed = this._vm.$configFile.get('pricefeed')
  if (pricefeed && pricefeed.newdex.endpoint) {
    try {
      const market = await this._vm.$axios.get(`${pricefeed.newdex.endpoint}?symbol=${pricefeed.newdex.symbol}`)
      return market.data.data
    } catch (e) {
      console.error('pricefeed error', e)
    }
  }
  return false
}

export async function fetchTokenHistoryPrice (obj, payload = {}) {
  let url =
    'https://api.coingecko.com/api/v3/coins/eosdac/market_chart?vs_currency=usd&days=7'
  console.log(url)
  if (url) {
    let history = await this._vm.$axios
      .get(url)
      .then(m => m.data.prices)
      .catch(e => false)
    console.log(history)
    return history
  } else {
    return false
  }
}
