<template>
  <q-page class="q-pa-md bg-logo">
    <div class="row gutter-sm">
      <!-- <div class="col-xs-12 col-xl-6">
        <div  class="bg-bg1 round-borders shadow-4 relative-position overflow-hidden full-height q-pa-md " >
        Memberclient version: v{{getDapp_version}}
        Local Storage version: v{{getLocal_storage_version}}
        </div>
      </div>-->

      <!-- end v-for = setting group -->

      <div>
        <q-item>
          <q-item-main>
            <q-item-tile class="text-text1" label>
              {{ $t(`settings.locale_language_l`) }}
            </q-item-tile>
            <lang-selector :label="false" />
          </q-item-main>
        </q-item>
      </div>

      <div class="row justify-end">
        <div class="text-weight-thin q-pa-md q-caption">
          Memberclient: v{{ getDapp_version }} · Local Storage: v{{
            getLocal_storage_version
          }}
        </div>
      </div>
    </div>

<!--    <debug-data :data="[{ getSettings: getSettings }]" />-->
  </q-page>
</template>
<!--
<style lang="stylus">
@import '~variables';
</style>
-->
<script>
import { mapGetters } from 'vuex'
import langSelector from 'components/controls/lang-selector'
// import debugData from "components/ui/debug-data";

export default {
  name: 'settings',
  components: {
    // debugData,
    langSelector
  },
  data () {
    return {
      groups: [
        // { name: 'toolbar', icon: 'mdi-set-top-box' },
        // { name: 'notify', icon: 'mdi-message-text-outline' },
        { name: 'locale', icon: 'mdi-globe-model' } // ,
        // { name: 'debug', icon: 'mdi-bug-outline' },
        // { name: 'advanced', icon: 'mdi-code-braces' }
      ]
    }
  },
  computed: {
    ...mapGetters({
      getSettings: 'user/getSettings',
      getIsDark: 'ui/getIsDark',
      getSettingByName: 'user/getSettingByName',
      getLocal_storage_version: 'global/getLocal_storage_version',
      getDapp_version: 'global/getDapp_version'
    })
  },

  methods: {
    handle (v, t) {
      // this.$store.commit('user/setSettingItem', { name: t, value: v })
    }
  },
  beforeMount () {
    /* this.$store.subscribe((mutation, state) => {
      // console.log('dddddd', mutation.type)
      // console.log('dddddd',mutation.payload)
      if (mutation.type !== 'user/setSettingItem') return
      switch (mutation.payload.name) {
        case 'debug_console_log':
          if (mutation.payload.value) {
            this.$configFile.enable_ConsoleLog()
          } else {
            this.$configFile.disable_ConsoleLog()
          }
          break
        case 'debug_dev_tools':
          // enable/disable console.log when dev tools is open/close
          this.$store.commit('user/setSettingItem', {
            name: 'debug_console_log',
            value: mutation.payload.value
          })
          break

        default:
          break
      }
    }) */
  }
}
</script>
