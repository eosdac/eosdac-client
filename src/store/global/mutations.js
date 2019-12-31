export function setNodeInfo (state, payload) {
  state.nodeInfo = payload
}
export function setScatter (state, payload) {
  state.scatter = payload
}

export function setDacApi (state, payload) {
  state.eosApi = payload
}

export function setDacDirectory (state, payload) {
  console.log(`setting dac directory`)
  state.dacDirectory = payload
}

export function setEosScatter (state, payload) {
  state.eosScatter = payload
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
  // let [protocol, host, port] = nodeurl.split(':')

  // let parts = {
  //   protocol: protocol,
  //   host: host.replace(/\//g, ''),
  //   port: port || (protocol === 'https' ? '443' : '80')
  // }

  // set new node to the active network
  // let n = state.network
  // console.log(state)
  // Object.assign(n, parts)

  // delete our apis
  state.eosApi = state.eosScatter = null
}
