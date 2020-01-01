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

export async function fetchAccount ({ commit, dispatch }, payload) {
  const api = await dispatch('global/getDacApi', false, { root: true })
  const res = await api.getAccount(payload.accountname)
  if (res && res.account_name) {
    return res
  }
}

export async function fetchApprovalsFromProposal ({ dispatch }, payload) {
  const api = await dispatch('global/getDacApi', false, { root: true })
  const res = await api.getApprovalsFromProposal(payload)
  return res
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

export async function fetchWorkerProposals (obj, payload = {}) {
  let url = this._vm.$configFile.get('dacapi')
  const header = {
    'X-DAC-Name': this._vm.$dir.dacId
  }
  return this._vm
    .$axios({
      method: 'get',
      url: `${url}/proposals`,
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
  let url = this._vm.$configFile.get('marketapi')
  console.log('marketdata', url)
  if (url) {
    let market = await this._vm.$axios
      .get(url)
      .then(m => m.data.market_data)
      .catch(e => false)
    console.log(market)
    return market
  } else {
    return false
  }
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
