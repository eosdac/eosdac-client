<template>
  <div>
    <div v-if="getCustodianState.met_initial_votes_threshold === 1">
      <div class="shadow-4 rounded-borders q-pa-md q-mb-md">
      <div class="row items-center justify-between " v-if="msLeft !== null">
        <q-chip dense v-if="msLeft > 0">
          <div class="row items-center">
            <div class="q-mr-sm q-caption">{{ $t("display_custodians.new_election") }}</div>
            <countdown
              v-if="msLeft"
              :time="msLeft"
              :key="msLeft"
              emit-events
              @end="newperiodCheck"
            >
              <template slot-scope="props">
                <div class="q-caption text-weight-light">
                  <span v-if="props.days">{{ props.days }} {{ $t("general.days") }}, </span>
                  <span v-if="props.hours">{{ props.hours }} {{ $t("general.hours") }}, </span>
                  <span v-if="props.minutes">{{ props.minutes }} {{ $t("general.minutes") }},</span>
                  <span>{{ props.seconds }} {{ $t("general.seconds") }}</span>
                </div>
              </template>
            </countdown>
          </div>
        </q-chip>
        <div v-else-if="showWaitingNewperiod">
          <div class="text-warning rounded-borders q-mb-sm">
            <q-spinner />
            {{ $t("display_custodians.waiting_for_newperiod") }}...
          </div>

        </div>
        <div v-else-if="showManualNewperiod">
          <div class="text-warning rounded-borders q-mb-sm">
            {{ $t("display_custodians.newperiod_overdue") }}
            <q-btn color="info" @click="callNewPeriod">{{ $t("display_custodians.run_now") }}</q-btn>
          </div>
        </div>
      </div>

      <div class="row items-center q-col-gutter-sm" v-if="custodians.length">
        <div
                class="col-lg-1 text-center"
                v-for="(custodian, i) in custodians"
                :key="`cust_${i}`"
                @mouseover="showing = true"
        >
            <profile-pic
                    :accountname="custodian.cust_name"
                    :scale="1"
                    :show_role="false"
            />
          <router-link
                  class="profile-link q-mt-xs"
                  :to="{ path: '/profile/' + custodian.cust_name }"
          >{{ custodian.cust_name }}</router-link>

        </div>
      </div>
      <div v-else class="q-py-md">
        {{ $t("vote_custodians.no_custodians") }}
      </div>

    </div>
    </div>

    <div v-if="!getActivationStats.active && getActivationStats.votePercentage">
      <div class="shadow-4 rounded-borders q-pa-md q-mb-md bg-info">
        <div class="text-h6">{{ $t("display_custodians.activation_progress") }}</div>
        <div class="row q-col-gutter-lg">
          <div class="col-md-6" v-if="getActivationStats.voteQuorum > 0">
            <div class="row">
              <div class="col-12">
                <q-linear-progress
                        animate
                        stripe
                        class="rounded-borders"
                        style="height:20px"
                        color="secondary"
                        :value="getActivationStats.votePercentage"
                />
              </div>
            </div>
            <div class="row q-mt-sm">
              <div class="col-6">{{ $t("display_custodians.voting_progress") }}</div>
              <div class="col-6">{{ (getActivationStats.votePercentage * 100).toFixed(2) }}% of
                {{ getActivationStats.voteQuorum }}%</div>
              </div>
          </div>
          <div class="col-md-6">
            <div class="row">
              <div class="col-12">
                <q-linear-progress
                        animate
                        stripe
                        class="rounded-borders"
                        color="secondary"
                        style="height:20px"
                        :value="getActivationStats.numCandidates / getActivationStats.requiredCandidates"
                />
              </div>
            </div>
            <div class="row q-mt-sm">
              <div class="col-6">{{ $t("display_custodians.candidates_votes") }}</div>
              <div class="col-6">{{ getActivationStats.numCandidates }} /
                {{ getActivationStats.requiredCandidates }}</div>
            </div>
          </div>
        </div>
      </div>

    </div>
  </div>
</template>

<script>
import profilePic from './profile-pic'
import { mapGetters } from 'vuex'
import countdown from '@chenfengyuan/vue-countdown'
import { date } from 'quasar'
const { addToDate } = date

export default {
  name: 'displayCustodians',
  components: {
    profilePic,
    countdown
  },

  props: {
    data: Object
  },

  data () {
    return {
      custodians: [],
      showing: false,
      msLeft: null,
      recalcInterval: null,
      showWaitingNewperiod: false,
      showManualNewperiod: false
    }
  },

  computed: {
    ...mapGetters({
      tokenStats: 'dac/getTokenStats',
      getAccountName: 'user/getAccountName',
      getCustodians: 'dac/getCustodians',
      getCustodianState: 'dac/getCustodianState',
      getActivationStats: 'dac/getActivationStats',
      getCustodianConfig: 'dac/getCustodianConfig'
    }),
    getVotingProgress () {
      // this.$store.dispatch("api/getTokenStats");
      return this.getActivationStats.votePercentage
    }
  },

  methods: {
    async newperiodCheck () {
      if (this.recalcInterval && this.msLeft !== null) {
        return
      }

      this.showWaitingNewperiod = true
      this.msLeft = -1
      this.recalcInterval = setInterval(() => {
        console.log(`check update`)
        this.recalcNewperiodTime()
      }, 5000)
    },
    async recalcNewperiodTime () {
      await this.$store.dispatch('dac/fetchCustodianContractState')
      let lastperiodtime = this.getCustodianState.lastperiodtime
      const periodLength = this.getCustodianConfig.periodlength
      if (periodLength && lastperiodtime) {
        if (Number.isInteger(lastperiodtime)) {
          lastperiodtime = new Date(lastperiodtime * 1000)
        } else {
          // example "2019-05-06 18:34:46"
          lastperiodtime = new Date(Date.parse(lastperiodtime.replace(' UTC', ''))
          )
        }
        let end = addToDate(lastperiodtime, {
          seconds: periodLength
        })
        const millisleft = Date.parse(date.formatDate(end, 'YYYY-MM-DD HH:mm:ss')) - new Date().getTime()

        console.log(`Time left = ${millisleft}`)

        if (millisleft > 0) {
          this.showWaitingNewperiod = false
          this.msLeft = millisleft
          if (this.recalcInterval) {
            console.log(`clearing interval `, this.recalcInterval)
            clearInterval(this.recalcInterval)
            this.recalcInterval = null
          }
        } else if (millisleft < -180000) {
          this.showManualNewperiod = true
          this.msLeft = millisleft
        } else if (millisleft < 0) {
          this.showWaitingNewperiod = true
          this.msLeft = millisleft
          this.newperiodCheck()
        }

        return millisleft
      }

      return 0
    },
    async setCustodians () {
      let custodians
      if (!this.getCustodians) {
        custodians = await this.$store.dispatch('dac/fetchCustodians')
      } else {
        custodians = this.getCustodians
      }
      this.custodians = custodians.map(c => {
        c.tooltip = false
        return c
      })
    },
    async callNewPeriod () {
      let actions = [
        {
          account: this.$dir.getAccount(this.$dir.ACCOUNT_CUSTODIAN),
          name: 'newperiode',
          data: {
            message: `New period called by ${this.getAccountName}`,
            dac_id: this.$dir.dacId
          }
        }
      ]

      let result = await this.$store.dispatch('user/transact', {
        actions: actions
      })
      if (result) {
        this.showManualNewperiod = false
        await this.$store.dispatch('dac/fetchCustodianContractState')
      }
    }
  },

  async mounted () {
    if (this.getCustodians) {
      this.setCustodians()
    }
    if (this.getCustodianState.met_initial_votes_threshold === null) {
      await this.$store.dispatch('dac/fetchCustodianContractState')
    }
    if (this.getActivationStats.voteQuorum === null) {
      await this.$store.dispatch('dac/fetchActivationStats')
    }
    console.log(`MOUNTED`)
    this.recalcNewperiodTime()
  },

  watch: {
    getCustodians (oldval, newval) {
      if (newval) {
        this.setCustodians()
      }
    }
  }
}
</script>

<style lang="stylus">
.profile-link
  color: inherit
</style>
