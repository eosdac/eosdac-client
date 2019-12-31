import ScatterJS, { Network } from '@scatterjs/core'
import ScatterEOS from '@scatterjs/eosjs2'
import ScatterLynx from '@scatterjs/lynx'

import { Notify } from 'quasar'
// import axios from 'axios'

import { Api, JsonRpc } from '@jafri/eosjs2'
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

        Notify.create({
          message: `Signature provider not found`,
          timeout: 2000,
          type: 'negative',
          position: 'bottom-right'
        })

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

        Notify.create({
          message: `Welcome back ${state.scatter.identity.accounts[0].name}`,
          timeout: 2000,
          type: 'info',
          position: 'bottom-right'
        })
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
    Notify.create({
      message: `Trying to connect to signature provider`,
      timeout: 1500,
      type: 'info',
      position: 'bottom-right'
    })
    await dispatch('connectScatter', true)
    return
  }
  let account = await state.scatter.login().catch(e => {
    console.log(e)
    return false
  })

  if (account && account.accounts[0]) {
    dispatch('user/loggedInRoutine', account, { root: true })

    Notify.create({
      message: `Welcome ${account.accounts[0].name}`,
      timeout: 2000,
      type: 'info',
      position: 'bottom-right'
    })
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

  const api = this._vm.$eosApi

  commit('setDacApi', new DacApi(api, this._vm.$configFile, this._vm.$dir))
  return state.eosApi
}

export async function getEosScatter ({ state, commit }, rebuild = false) {
  if (state.eosScatter && !rebuild) {
    // console.log('got scatter api from store');
    return state.eosScatter
  }
  console.log('build and store scatter api', this._vm.$configFile.get('network'))
  let network = Network.fromJson(
    this._vm.$configFile.get('network')
  )
  const rpc = this._vm.$eosApi.rpc
  let eos = state.scatter.eos(network, Api, { rpc })
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
  try {
    const res = await this._vm.$eosApi.rpc.get_info()
    return res
  } catch (e) {
    return false
  }
}
