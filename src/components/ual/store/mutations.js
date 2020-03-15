export function setShouldRenderLoginModal (state, payload) {
  state.showLoginModal = payload
}

export function setSigningOverlay (state, payload) {
  state.signingOverlay = Object.assign(state.signingOverlay, payload)
}

export function setUAL (state, payload) {
  state.UAL = payload
}

export function setActiveAuthenticator (state, payload) {
  state.activeAuthenticator = payload
}

export function setAuthenticatorUser (state, payload) {
  state.authenticatorUser = payload
}

export function setSESSION (state, payload) {
  payload.timestamp = new Date().getTime()
  state.SESSION = Object.assign(state.SESSION, payload)
}

export function setAccountName (state, payload) {
  state.accountName = payload
}

export function setPaymentInfo (state, payload) {
  state.paymentInfo = payload
}
