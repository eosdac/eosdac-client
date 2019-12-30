
export function setShowTransactionOverlay (state, payload) {
  // if (state.enableTransactionOverlay) {
  state.showTransactionOverlay = payload
  // }
}

export function setEnableTransactionOverlay (state, payload) {
  state.enableTransactionOverlay = payload
}

export function setDrawerIsOpen (state, payload) {
  state.drawerIsOpen = payload
}
