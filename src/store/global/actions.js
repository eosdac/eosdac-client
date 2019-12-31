import ScatterJS, { Network } from '@scatterjs/core'
import ScatterEOS from '@scatterjs/eosjs2'
import ScatterLynx from '@scatterjs/lynx'

import { Notify } from 'quasar'
import axios from 'axios'

import { Api, JsonRpc } from 'eosjs'
const { TextDecoder, TextEncoder } = require('text-encoding')
import { DacApi } from '../../modules/dacapi.js'

// mobile debugging
// var VConsole = require("vconsole");
// var vConsole = new VConsole();
// console.log(vConsole);

ScatterJS.plugins(
  new ScatterEOS(),
  new ScatterLynx({
    Api,
    JsonRpc,
    textDecoder: new TextDecoder(),
    textEncoder: new TextEncoder()
  })
)

export async function connectScatter (
  { state, commit, dispatch, rootGetters },
  triggerLogin = false
) {
  let network = state.network
  console.log(network)
  commit('setChainId', network.chainId)
  ScatterJS.scatter
    .connect(this._vm.$configFile.get('dacname'), { network })
    .then(async connected => {
      if (!connected) {
        console.error('Could not connect to Scatter.')

        commit('user/setAccountName', false, { root: true })

        if (rootGetters['user/getSettingByName']('notify_error_msg').value) {
          Notify.create({
            message: `Signature provider not found`,
            timeout: 2000,
            type: 'negative',
            position: 'bottom-right'
          })
        }

        return
      }

      console.log('scatter connected')

      // eoslynx doesn't support suggest network... need to handle this
      console.log('Signature Provider', ScatterJS.wallet)
      if (ScatterJS.wallet !== 'Lynx') {
        let token = {
          token: {
            symbol: this._vm.$configFile.get('systemtokensymbol'),
            contract: this._vm.$configFile.get('systemtokencontract')
          }
        }
        let networkwithtoken = Object.assign({}, network, token)
        await ScatterJS.scatter
          .suggestNetwork(networkwithtoken)
          .then(res => console.log('suggestnetwork', res, networkwithtoken))
      }

      commit('setScatter', ScatterJS.scatter)

      if (ScatterJS.scatter.identity) {
        // logged in
        console.log('logged in')
        dispatch('user/loggedInRoutine', state.scatter.identity, {
          root: true
        })

        if (rootGetters['user/getSettingByName']('notify_info_msg').value) {
          Notify.create({
            message: `Welcome back ${state.scatter.identity.accounts[0].name}`,
            timeout: 2000,
            type: 'info',
            position: 'bottom-right'
          })
        }
      } else {
        // scatter connected but not logged in
        console.log('please log in.')
        if (triggerLogin && state.scatter !== null) await dispatch('login')
      }

      ScatterJS = null
    })
}

export async function login ({ state, dispatch, rootGetters, commit }) {
  console.log('request login')
  if (state.scatter === null) {
    console.log('scatter not found, trying to connect scatter')
    if (rootGetters['user/getSettingByName']('notify_info_msg').value) {
      Notify.create({
        message: `Trying to connect to signature provider`,
        timeout: 1500,
        type: 'info',
        position: 'bottom-right'
      })
    }
    await dispatch('connectScatter', true)
    return
  }
  let account = await state.scatter.login().catch(e => {
    console.log(e)
    return false
  })

  if (account && account.accounts[0]) {
    dispatch('user/loggedInRoutine', account, { root: true })

    if (rootGetters['user/getSettingByName']('notify_info_msg').value) {
      Notify.create({
        message: `Welcome ${account.accounts[0].name}`,
        timeout: 2000,
        type: 'info',
        position: 'bottom-right'
      })
    }
  }
}

export async function logout ({ state, dispatch }) {
  console.log('request logout')
  if (!state.scatter) {
    console.log('scatter not found')
    return
  }
  await state.scatter.logout().catch(e => console.log(e))
  dispatch('user/loggedOutRoutine', null, { root: true })

  console.log('loggedout')
}

export async function switchAccount ({ state, dispatch }) {
  await dispatch('logout')
  await dispatch('login')
}

export async function getDacApi ({ state, commit }, rebuild = false) {
  if (state.eosApi && !rebuild) {
    // console.log('got eos api from store');
    return state.eosApi
  }

  console.log('build and store eos api')
  let n = Network.fromJson(
    state.network
  )
  let rpc = new JsonRpc(n.fullhost())
  let api = await new Api({
    rpc,
    textDecoder: new TextDecoder(),
    textEncoder: new TextEncoder()
  })
  commit('setDacApi', new DacApi(api, this._vm.$configFile))
  return state.eosApi
}

export async function getEosScatter ({ state, commit }, rebuild = false) {
  if (state.eosScatter && !rebuild) {
    // console.log('got scatter api from store');
    return state.eosScatter
  }
  console.log('build and store scatter api', state.network)
  let network = Network.fromJson(
    state.network
  )
  let rpc = new JsonRpc(network.fullhost())
  let eos = state.scatter.eos(network, Api, { rpc, beta3: true })
  commit('setEosScatter', [eos])
  return [eos]
}

export async function loadConfig ({ Vue, state, commit }, payload) {
  console.log(`loading new config file`)
  const config = require(`../../extensions/statics/config/network`)

  if (payload.vm) {
    // setting new config in the plugin
    payload.vm.$configFile.setConfig(config)
    state.network = config.network
  }
}

export async function testEndpoint ({ state, commit }, endpointurl = false) {
  console.log(state)
  if (!endpointurl) {
    endpointurl = `${Network.fromJson(state.network).fullhost()}/v1/chain/get_info`
  }
  let timeout = 3000
  console.log('testing', endpointurl)
  let res = await axios({
    method: 'GET',
    url: `${endpointurl}`,
    timeout: timeout,
    headers: {
      'Content-Type': 'application/json'
    }
  })
    .then(res => {
      console.log(res.data)
      commit('setNodeInfo', res.data)
      return res.data
    })
    .catch(error => {
      if (error.code === 'ECONNABORTED') {
        console.log(`Slow endpoint. No response received after ${timeout}ms`)
      } else {
        console.log(`bad endpoint: ${endpointurl}`)
      }
      return false
    })
  return res
}