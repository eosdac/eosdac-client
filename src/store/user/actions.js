import { Notify, openURL } from 'quasar'
import { i18n } from '../../boot/i18n'

export async function loggedOutRoutine ({ commit, dispatch }) {
  commit('setIsLoaded', false)

  commit('setAccount', null)
  commit('setAccountName', null)
  commit('setDacBalance', null)
  commit('setAgreedTermsVersion', null)
  commit('setProfilePicture', null)
  commit('setIsCandidate', null)
  commit('setDacVotes', null)
  dispatch('ual/logout', null, { root: true })
  // commit('global/setDacApi', null, { root: true })
  commit('dac/setCustodianPermissions', null, { root: true })
}

export async function loggedInRoutine ({ state, commit, dispatch }, accountname) {
  commit('setAccount', { name: accountname, authority: 'active' })
  commit('setAccountName', accountname)
  commit('setIsLoaded', false)

  this._vm.$profiles.getAvatars([accountname]).then(a => {
    commit('setProfilePicture', a[0].image)
  })

  const api = await dispatch('global/getDacApi', false, { root: true })

  // requests for setting up the logged in user
  const requests = [
    api.getBalance(accountname),
    api.getStaked(accountname),
    api.getAgreedTermsVersion(accountname),
    api.isCandidate(accountname)
  ]
  console.log(JSON.stringify(await api.getAccount(accountname)))
  const [balance, staked, termsversion, isCandidate] = await Promise.all(requests)
  console.log('is canddate:', isCandidate)
  commit('setDacBalance', balance)
  commit('setStakedDacBalance', staked)
  commit('setAgreedTermsVersion', termsversion)
  // commit('setAccount', account);
  commit('setIsCandidate', isCandidate)

  commit('setIsLoaded', true)

  api
    .getBalance(
      accountname,
      this._vm.$configFile.get('systemtokencontract'),
      this._vm.$configFile.get('systemtokensymbol')
    )
    .then(x => {
      commit('setSystemBalance', x)
    })
    .catch(e => console.log(e))

  setTimeout(() => {
    dispatch('fetchDacVotes')
  }, 2000)
}

export async function fetchIsCandidate (
  { state, commit, dispatch },
  accountname = false
) {
  const accountN = accountname || state.accountName
  const api = await dispatch('global/getDacApi', false, { root: true })
  let isCandidate = await api.isCandidate(accountN)
  if (!accountname) {
    commit('setIsCandidate', isCandidate)
  } else {
    return isCandidate
  }
}

export async function fetchDacVotes (
  { state, commit, dispatch },
  accountname = false
) {
  const accountN = accountname || state.accountName
  const api = await dispatch('global/getDacApi', false, { root: true })
  let votes = await api.getVotes(accountN)
  if (!accountname) {
    commit('setDacVotes', votes)
    return votes
  } else {
    return votes
  }
}

export async function fetchBalances (
  { state, commit, dispatch },
  accountname = false
) {
  const accountN = accountname || state.accountName
  const api = await dispatch('global/getDacApi', false, { root: true })
  let requests = [
    api.getBalance(accountN),
    api.getBalance(accountN, 'eosio.token', 'EOS')
  ]
  let [dacbalance, systembalance] = await Promise.all(requests)
  if (!accountname) {
    commit('setDacBalance', dacbalance)
    commit('setSystemBalance', systembalance)
  } else {
    return [dacbalance, systembalance]
  }
}

// export async function fetchPendingPay(
//   { state, dispatch },
//   accountname = false
// ) {
//   const accountN = accountname || state.accountName;
//   const api = await dispatch("global/getDacApi", false, { root: true });
//   let res = await api.getPendingPay(accountN);
//   console.log(res);
//   return res;
// }

export async function fetchPendingPay (
  { state, dispatch },
  accountname = false
) {
  const accountN = accountname || state.accountName
  // console.log(`fetchPendingPay getting pay for ${accountN}, ${accountname} || ${state.accountName}`)
  const api = await dispatch('global/getDacApi', false, { root: true })

  const pay = await api.getPendingPay2(accountN)

  // console.log('fetchPendingPay', pay, accountN)
  return pay
}

export async function fetchCatDelegations (
  { state, dispatch, commit },
  accountname = false
) {
  const accountN = accountname || state.accountName
  const api = await dispatch('global/getDacApi', false, { root: true })
  let res = await api.getCatDelegations(accountN)
  commit('setCatDelegations', res)
  return res
}

export async function transact (
  { state, rootState, commit, dispatch, getters },
  payload
) {
  let DELAY_SEC =
    getters['getSettingByName']('trx_delay').value > 0
      ? getters['getSettingByName']('trx_delay').value
      : 0
  // let BROADCAST = true

  if (payload.options) {
    if (payload.options.delay !== undefined) {
      DELAY_SEC = payload.options.delay
    }
    // if (payload.options.broadcast !== undefined) {
    //   BROADCAST = payload.options.broadcast
    // }
  }

  let actions = payload.actions

  // if not logged in
  if (!state.accountName) {
    console.log('please login first')

    Notify.create({
      message: i18n.t('transaction.please_login'),
      timeout: 5000, // in milliseconds; 0 means no timeout
      type: 'info',
      detail: i18n.t('transaction.you_must_login'),
      position: 'bottom-right', // 'top', 'left', 'bottom-left' etc.
      actions: [
        {
          label: i18n.t('default.login'),
          icon: 'lock', // optional
          handler: () => {
            dispatch('global/login', null, { root: true })
          }
        }
      ]
    })

    return
  }

  console.log('loading scatter')
  commit('ui/setShowTransactionOverlay', 'loading', { root: true })

  // let account = (await rootState.global.scatter.login()).accounts[0] // same as getIdentity
  const account = state.account

  actions = actions.map(action => {
    if (!action.authorization) {
      action.authorization = [
        { actor: account.name, permission: account.authority }
      ]
    }
    return action
  })

  console.log(JSON.stringify(actions, null, 2))

  try {
    // let [eos] = await dispatch('global/getEosScatter', null, { root: true })
    setTimeout(() => {
      commit('ui/setShowTransactionOverlay', 'sign', { root: true })
    }, 1500)
    const result = await dispatch('ual/transact', { delay_sec: DELAY_SEC, actions: actions }, { root: true })
    commit('ui/setShowTransactionOverlay', 'success', { root: true })
    commit('setLastTransaction', result)

    Notify.create({
      message: i18n.t('transaction.transaction_successful'),
      timeout: 7000, // in milliseconds; 0 means no timeout
      type: 'positive',
      detail: actions.map(a => `${a.account} > ${a.name}`).join(', '),
      position: 'bottom-right', // 'top', 'left', 'bottom-left' etc.
      // closeBtn: true, // or string as button message e.g. 'dismiss'
      actions: [
        {
          label: i18n.t('transaction.explorer'),
          icon: 'link', // optional
          handler: () => {
            openURL(
              this._vm.$configFile.get('explorer_transaction').replace('{transaction_id}', result.transactionId)
            )
          }
        }
      ]
    })
    // add a delay befor returning the transaction result. this to give nodes time to sync.
    return await new Promise(resolve => setTimeout(() => resolve(result), 500))
  } catch (e) {
    console.log(`transaction error! ${e}`, e.type)
    let type = 'error'
    let message = 'unknown_error'
    if (e.type === 'signature_rejected' || e.message === 'User rejected the signature request') {
      message = 'transaction.signature_rejected'
      type = 'reject'
      commit('ui/setShowTransactionOverlay', 'cancelled', { root: true })
    } else {
      if (e.json) {
        message = parseError(e.json)
      } else {
        message = e.message
      }

      if (message.indexOf('ERR::') > -1) {
        message = message.substr(message.indexOf('ERR::'))
        const [, errI18n] = message.split('::')
        message = i18n.t(`contract_errors.${errI18n}`)
      }

      commit('ui/setShowTransactionOverlay', 'error', { root: true })
    }

    // Scatter specific errors
    if (message === 'firewalled' || message === 'malicious') {
      message = i18n.t(`contract_errors.scatter_firewall`)
    }

    // remove standard eosio prefix
    if (message.indexOf('assertion failure with message: ') === 0) {
      message = message.replace('assertion failure with message: ', '')
    }

    if (type === 'error') {
      await commit('ui/setShowTransactionError', i18n.t(message), { root: true })
    } else if (type === 'reject') {
      Notify.create({
        message: i18n.t('transaction.rejected'),
        timeout: 7000, // in milliseconds; 0 means no timeout
        icon: 'report_problem',
        color: 'warning',
        caption: i18n.t(message),
        position: 'bottom-right', // 'top', 'left', 'bottom-left' etc.
        closeBtn: true // or string as button message e.g. 'dismiss'
      })
    }

    return false
  }
}

export async function proposeMsig (
  { state, rootState, commit, dispatch, getters, rootGetters },
  payload
) {
  // payload example
  // {
  //   actions: [], //required
  //   requested: [],
  //   proposal_name: "aname",
  //   expiration: "2019-08-10T19:14:14",
  //   delay_sec: 0,
  //   title: "a title",
  //   description: "a description"
  // }

  const api = await dispatch('global/getDacApi', false, { root: true })
  // proposalname
  let proposalName = payload.proposal_name || this._vm.$helper.randomName()
  // expiration
  let exp = new Date()
  exp.setDate(exp.getDate() + 30)
  let [expiration] = exp.toISOString().split('.')

  // requested
  let requested = rootGetters['dac/getCustodianPermissions']
  if (!requested) {
    requested = await dispatch('dac/fetchCustodianPermissions', null, {
      root: true
    })
  }
  console.log(`requested permissions`, requested)
  // msig trx template
  let msigTrxTemplate = {
    expiration: payload.expiration || expiration,
    ref_block_num: 0,
    ref_block_prefix: 0,
    max_net_usage_words: 0,
    max_cpu_usage_ms: 0,
    delay_sec: payload.delay_sec || 0,
    actions: [],
    context_free_actions: [],
    transaction_extensions: [],
    signatures: [],
    context_free_data: []
  }

  // serialize action data and add to template
  for (let i = 0; i < payload.actions.length; i++) {
    let action = payload.actions[i]
    console.log(payload.actions[i])
    let hexdata = await api.serializeActionData(action)
    action.data = hexdata
    msigTrxTemplate.actions.push(action)
  }

  // do the transaction
  let propose = {
    account: this._vm.$configFile.get('systemmsigcontract'),
    name: 'propose',
    data: {
      proposer: state.accountName,
      proposal_name: proposalName,
      requested: payload.requested || requested,
      trx: msigTrxTemplate
    }
  }
  // handle the correct permission for the "proposed" action
  let PERM = rootGetters['dac/getAuthAccountPermLevel']

  const authAccount = this._vm.$dir.getAccount(this._vm.$dir.ACCOUNT_AUTH)
  const dacMsigContract = this._vm.$dir.getAccount(this._vm.$dir.ACCOUNT_MSIGS)

  let proposed = {
    account: dacMsigContract,
    name: 'proposede',
    authorization: [
      { actor: state.accountName, permission: getters['getAuth'] },
      { actor: authAccount, permission: PERM }
    ],
    data: {
      proposer: state.accountName,
      proposal_name: proposalName,
      dac_id: this._vm.$dir.dacId,
      metadata: JSON.stringify({
        title: payload.title || `Execute ${payload.actions.length} action(s) ${payload.actions[0].account}:${payload.actions[0].name}`,
        description: payload.description || ''
      })
    }
  }

  let msigActions = [propose, proposed]
  let res = await dispatch('transact', { actions: msigActions })
  if (res) {
    res.proposal_name = proposalName
  }
  return res
}

function parseError (err) {
  // example error: assertion failure with message: ERR::UNSTAKE_CANNOT_UNSTAKE_FROM_ACTIVE_CAND::Cannot unstake tokens for an active candidate. Call withdrawcand first.
  let message = '', parsed = ''
  if (typeof err === 'string') {
    message = err
  } else if (err && err.error) {
    // console.log(err)
    message = err.error.details[0].message
  }

  if (message && message.indexOf('ERR::') > -1) {
    parsed = message.substr(message.indexOf('ERR::'))
    let t = 'contract_errors.' + parsed.split('::')[1]
    parsed = t
  } else {
    if (err && err.error) {
      parsed = message
    }
  }
  return parsed
}
