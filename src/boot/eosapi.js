
import { Api, JsonRpc } from '@jafri/eosjs2'
const { TextDecoder, TextEncoder } = require('text-encoding')

export default ({ Vue }) => {
  console.log(`Loading eosapi`, Vue.prototype.$configFile.get('endpoints'))
  const rpc = new JsonRpc(Vue.prototype.$configFile.get('endpoints'))
  Vue.prototype.$eosApi = new Api({
    rpc,
    textDecoder: new TextDecoder(),
    textEncoder: new TextEncoder()
  })
}
