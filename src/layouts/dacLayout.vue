
<template>
  <q-layout view="hHh lpR fFf">

    <q-header elevated class="bg-bg2 q-pa-md">
      <q-toolbar>
        <q-btn dense flat round icon="menu" />

        <q-toolbar-title>
          <span>
            <img
                    class="cursor-pointer gt-xs"
                    @click="$router.push('/')"
                    src="../extensions/branding/images/logo/logo-main.svg"
                    style="height:48px;"
                    :title="$t('default.member_client')"
            />
            <img
                    class="cursor-pointer lt-sm"
                    @click="$router.push('/')"
                    src="../extensions/branding/images/logo/logo-notext.svg"
                    style="height:48px;"
                    :title="$t('default.member_client')"
            />
          </span>
        </q-toolbar-title>
        <toolbar-menu v-if="!loading" />
      </q-toolbar>
    </q-header>

    <q-drawer show-if-above v-model="left" side="left" bordered>
      <!-- drawer content -->

      <main-menu />

      <div
              class="absolute-bottom text-text2 q-pa-md cursor-pointer"
              @click="openURL('https://eosdac.io')"
      >
        <div class="row items-center justify-end">
          <img style="width:20px" src="../assets/eosdac_logo_notext.svg" />
          <span class="q-ml-sm q-caption">Powered by eosDAC</span>
        </div>
      </div>
    </q-drawer>

    <q-page-container>
      <request-signature />
      <router-view />
      <transactionOverlay />
    </q-page-container>

  </q-layout>
</template>

<script>
import { openURL } from 'quasar'
import { mapGetters } from 'vuex'

import transactionOverlay from 'components/ui/transaction-overlay'
import toolbarMenu from 'components/controls/menus/toolbar-menu'
import mainMenu from 'components/controls/menus/main-menu'
import requestSignature from 'components/ui/request-signature'
// import triggerNewperiod from "components/controls/trigger-newperiod";

export default {
  name: 'eosDACLayout',
  components: {
    transactionOverlay,
    toolbarMenu,
    mainMenu,
    requestSignature/*,
    triggerNewperiod */
  },
  data () {
    return {
      loading: false
    }
  },
  computed: {
    ...mapGetters({
      getAccountName: 'user/getAccountName',
      getIsloaded: 'dac/getIsLoaded',
      getSettingByName: 'user/getSettingByName'
    })
  },

  methods: {
    openURL
  },

  async mounted () {
    // this.$store.commit('ui/setDrawerIsOpen', true)
  },

  watch: {}
}
</script>

<!--
<template>
  <q-layout view="hHh Lpr lff">
    <q-layout-header
      class="no-shadow"
      :reveal="getSettingByName('toolbar_reveal').value"
    >
      <q-toolbar color="bg1">

        <q-toolbar-title>xxx
          <span>
            <img
              class="cursor-pointer gt-xs"
              @click="$router.push('/')"
              :src="$configFile.get('theme_images').logo_url"
              style="height:48px;"
              :title="$t('default.member_client')"
            />
            <img
              class="cursor-pointer lt-sm"
              @click="$router.push('/')"
              :src="$configFile.get('theme_images').logo_notext_url"
              style="height:48px;"
              :title="$t('default.member_client')"
            />
          </span>
        </q-toolbar-title>
        <toolbar-menu v-if="!loading" />
      </q-toolbar>
    </q-layout-header>

    <q-layout-drawer
      v-model="leftDrawerOpen"
      @show="handleDrawerEvent(true)"
      @hide="handleDrawerEvent(false)"
      content-class="bg-bg1 relative-position overflow-hidden"
      ref="leftdrawer"
    >
      <main-menu />
      <div
        class="absolute-bottom text-text2 q-pa-md cursor-pointer"
        @click="openURL('https://eosdac.io')"
      >
        <div class="row items-center justify-end">
          <img style="width:20px" src="statics/images/eosdac_logo_notext.svg" />
          <span class="q-ml-sm q-caption">Powered by eosDAC</span>
        </div>
      </div>
    </q-layout-drawer>

    <q-page-container class="bg-bg2 text-text1 relative-position">
      <request-signature />
      <router-view />
      <transactionOverlay />
    </q-page-container>

    <q-btn
      v-back-to-top.animate="{ offset: 500, duration: 200 }"
      round
      size="18px"
      color="primary"
      class="fixed-bottom-right animate-pop"
      style="margin: 0 15px 15px 0"
    >
      <q-icon name="keyboard_arrow_up" />
    </q-btn>
  </q-layout>
</template>-->
