export function getNodeInfo (state, payload) {
  return state.nodeInfo
}
export function getScatter (state) {
  return state.scatter
}

export function getDacApi (state) {
  return state.eosApi
}

export function getAccountName (state) {
  return state.accountName
}

export function getNetwork (state) {
  return state.network
}

export function getDappVersion (state) {
  return state.dapp_version
}

export function getLocalStorageVersion (state) {
  return state.local_storage_version
}

export function getChainId (state) {
  return state.chainId
}
