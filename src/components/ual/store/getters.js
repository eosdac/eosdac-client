export function getShouldRenderLoginModal (state) {
  return state.showLoginModal
}

export function getSigningOverlay (state) {
  return state.signingOverlay
}

export function getActiveAuthenticator (state) {
  return state.activeAuthenticator
}

export function getAuthenticatorUser (state) {
  return state.authenticatorUser
}

export function getAuthenticators (state) {
  if (state.UAL) {
    // console.log(state.UAL.getAuthenticators())
    return state.UAL.getAuthenticators().availableAuthenticators
    // return state.UAL.authenticators;
  } else {
    return []
  }
}

export function getSESSION (state) {
  return state.SESSION
}

export function getUAL (state) {
  return state.UAL
}

export function getAccountName (state) {
  return state.accountName
}
