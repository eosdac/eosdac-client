<template>
  <q-page>
    <div class="q-pa-md animate-fade" v-if="getAccountName">
      <!-- is already a candidate UNREGISTER-->
      <div
        v-if="getIsCandidate && getIsCandidate.is_active"
      >
      <q-card v-if="getIsCandidate && getIsCandidate.is_active" class="row bg-logo q-pa-md rounded-borders shadow-4 relative-position overflow-hidden">
        <q-card-section>
          <q-item class="no-padding">
            <q-item-section side>
              <profile-pic :accountname="getAccountName" :scale="2.0" :show_role="false"  />
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

          <q-item class="full-width">
            <q-item-section>
              {{
              $t("manage_candidateship.page_description_registered", {
              dacname: $dir.title
              })
              }}
            </q-item-section>
          </q-item>
          <q-separator spaced inset />

          <!-- requested pay -->
          <q-item v-if="getEnableCustPayments" class="full-width">
            <q-item-section avatar>
              <q-icon name="icon-type-2" />
            </q-item-section>

            <q-item-section>{{$t(`manage_candidateship.requestedpay`)}}</q-item-section>

            <q-item-section style="white-space: nowrap" class="text-right">
              {{$helper.assetToLocaleNumber(getIsCandidate.requestedpay)}}
            </q-item-section>

            <q-item-section style="white-space: nowrap">
              <q-btn label="update" color="secondary" to="/custodian/my-payments" />
            </q-item-section>

          </q-item>
          <q-separator spaced inset v-if="getEnableCustPayments" />

          <!-- staked -->
          <q-item class="full-width">
            <q-item-section avatar>
              <q-icon name="icon-dac-balance" />
            </q-item-section>

            <q-item-section>{{$t(`manage_candidateship.current_stake`)}}</q-item-section>

            <q-item-section  class="text-right" no-wrap>
              {{$helper.assetSymbolToLocaleNumber(getStakedDacBalance, $dir.symbol.symbol)}}
            </q-item-section>

            <q-item-section>
              <q-btn
                icon="add"
                round
                size="sm"
                title="Increase stake"
                color="primary"
                @click="increase_stake_modal = true"
              />
            </q-item-section>

          </q-item>
          <q-separator spaced inset v-if="getEnableCustPayments" />

          <!-- total votes -->
          <q-item class="full-width">
            <q-item-section avatar>
              <q-icon name="how_to_vote" />
            </q-item-section>

            <q-item-section>{{$t(`manage_candidateship.total_votes`)}}</q-item-section>

            <q-item-section class="text-right">
              {{$helper.assetSymbolToLocaleNumber(getIsCandidate.total_votes / 10000, $dir.symbol.symbol)}}
            </q-item-section>

            <!-- noop -->
            <q-item-section style="white-space: nowrap"></q-item-section>
          </q-item>
          <q-separator spaced inset />

        </q-card-section>
        <!-- <div class="" style="bottom:-50%;right:-80%;"></div> -->
        <q-card-section class="full-width">
          <q-card-actions align="right">
            <q-btn
                    class="animate-pop"
                    color="negative"
                    @click="unregisterAsCandidate"
                    :label="$t('manage_candidateship.unregister')"
            />
          </q-card-actions>
        </q-card-section>
      </q-card>
      </div>
      <!-- end already a candidate -->

      <!-- Not a candidate REGISTER -->
      <div v-else class="bg-logo q-pa-md rounded-borders shadow-4">
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
                  <asset-input :allowed="[dacToken]" v-model="stakeamount" :label="$t('manage_candidateship.amount_to_stake_placeholder', {token_symbol: $dir.symbolCode})" />
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
                <q-item-section v-if="allowed && allowed.length">
                  <asset-input :allowed="allowed"
                               v-model="requestedpay"
                               :label="$t('manage_candidateship.requested_custodian_pay_placeholder',{system_token: this.allowed[0].symbol})" />

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
        class="q-pa-md rounded-borders shadow-4 q-mt-md"
      >
        <span>{{ $t("manage_candidateship.unstake_description")}}{{ lockupReleaseTimeDelayDays }}</span>

        <div class="row justify-between q-mt-md items-center">
          <div class="q-caption q-py-sm">
            <span class="text-positive">Your stake
              {{$helper.assetToLocaleNumber(getStakedDacBalance + ' ' + $dir.symbol.symbol)}}
            </span>
            <span class="on-right">Release Date:
              {{
                new Date("2019-05-09T19:17:10").toUTCString(
                  getIsCandidate.custodian_end_time_stamp
                )
              }}</span>
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

    <q-dialog v-model="increase_stake_modal" minimized>
      <q-card>
        <q-card-section class="bg-primary">
          <div class="text-h5">Increase Your stake ({{ $dir.symbolCode }})</div>
        </q-card-section>
        <q-card-section>
          <q-input
                  type="number"
                  color="primary"
                  v-model="increase_stake_amount"
                  label="Extra Stake"
                  stack-label
                  placeholder="enter amount"
          />
        </q-card-section>
        <q-card-actions align="right">
          <q-btn label="ok" color="primary" @click="increaseStake" />
        </q-card-actions>
      </q-card>
    </q-dialog>
  </q-page>
</template>

<script>
/**
 * Manage my candidateship view
 *
 * @todo, this view can be merged with my payments
 */
import { mapGetters } from 'vuex'
import ProfilePic from '../components/ui/profile-pic'
import AssetInput from '../components/controls/asset-input'

export default {
  name: 'ManageCandidateship',
  components: {
    AssetInput,
    ProfilePic
  },
  data () {
    const [precisionStr, symbol] = this.$dir.symbol.symbol.split(',')
    const precision = parseInt(precisionStr)

    return {
      stakeamount: null,
      requestedpay: null,
      // requested_pay_max: 0,
      increase_stake_amount: '',
      increase_stake_modal: false,
      dacToken: { symbol, precision, contract: this.$dir.symbol.contract, value: 0 },
      allowed: null
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

    lockupReleaseTimeDelayDays () {
      if (this.getCustodianConfig.lockup_release_time_delay) {
        return this.getCustodianConfig.lockup_release_time_delay / 60 / 60 / 24
      }
      return 0
    },

    verifyAndGetRequestedPay () {
      if (this.requestedpay !== null) {
        const split = this.splitAsset(this.requestedpay)
        if (split.quantity >= 0 && split.quantity <= this.$helper.assetToNumber(this.getCustodianConfig.requested_pay_max.quantity)) {
          return `${split.quantity.toFixed(split.precision)} ${split.symbol}`
        }
      }

      return false
    },
    verifyAndGetStakeAmount () {
      if (this.stakeamount !== null) {
        const split = this.splitAsset(this.stakeamount)
        if (split.quantity + this.getStakedDacBalance >= this.$helper.assetToNumber(this.getCustodianConfig.lockupasset.quantity)) {
          return `${split.quantity.toFixed(split.precision)} ${split.symbol}`
        }
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

    async increaseStake () {
      if (!this.increase_stake_amount) return false
      this.increase_stake_modal = false
      let increase = parseFloat(this.increase_stake_amount)
      if (isNaN(increase)) {
        increase = 0
      }
      const quantity = this.$helper.numberToAsset(
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
    },

    splitAsset (asset) {
      const [qtyStr, symbolStr] = asset.quantity.split(' ')
      const quantity = parseFloat(qtyStr)
      const [, precisionStr] = qtyStr.split('.')
      return {
        contract: asset.contract,
        symbol: symbolStr,
        precision: precisionStr.length,
        quantity
      }
    }
  },

  mounted () {
    const stakedBalance = this.getStakedDacBalance
    const lockupSplit = this.splitAsset(this.getCustodianConfig.lockupasset)
    const requiredBalance = lockupSplit.quantity
    let diff = requiredBalance - stakedBalance
    if (diff < 0) {
      diff = 0
    }
    this.stakeamount = { quantity: `${diff.toFixed(lockupSplit.precision)} ${lockupSplit.symbol}`, contract: lockupSplit.contract }
    const maxPaySplit = this.splitAsset(this.getCustodianConfig.requested_pay_max)
    const quantity = `${(0).toFixed(maxPaySplit.precision)} ${maxPaySplit.symbol}`
    this.requestedpay = { contract: maxPaySplit.contract, quantity }

    this.allowed = [maxPaySplit]
  }
}
</script>

<style lang="stylus">

</style>
