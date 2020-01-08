<template>
  <transition
    appear
    enter-active-class="animated fadeInUp"
    leave-active-class="animated fadeOutDown"
  >
    <div
      v-if="show && getAccountName && !forceHide"
      v-bind:class="{ 'drawer-margin': getDrawerIsOpen }"
      class=" trigger_new_period_msg bg-blue q-pa-md bg-logo-sm fixed"
    >
      <div class="row justify-between items-center q-mb-md ">
        <div class="text-h6">{{ $t("newperiod_first.call_new_period") }}</div>
        <q-btn class="no-shadow" icon="close" @click="close" />
      </div>

      <div class="q-mb-md full-width">
        {{ $t("newperiod_first.dac_locked") }}
      </div>

      <div class="row justify-end">
        <q-btn
          color="primary"
          icon="receipt"
          @click="callNewPeriod"
          :label="$t('newperiod_first.start_new_period')"
        />
      </div>
      <div style="clear:both"></div>
    </div>
  </transition>
</template>

<script>
import { mapGetters } from 'vuex'
export default {
  name: 'TriggerNewperiod',
  data () {
    return {
      show: false,
      forceHide: false
    }
  },
  computed: {
    ...mapGetters({
      tokenStats: 'dac/getTokenStats',
      getAccountName: 'user/getAccountName',
      getCustodianState: 'dac/getCustodianState',
      getCustodianConfig: 'dac/getCustodianConfig',
      getCustodians: 'dac/getCustodians',
      getActivationStats: 'dac/getActivationStats',
      getDrawerIsOpen: 'ui/getDrawerIsOpen'
    })
  },
  methods: {

    async shouldShow () {
      return !this.getActivationStats.active && this.getActivationStats.canActivate
    },
    async callNewPeriod () {
      let actions = [
        {
          account: this.$dir.getAccount(this.$dir.ACCOUNT_CUSTODIAN),
          name: 'newperiode',
          data: {
            message: `First new period called by ${this.getAccountName}`,
            dac_id: this.$dir.dacId
          }
        }
      ]

      let result = await this.$store.dispatch('user/transact', {
        actions: actions
      })
      if (result) {
        await this.$store.dispatch('dac/fetchCustodianContractState')
      }
    },

    close () {
      this.show = false
      this.forceHide = true
    }
  },
  async mounted () {
    if (this.getActivationStats.voteQuorum === null) {
      await this.$store.dispatch('dac/fetchActivationStats')
    }
    let showHere = false
    if (this.$router.currentRoute.path !== '/constitution') {
      showHere = true
    }
    if (showHere) {
      this.show = await this.shouldShow()
    }
  },

  watch: {
    $route: function () {
      if (this.$router.currentRoute.path === '/constitution') {
        this.show = false
      } else {
        this.shouldShow().then(show => {
          this.show = show
        })
      }
    }
  }
}
</script>

<style lang="stylus">
.trigger_new_period_msg{
  border-top: 4px solid var(--q-color-info);
  z-index:2;
  width:100%;
  right:0;
  bottom:0;
}

.drawer-margin{
  padding-left:320px !important;
}
</style>
