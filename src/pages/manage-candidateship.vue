<template>
  <q-page class="text-text2 ">
    <div class="q-pa-md animate-fade" v-if="getAccountName">
      <!-- is already a candidate UNREGISTER-->
      <div
        v-if="getIsCandidate && getIsCandidate.is_active"
      >
      <div class="row bg-logo bg-bg2 q-pa-md rounded-borders shadow-4 relative-position overflow-hidden">
        <!-- <div class="" style="bottom:-50%;right:-80%;"></div> -->
        <q-item class="no-padding">
          <q-item-section side>
            <profile-pic :accountname="getAccountName" :scale="2.0" style="width:80px;height:80px" />
          </q-item-section>
          <q-item-section>
            <q-item-label class="text-h5">{{$t("manage_candidateship.candidate")}}</q-item-label>
            <q-item-label caption>
              <div class="row items-center">
                {{ getIsCandidate.candidate_name}}
                <q-icon name="check" color="positive" size="lg" class="q-ml-lg" />
              </div>
            </q-item-label>
          </q-item-section>
        </q-item>
        <div class="q-mt-md">
          {{
            $t("manage_candidateship.page_description_registered", {
              dacname: $dir.title
            })
          }}
        </div>

        <div class="full-width">
          <q-item v-if="getEnableCustPayments" class="full-width">
                <q-item-section avatar>
                  <q-icon name="icon-type-2" />
                </q-item-section>

                <q-item-section>{{$t(`manage_candidateship.requestedpay`)}}</q-item-section>

                <q-item-section style="white-space: nowrap">
                  {{$helper.assetToLocaleNumber(getIsCandidate.requestedpay)}}
                </q-item-section>
          </q-item>

          <q-separator spaced inset />

          <q-item class="full-width">
                <q-item-section avatar>
                  <q-icon name="how_to_vote" />
                </q-item-section>

                <q-item-section>{{$t(`manage_candidateship.total_votes`)}}</q-item-section>

                <q-item-section>{{$helper.toLocaleNumber(getIsCandidate.total_votes / 10000)}}</q-item-section>

          </q-item>

          <q-separator spaced inset />

          <q-item class="full-width">
                <q-item-section avatar>
                  <q-icon name="icon-dac-balance" />
                </q-item-section>

                <q-item-section>{{$t(`manage_candidateship.current_stake`)}}</q-item-section>

                <q-item-section no-wrap>
                  <div class="row">
                    <div class="col-xs-6">{{$helper.assetSymbolToLocaleNumber(getStakedDacBalance, $dir.symbol.symbol)}}</div>
                    <div class="col-xs-4 q-pl-lg">
                      <q-btn
                              icon="add"
                              round
                              size="sm"
                              title="Increase stake"
                              color="primary"
                              @click="increase_stake_modal = true"
                      />
                    </div>
                  </div>
                </q-item-section>

          </q-item>
        </div>
      </div>
      <div class="row justify-end q-pt-md">
        <q-btn
                class="animate-pop"
                color="negative"
                @click="unregisterAsCandidate"
                :label="$t('manage_candidateship.unregister')"
        />
      </div>
      </div>
      <!-- end already a candidate -->

      <!-- Not a candidate REGISTER -->
      <div v-else class="bg-bg1 bg-logo q-pa-md rounded-borders shadow-4">
        <q-item class="no-padding q-mb-md">
          <q-item-section avatar>
            <profile-pic :accountname="getAccountName" :scale="2.0" style="width:80px;height:80px" />
          </q-item-section>
          <q-item-section>
            <q-item-label>{{$t("manage_candidateship.member")}}</q-item-label>
            <q-item-label caption>{{ getAccountName }}</q-item-label>
          </q-item-section>
        </q-item>

        <span>{{
          $t("manage_candidateship.page_description_unregistered", {
            dacname: $dir.title
          })
        }}</span>
        <div class="row gutter-md q-mt-md">
          <div class="col-xs-12 col-md-6">
            <div>
              <span style="min-height:3em;display:block">{{
                $t("manage_candidateship.stake_description", {
                  minimum_stake: $helper.assetToLocaleNumber(
                    getCustodianConfig.lockupasset.quantity
                  )
                })
              }}</span>
              <q-item>
                <q-item-section>{{$t('manage_candidateship.current_stake')}}</q-item-section>
                <q-item-section>{{$helper.assetSymbolToLocaleNumber(getStakedDacBalance, $dir.symbol.symbol)}}</q-item-section>
              </q-item>
              <q-item>
                <q-item-section side>
                  <q-icon
                          name="icon-dac-balance"
                          v-bind:class="{
                            'text-positive': verifyAndGetStakeAmount,
                            'text-negative': !verifyAndGetStakeAmount
                          }" />
                </q-item-section>
                <q-item-section>
                  <q-input type="number" v-model="stakeamount" :label="$t('manage_candidateship.amount_to_stake_placeholder', {token_symbol: $dir.symbolCode})" />

                </q-item-section>
              </q-item>
            </div>
          </div>
          <div class="col-xs-12 col-md-6" v-if="getEnableCustPayments">
            <div>
              <span style="min-height:3em;display:block">{{
                $t("manage_candidateship.pay_description", {
                  requested_pay: $helper.assetToLocaleNumber(
                    getCustodianConfig.requested_pay_max.quantity
                  )
                })
              }}</span>
              <q-item class="q-pl-none">

                <q-item-section side>
                  <q-icon name="icon-type-2"
                          v-bind:class="{
                    'text-positive': verifyAndGetRequestedPay,
                    'text-negative': !verifyAndGetRequestedPay
                  }" />
                </q-item-section>
                <q-item-section>
                  <q-field
                          borderless
                          :label="$t(
                            'manage_candidateship.requested_custodian_pay_placeholder',
                            {
                              system_token: $configFile.get('systemtokensymbol')
                            }
                          )"
                          class="q-mb-sm"
                          v-bind:class="{
                            'text-positive': verifyAndGetRequestedPay,
                            'text-text2': !verifyAndGetRequestedPay
                          }"
                  >
                    <template v-slot:control>
                      <div class="self-center full-width no-outline" tabindex="0">
                        <q-input
                                class="no-padding"
                                type="number"
                                v-model="requestedpay"
                        />
                      </div>
                    </template>
                  </q-field>

                </q-item-section>

              </q-item>
            </div>
          </div>
        </div>

        <div class="row justify-end q-mt-md">
          <q-btn
            :disabled="!allowRegister"
            class="animate-pop"
            color="primary"
            @click="registerAsCandidate"
            :label="$t('manage_candidateship.register')"
          />
        </div>
      </div>
      <!-- end not a candidate -->

      <div
        v-if="
          getIsCandidate &&
            !getIsCandidate.is_active &&
            getStakedDacBalance
        "
        class=" bg-bg1 q-pa-md rounded-borders shadow-4 q-mt-md"
      >
        <span
          >{{ $t("manage_candidateship.unstake_description")
          }}{{ lockup_release_time_delay_days }}</span
        >

        <div class="row justify-between q-mt-md items-center">
          <div class="q-caption q-py-sm">
            <span class="text-positive"
              >Your stake
              {{$helper.assetToLocaleNumber(getStakedDacBalance + ' ' + $dir.symbol.symbol)}}</span
            >
            <span class="on-right"
              >Release Date:
              {{
                new Date("2019-05-09T19:17:10").toUTCString(
                  getIsCandidate.custodian_end_time_stamp
                )
              }}</span
            >
          </div>
          <q-btn
            class="animate-pop"
            color="primary"
            @click="unstake"
            :label="$t('manage_candidateship.unstake')"
          />
        </div>
      </div>
      <!-- {{$t('manage_candidateship.page_description_active_custodian', {dacname: $configFile.get('dacname')})}} -->
    </div>

    <div v-if="!getAccountName" class="animate-fade q-pa-md">
      Please login
    </div>

    <!--<div class="q-pa-md">
      <debug-data
        :data="[
          {
            getIsCandidate: getIsCandidate,
            getCustodianConfig: getCustodianConfig,
            inputs: inputs,
            lockup_release_time_delay_days: lockup_release_time_delay_days
          }
        ]"
      />
    </div>-->

    <q-dialog v-model="increase_stake_modal" minimized>
      <q-card>
        <q-card-section class="bg-primary">
          <div class="text-h5">Increase Your stake ({{ $dir.symbolCode }})</div>
        </q-card-section>
        <q-card-section>
          <q-input
                  type="number"
                  color="primary-light"
                  v-model="increase_stake_amount"
                  stack-label="Extra Stake"
                  placeholder="enter amount"
          />
        </q-card-section>
        <q-card-actions align="right">
          <q-btn label="ok" color="primary" @click="increase_stake" />
        </q-card-actions>
      </q-card>
    </q-dialog>
  </q-page>
</template>

<script>
import { mapGetters } from 'vuex'
import ProfilePic from '../components/ui/profile-pic'

export default {
  name: 'RegisterCandidate',
  components: {
    ProfilePic
  },
  data () {
    return {
      stakeamount: null,
      requestedpay: null,
      // requested_pay_max: 0,
      increase_stake_amount: '',
      increase_stake_modal: false
    }
  },

  computed: {
    ...mapGetters({
      getAccountName: 'user/getAccountName',
      getIsCandidate: 'user/getIsCandidate',
      getCustodianConfig: 'dac/getCustodianConfig',
      getStakedDacBalance: 'user/getStakedDacBalance',
      getEnableCustPayments: 'dac/getEnableCustPayments'
    }),

    lockup_release_time_delay_days () {
      if (this.getCustodianConfig.lockup_release_time_delay) {
        return this.getCustodianConfig.lockup_release_time_delay / 60 / 60 / 24
      }
      return 0
    },
    verifyAndGetRequestedPay () {
      if (
        this.requestedpay !== null &&
                this.requestedpay >= 0 &&
                this.requestedpay <=
                this.assetToNumber(this.getCustodianConfig.requested_pay_max.quantity)
      ) {
        let requested = parseFloat(this.requestedpay)
        if (isNaN(requested)) {
          requested = 0
        }
        return this.numberToAsset(
          requested.toFixed(
            this.$configFile.get('systemtokendecimals')
          ),
          this.$configFile.get('systemtokensymbol')
        )
      } else {
        console.log('requested pay out of range')
        return false
      }
    },
    verifyAndGetStakeAmount () {
      if (
        this.stakeamount !== null &&
                this.stakeamount + this.getStakedDacBalance >=
                this.assetToNumber(this.getCustodianConfig.lockupasset.quantity)
      ) {
        let staked = parseFloat(this.stakeamount)
        if (isNaN(staked)) {
          staked = 0
        }

        return this.numberToAsset(
          staked.toFixed(
            this.quantityToPrecision(
              this.getCustodianConfig.lockupasset.quantity
            )
          ),
          this.$dir.symbolCode
        )
      }

      return false
    },
    allowRegister () {
      return (
        (this.verifyAndGetRequestedPay || !this.getEnableCustPayments) &&
                this.verifyAndGetStakeAmount
      )
    }
  },

  methods: {
    numberToAsset (num, symbol) {
      return `${num} ${symbol}`
    },
    assetToNumber (asset) {
      if (asset) {
        return parseFloat(asset.split(' ')[0])
      }
    },
    quantityToPrecision (quantity) {
      if (quantity) {
        let [quan] = quantity.split(' ')
        const [, decimals] = quan.split('.')
        if (decimals) {
          return decimals.length
        }
        return 0
      }
    },

    async registerAsCandidate () {
      const stakeQty = this.verifyAndGetStakeAmount
      const [stakeQtyFloat] = stakeQty.split(' ')
      let stakeaction
      if (stakeQtyFloat) {
        stakeaction = {
          account: this.$dir.symbol.contract,
          name: 'stake',
          data: {
            account: this.getAccountName,
            quantity: stakeQty
          }
        }
      }

      let registeraction = {
        account: this.$dir.getAccount(this.$dir.ACCOUNT_CUSTODIAN),
        name: 'nominatecane',
        data: {
          cand: this.getAccountName,
          requestedpay: this.verifyAndGetRequestedPay,
          dac_id: this.$dir.dacId
        }
      }

      let actions = [registeraction]

      if (stakeQtyFloat > 0) {
        actions.unshift(stakeaction)
      }

      let result = await this.$store.dispatch('user/transact', {
        actions: actions
      })

      if (result) {
        this.$store.dispatch('user/fetchIsCandidate')
        this.$store.dispatch('user/fetchBalances')
        this.$store.dispatch('dac/fetchActiveCandidates')
      }
    },

    async unregisterAsCandidate () {
      let actions = [
        {
          account: this.$dir.getAccount(this.$dir.ACCOUNT_CUSTODIAN),
          name: 'withdrawcane',
          data: {
            cand: this.getAccountName,
            dac_id: this.$dir.dacId
          }
        }
      ]

      let result = await this.$store.dispatch('user/transact', {
        actions: actions
      })
      if (result) {
        // this.$store.commit('user/setIsCandidate', false );
        this.$store.dispatch('user/fetchIsCandidate')
        this.$store.dispatch('dac/fetchActiveCandidates')
      }
    },

    async increase_stake () {
      if (!this.increase_stake_amount) return false
      this.increase_stake_modal = false
      let increase = parseFloat(this.increase_stake_amount)
      if (isNaN(increase)) {
        increase = 0
      }
      const quantity = this.numberToAsset(
        increase.toFixed(
          this.quantityToPrecision(this.getCustodianConfig.lockupasset.quantity)
        ),
        this.$dir.symbolCode
      )
      const stakeaction = {
        account: this.$dir.symbol.contract,
        name: 'stake',
        data: {
          account: this.getAccountName,
          quantity
        }
      }
      const result = await this.$store.dispatch('user/transact', {
        actions: [stakeaction]
      })
      if (result) {
        this.$store.dispatch('user/fetchIsCandidate')
        this.$store.dispatch('user/fetchBalances')
      }
      this.increase_stake_amount = ''
    }
  },

  created () {
    const stakedBalance = this.getStakedDacBalance
    const requiredBalance = this.assetToNumber(this.getCustodianConfig.lockupasset.quantity)
    let diff = requiredBalance - stakedBalance
    if (diff < 0) {
      diff = 0
    }
    this.stakeamount = diff
  }
}
</script>

<style lang="stylus">

</style>
