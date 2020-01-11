export function setNodeInfo (state, payload) {
  state.nodeInfo = payload
}

export function setDacApi (state, payload) {
  state.eosApi = payload
}

export function setDacDirectory (state, payload) {
  console.log(`setting dac directory`)
  state.dacDirectory = payload
}

export function setChainId (state, payload) {
  state.chainId = payload
}

export function setDappVersion (state, payload) {
  state.dapp_version = payload
}
export function setLocalStorageVersion (state, payload) {
  state.local_storage_version = payload
}
export function setNetwork (state, payload) {
  state.network = payload
}

export function setNode (state, nodeurl) {
  state.eosApi = null
}
