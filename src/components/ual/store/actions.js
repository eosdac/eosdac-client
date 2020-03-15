
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
  const { accountName, authenticatorName } = state.SESSION
  if (accountName && authenticatorName) {
    commit('setAccountName', accountName)
    dispatch('user/loggedInRoutine', accountName, { root: true })

    window.setTimeout(async () => {
      const authenticator = state.UAL.authenticators.find(a => a.getStyle().text === authenticatorName)
      if (!authenticator) {
        console.log(`Could not find authenticator ${authenticatorName}`)
        commit('setSESSION', { accountName: null, authenticatorName: null })
        return
      }
      await authenticator.reset()
      await authenticator.init()
      await dispatch('waitForAuthenticatorToLoad', authenticator)
      if (authenticator.initError) {
        console.log(
          `Attempt to auto login with authenticator ${authenticatorName} failed.`
        )
        authenticator.reset()
        // await dispatch('attemptAutoLogin')

        commit('setSESSION', { accountName: null, authenticatorName: null })
        return
      }

      console.log(`Auto login for ${accountName}`)

      authenticator
        .login(accountName)
        .then(() => {
          commit('setSESSION', { accountName, authenticatorName })
          commit('setActiveAuthenticator', authenticator)
          commit('setAccountName', accountName)
          dispatch('user/loggedInRoutine', accountName, { root: true })
        })
        .catch(e => {
          commit('setSESSION', { accountName: null, authenticatorName: null })
          console.log('auto login error', e, e.cause)
        })
    }, 500)
  }
}

export async function transact ({ state, dispatch, commit }, payload) {
  const { actions } = payload
  const { accountName, authenticatorName, permission } = state.SESSION
  console.log(`transact with stored state ${authenticatorName} ${accountName}@${permission}`, state.activeAuthenticator.users)
  // commit('setSigningOverlay', { show: true, status: 0, msg: 'Waiting for Signature', isShowCloseButton: false })
  let user
  for (let u = 0; u < state.activeAuthenticator.users.length; u++) {
    if (await state.activeAuthenticator.users[u].getAccountName() === accountName) {
      user = state.activeAuthenticator.users[u]
    }
  }
  console.log(`Users`, user, state.activeAuthenticator.users)
  const copiedActions = actions.map((action, index) => {
    if (!action.authorization) {
      action.authorization = [{ actor: accountName, permission }]
    }
    return action
  })
  let res = null
  try {
    res = await user.signTransaction({ actions: copiedActions }, { broadcast: true })
    // afterTransact()
  } catch (e) {
    const [errMsg, errCode] = parseUalError(e)
    throw new Error(errMsg, errCode)
  }
  await commit('setSigningOverlay', { show: false, status: 0 })

  return res
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
  } else if (error.message) {
    cause = error.message
    errorCode = error.code
  }
  return [cause, errorCode]
}
