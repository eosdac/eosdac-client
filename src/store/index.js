import Vue from 'vue'
import Vuex from 'vuex'
import createPersistedState from 'vuex-persistedstate'

import global from './global'
import user from './user'
import dac from './dac'
import ui from './ui'
import ual from 'components/ual/store'

// let storeExtension
// try {
//   storeExtension = require('../extensions/store/store_extension').default
// } catch (e) {
//   storeExtension = {
//     modules: {},
//     plugins: []
//   }
// }

Vue.use(Vuex)

const store = new Vuex.Store({
  modules: {
    // ...storeExtension.modules,
    global,
    user,
    dac,
    ui,
    ual
  },
  plugins: [
    // ...storeExtension.plugins,
    createPersistedState({
      key: 'global',
      paths: [
        'global.active_network',
        'global.dapp_version',
        'global.local_storage_version'
      ]
    }),
    createPersistedState({
      key: 'user',
      paths: ['user.settings', 'user.language', 'user.msigIsSeenCache']
    })
  ]
})

export default store
