import { DacApi } from '../../modules/dacapi.js'

// mobile debugging
// var VConsole = require("vconsole");
// var vConsole = new VConsole();
// console.log(vConsole);

export async function login ({ state, dispatch, rootGetters, commit }) {
  console.log('request login')
  await dispatch('ual/renderLoginModal', true, { root: true })
}

export async function logout ({ state, dispatch }) {
  console.log('request logout')
  dispatch('user/loggedOutRoutine', null, { root: true })
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
