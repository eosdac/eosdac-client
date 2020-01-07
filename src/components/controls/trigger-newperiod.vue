<template>
  <transition
    appear
    enter-active-class="animated fadeInUp"
    leave-active-class="animated fadeOutDown"
  >
    <div
      v-if="show && getAccountName && !forceHide"
      v-bind:class="{ 'drawer-margin': getDrawerIsOpen }"
      class=" trigger_new_period_msg bg-blue q-pa-md bg-logo fixed"
    >{{show}}
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
      getDrawerIsOpen: 'ui/getDrawerIsOpen'
    })
  },
  methods: {

    async shouldShow () {
      console.log('shouldShow')
      if (this.getCustodianState.met_initial_votes_threshold || this.getCustodianState.lastperiodtime !== '1970-01-01T00:00:00') {
        console.log('state', this.getCustodianState)
        return false
      }

      // this.$store.dispatch("api/getTokenStats");
      if (
        this.getCustodianState.total_weight_of_votes !== null &&
              this.tokenStats.supply !== null
      ) {
        let [amount] = this.tokenStats.supply.split(' ')
        const totalsupply =
                parseFloat(amount) * Math.pow(10, this.tokenStats.precision)
        const quorum =
                totalsupply *
                (this.getCustodianConfig.initial_vote_quorum_percent / 100)

        // return totalsupply;
        const percentage =
                (this.getCustodianState.total_weight_of_votes / quorum) * 100
        console.log(percentage)
        if (percentage >= 100) {
          // check enough candidates
          console.log('config', this.getCustodianConfig)
          const requiredCandidates = this.getCustodianConfig.numelected
          console.log(requiredCandidates)
          const res = await this.$eosApi.rpc.get_table_rows({
            code: this.$dir.getAccount(this.$dir.ACCOUNT_CUSTODIAN),
            scope: this.$dir.dacId,
            table: 'candidates',
            index_position: 2,
            key_type: 'i64',
            limit: this.getCustodianConfig.numelected * 3
          })
          let numCandidates = 0
          for (let c = 0; c < res.rows.length; c++) {
            const row = res.rows[c]
            if (row.is_active && parseInt(row.total_votes) > 0) {
              numCandidates++
            }
            if (numCandidates >= this.getCustodianConfig.numelected) {
              break
            }
          }
          console.log(`numCandidates ${numCandidates} / ${this.getCustodianConfig.numelected}`)
          if (numCandidates >= this.getCustodianConfig.numelected) {
            console.log(`should show`)
            return true
          }
        }
      }

      console.log(`Do not show newperiod`)
      return false
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
    if (this.getCustodianState.lastperiodtime === null) {
      await this.$store.dispatch('dac/fetchCustodianContractState')
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
