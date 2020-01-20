<template>
  <div>
    <div v-if="getCustodianState.met_initial_votes_threshold === 1">
      <div class="shadow-4 rounded-borders q-pa-md q-mb-md">
      <div class="row items-center justify-between ">
        <q-chip dense v-if="new_period_millisleft > 0">
          <div class="row items-center">
            <div class="q-mr-sm q-caption">{{ $t("display_custodians.new_election") }}</div>
            <countdown
              v-if="new_period_millisleft"
              :time="Number(new_period_millisleft)"
            >
              <template slot-scope="props">
                <div class="q-caption text-weight-light">
                  <span v-if="props.days">{{ props.days }} {{ $t("display_custodians.days") }}, </span>
                  <span v-if="props.hours">{{ props.hours }} {{ $t("display_custodians.hours") }}, </span>
                  <span v-if="props.minutes">{{ props.minutes }} {{ $t("display_custodians.minutes") }},</span>
                  <span>{{ props.seconds }} {{ $t("display_custodians.seconds") }}</span>
                </div>
              </template>
            </countdown>
          </div>
        </q-chip>
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
          <div class="col-md-6">
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
              <div class="col-6">{{ getActivationStats.votePercentage.toFixed(2) }}% of
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
      showing: false
    }
  },

  computed: {
    ...mapGetters({
      tokenStats: 'dac/getTokenStats',
      getCustodians: 'dac/getCustodians',
      getCustodianState: 'dac/getCustodianState',
      getActivationStats: 'dac/getActivationStats',
      getCustodianConfig: 'dac/getCustodianConfig'
    }),
    getVotingProgress () {
      // this.$store.dispatch("api/getTokenStats");
      return this.getActivationStats.votePercentage
    },
    new_period_millisleft () {
      let lastperiodtime = this.getCustodianState.lastperiodtime
      const periodLength = this.getCustodianConfig.periodlength
      if (periodLength && lastperiodtime) {
        if (Number.isInteger(lastperiodtime)) {
          lastperiodtime = new Date(lastperiodtime * 1000)
        } else {
          // example "2019-05-06 18:34:46"
          lastperiodtime = new Date(
            Date.parse(lastperiodtime.replace(' UTC', ''))
          )
        }
        let end = addToDate(lastperiodtime, {
          seconds: periodLength
        })
        return (
          Date.parse(date.formatDate(end, 'YYYY-MM-DD HH:mm:ss')) -
          Date.parse(new Date())
        )
      }

      return 0
    }
  },

  methods: {
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
