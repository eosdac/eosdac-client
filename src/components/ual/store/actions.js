
export async function renderLoginModal ({ commit }) {
  commit('setShouldRenderLoginModal', true)
}

export async function logout ({ state, commit }) {
  let activeAuth = state.activeAuthenticator
  if (activeAuth) {
    console.log(`Logging out from authenticator: ${activeAuth.getStyle().text}`)
    activeAuth
      .logout()
      .then(() => {
        console.log('Logged out!')
        commit('setActiveAuthenticator', false)
        commit('setAccountName', false)
        commit('setSESSION', { accountName: null, authenticatorName: null })
      })
      .catch(e => {
        console.log(`An error occured while attempting to logout from authenticator: ${activeAuth.getStyle().text}`)
      })
  } else {
    console.log('No active authenticator found, you must be logged in before logging out.')
  }
}

export async function waitForAuthenticatorToLoad (_ = {}, authenticator) {
  return new Promise(resolve => {
    if (!authenticator.isLoading()) {
      resolve()
      return
    }
    const authenticatorIsLoadingCheck = setInterval(() => {
      if (!authenticator.isLoading()) {
        clearInterval(authenticatorIsLoadingCheck)
        resolve()
      }
    }, 250)
  })
}
export async function attemptAutoLogin ({ state, commit, dispatch }) {
  let { accountName, authenticatorName } = state.SESSION
  if (accountName && authenticatorName) {
    let authenticator = state.UAL.authenticators.find(a => a.getStyle().text === authenticatorName)
    await authenticator.init()
    await dispatch('waitForAuthenticatorToLoad', authenticator)
    if (authenticator.initError) {
      console.log(
        `Attempt to auto login with authenticator ${authenticatorName} failed because it's not available anymore.`
      )
      commit('setSESSION', { accountName: null, authenticatorName: null })
      return
    }
    authenticator
      .login(accountName)
      .then(() => {
        commit('setSESSION', { accountName, authenticatorName })
        commit('setAccountName', accountName)
        commit('setActiveAuthenticator', authenticator)
      })
      .catch(e => {
        commit('setSESSION', { accountName: null, authenticatorName: null })
        console.log('auto login error', e, e.cause)
      })
  }
}

export async function transact ({ state, dispatch, commit }, payload) {
  const { actions, afterTransact } = payload
  commit('setSigningOverlay', { show: true, status: 0, msg: 'Waiting for Signature', isShowCloseButton: false })
  const user = state.activeAuthenticator.users[0]
  console.log(`Users`, user, state.activeAuthenticator.users)
  const copiedActions = actions.map((action, index) => {
    if (!action.authorization) {
      action.authorization = [{ actor: user.accountName, permission: 'active' }]
    }
    return action
  })
  try {
    try {
      await user.signTransaction({ actions: copiedActions }, { broadcast: true })
      afterTransact()
    } catch (e) {
      afterTransact(parseUalError(e))
    }
  } catch {}
  commit('setSigningOverlay', { show: false, status: 0 })
}

export function hideSigningOverlay ({ commit }, ms = 10000) {
  return new Promise(resolve => {
    setTimeout(() => {
      commit('setSigningOverlay', { show: false, status: 0 })
      resolve()
    }, ms)
  })
}

function parseUalError (error) {
  let cause = 'unknown cause'
  let errorCode = ''
  if (error.cause) {
    cause = error.cause.reason || error.cause.message || 'Report this error to the eosDAC devs to enhance the UX'
    errorCode = error.cause.code || error.cause.errorCode
  }
  console.log(cause)
  return `${error}. ${cause} ${errorCode}`
}
