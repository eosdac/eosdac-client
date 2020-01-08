<template>
  <q-page class="q-pa-md">

    <div class="row q-col-gutter-md">
      <div class="col-lg-2">
        <q-tabs vertical v-model="selectedTab" class="text-secondary">
          <q-tab name="general">General</q-tab>
          <q-tab name="proposals" v-if="wpEnabled">Worker Proposals</q-tab>
          <q-tab name="token">Token</q-tab>
          <q-tab name="referendum" v-if="referendumEnabled">Referendum</q-tab>
          <q-tab name="brand">Colors &amp; Brand</q-tab>
          <q-tab name="features">Features</q-tab>
        </q-tabs>
      </div>
      <q-tab-panels class="col-lg-10" v-model="selectedTab">
        <q-tab-panel name="general">
          <div class="text-h5 q-mb-md">Voting &amp; Custodian Config</div>
          <!-- {{custodianConfig}} -->
          <q-card>
            <q-card-section>
              <q-input type="number" v-model="custodianConfig.numelected" label="Number Elected" />
              <q-input type="number" v-model="custodianConfig.maxvotes" label="Max Votes" />
              <asset-input :allowed="[dacToken, systemToken]" v-model="custodianConfig.lockupasset" label="Custodian Lockup" />
              <asset-input :allowed="[dacToken, systemToken]" v-model="custodianConfig.requested_pay_max" label="Maximum Requested Pay" />
              <seconds-input v-model="custodianConfig.lockup_release_time_delay" label="Lockup Release Delay" />
              <seconds-input v-model="custodianConfig.periodlength" label="Period Length" />
              <div class="row">
                <q-input type="number" v-model="custodianConfig.auth_threshold_high" label="High Threshold" />
                <q-input type="number" v-model="custodianConfig.auth_threshold_mid" label="Medium Threshold" />
                <q-input type="number" v-model="custodianConfig.auth_threshold_low" label="Low Threshold" />
              </div>
              <div class="row">
                <q-input type="number" v-model="custodianConfig.initial_vote_quorum_percent" label="Unlock Threshold (%)" />
                <q-input type="number" v-model="custodianConfig.vote_quorum_percent" label="Ongoing Quorum (%)" />
              </div>
              <q-toggle v-model="custodianConfig.should_pay_via_service_provider" label="Use Service Provider" />
            </q-card-section>
            <q-card-actions align="right">
              <q-btn color="positive" label="Propose Changes" @click="saveCustodianConfig" />
            </q-card-actions>
          </q-card>
        </q-tab-panel>

        <q-tab-panel name="proposals" v-if="wpEnabled">
          <div class="text-h5 q-mb-md">Proposals</div>
          <!-- {{wpConfig}} -->
          <q-card v-if="wpConfigLoaded">
            <q-card-section>
              <q-input type="number" v-model="wpConfig.proposal_threshold" label="Proposal Threshold" />
              <q-input type="number" v-model="wpConfig.finalize_threshold" label="Finalize Threshold" />
              <seconds-input v-model="wpConfig.escrow_expiry" label="Escrow Expiry" />
              <seconds-input v-model="wpConfig.approval_expiry" label="Approval Expiry" />
            </q-card-section>
            <q-card-actions align="right">
              <q-btn color="positive" label="Propose Changes" @click="saveWpConfig" />
            </q-card-actions>
          </q-card>
        </q-tab-panel>

        <q-tab-panel name="token">
          <div class="text-h5 q-mb-md">Token Config</div>

          <!-- {{tokenConfig}} -->
          <q-card v-if="tokenConfigLoaded">
            <q-card-section>
              <q-toggle v-model="tokenConfig.enabled" label="Enable Staking" />
              <seconds-input v-model="tokenConfig.min_stake_time" label="Minimum Stake Time" />
              <seconds-input v-model="tokenConfig.max_stake_time" label="Maximum Stake Time" />
            </q-card-section>
            <q-card-actions align="right">
              <q-btn color="positive" label="Propose Changes" @click="saveTokenConfig" />
            </q-card-actions>
          </q-card>

        </q-tab-panel>

        <q-tab-panel name="referendum" v-if="referendumEnabled">
          <div class="text-h5 q-mb-md">Referendum</div>
          <!-- {{referendumConfig}} -->
          <q-card v-if="referendumConfigLoaded">
            <q-card-section>
              <referendum-config-group v-model="referendumConfig.fee" type="asset" :allowed="[dacToken, systemToken]" label="Fees" />
              <referendum-config-group v-model="referendumConfig.pass" type="number" label="Pass rate" />
              <referendum-config-group v-model="referendumConfig.quorum_token" type="number" label="Quorum (Token Votes)" />
              <referendum-config-group v-model="referendumConfig.quorum_account" type="number" label="Quorum (Account Votes)" />
              <referendum-config-group v-model="referendumConfig.allow_per_account_voting" type="bool" label="Allow Per-Account Voting" />
            </q-card-section>
            <q-card-actions align="right">
              <q-btn color="positive" label="Propose Changes" @click="saveReferendumConfig" />
            </q-card-actions>
          </q-card>

        </q-tab-panel>

        <q-tab-panel name="brand">
          <div class="text-h5 q-mb-md">Branding</div>
          <div class="row q-col-gutter-md" v-if="brandData">
            <div class="col-md-6">
              <q-card>
                <q-card-section>
                  <q-input v-model="brandData.dacName" label="DAC Name" />
                </q-card-section>

                <q-card-section>
                  <q-input v-model="brandData.extension" label="Client Extension" />
                </q-card-section>
              </q-card>
            </div>
            <div class="col-md-6">
              <q-card>
                <q-card-section>
                  <q-toggle v-model="brandData.is_dark" label="Dark Theme" />
                </q-card-section>
                <q-card-section>
                  <q-item>
                    <q-item-section side>
                      <q-btn push color="primary" label="">
                        <q-popup-proxy>
                          <q-color v-model="brandData.colors.primary" />
                        </q-popup-proxy>
                      </q-btn>
                    </q-item-section>
                    <q-item-section>Primary {{brandData.colors.primary}}</q-item-section>
                  </q-item>

                  <q-item>
                    <q-item-section side>
                      <q-btn push color="secondary" label="">
                        <q-popup-proxy>
                          <q-color v-model="brandData.colors.secondary" />
                        </q-popup-proxy>
                      </q-btn>
                    </q-item-section>
                    <q-item-section>Secondary {{brandData.colors.secondary}}</q-item-section>
                  </q-item>

                  <q-item>
                    <q-item-section side>
                      <q-btn push color="accent" label="">
                        <q-popup-proxy>
                          <q-color v-model="brandData.colors.accent" />
                        </q-popup-proxy>
                      </q-btn>
                    </q-item-section>
                    <q-item-section>Accent {{brandData.colors.accent}}</q-item-section>
                  </q-item>

                  <q-item>
                    <q-item-section side>
                      <q-btn push color="info" label="">
                        <q-popup-proxy>
                          <q-color v-model="brandData.colors.info" />
                        </q-popup-proxy>
                      </q-btn>
                    </q-item-section>
                    <q-item-section>Info {{brandData.colors.info}}</q-item-section>
                  </q-item>

                  <q-item>
                    <q-item-section side>
                      <q-btn push color="positive" label="">
                        <q-popup-proxy>
                          <q-color v-model="brandData.colors.positive" />
                        </q-popup-proxy>
                      </q-btn>
                    </q-item-section>
                    <q-item-section>Positive {{brandData.colors.positive}}</q-item-section>
                  </q-item>

                  <q-item>
                    <q-item-section side>
                      <q-btn push color="negative" label="">
                        <q-popup-proxy>
                          <q-color v-model="brandData.colors.negative" />
                        </q-popup-proxy>
                      </q-btn>
                    </q-item-section>
                    <q-item-section>Negative {{brandData.colors.negative}}</q-item-section>
                  </q-item>

                  <q-item>
                    <q-item-section side>
                      <q-btn push color="warning" label="">
                        <q-popup-proxy>
                          <q-color v-model="brandData.colors.warning" />
                        </q-popup-proxy>
                      </q-btn>
                    </q-item-section>
                    <q-item-section>Warning {{brandData.colors.warning}}</q-item-section>
                  </q-item>

                </q-card-section>

                <q-card-actions align="right">
                  <q-btn color="positive" label="Propose Changes" @click="saveBrand" />
                </q-card-actions>
              </q-card>
            </div>
          </div>
<!--            <div>{{brandData}}</div>-->

        </q-tab-panel>
        <q-tab-panel name="features">
          <div class="text-h5 q-mb-md">Features</div>
          <q-card>
            <q-card-section>
              <div class="row">
                <div class="col-xs-4">Referendums</div>
                <div class="col-xs-4">
                  <q-toggle v-model="referendumEnabled" />
                </div>
                <div class="col-xs-4">
                  <q-input v-model="referendumAccount" v-if="referendumEnabled" label="Referendum contract name" />
                </div>
              </div>
            </q-card-section>
            <q-card-section>
              <div class="row">
                <div class="col-xs-4">Worker Proposals</div>
                <div class="col-xs-4">
                  <q-toggle v-model="wpEnabled" />
                </div>
                <div class="col-xs-4">
                  <q-input v-model="wpAccount" v-if="wpEnabled" label="Worker proposals contract name" />
                </div>
              </div>
            </q-card-section>
          </q-card>

        </q-tab-panel>
      </q-tab-panels>
    </div>

  </q-page>
</template>

<script>
import { mapGetters, mapActions } from 'vuex'
import { colors } from 'quasar'
import AssetInput from '../../components/ui/asset-input'
import SecondsInput from '../../components/ui/seconds-input'
import ReferendumConfigGroup from '../../components/ui/referendum-config-group'

export default {
  name: 'contracts-config',
  components: {
    AssetInput,
    ReferendumConfigGroup,
    SecondsInput
  },
  data () {
    const [precisionStr, symbol] = this.$dir.symbol.symbol.split(',')
    const precision = parseInt(precisionStr)
    const contract = this.$dir.symbol.contract
    return {
      custodianContract: this.$dir.getAccount(this.$dir.ACCOUNT_CUSTODIAN),
      proposalsContract: this.$dir.getAccount(this.$dir.ACCOUNT_PROPOSALS),
      referendumContract: this.$dir.getAccount(this.$dir.ACCOUNT_REFERENDUM),
      tokenContract: contract,
      selectedTab: 'general',
      dacToken: { symbol, precision, contract, value: 0 },
      systemToken: {
        symbol: this.$configFile.get('systemtokensymbol'),
        precision: this.$configFile.get('systemtokendecimals'),
        contract: this.$configFile.get('systemtokencontract'),
        value: 0
      },
      brandData: null,
      tokenConfigLoaded: false,
      referendumConfigLoaded: false,
      referendumEnabled: false,
      wpConfigLoaded: false,
      wpEnabled: false,
      wpAccount: '',
      referendumAccount: ''
    }
  },
  computed: {
    ...mapGetters({
      custodianConfig: 'dac/getCustodianConfig',
      wpConfig: 'dac/getWpConfig',
      tokenConfig: 'dac/getTokenConfig',
      referendumConfig: 'dac/getReferendumConfig'
    })
  },
  methods: {
    ...mapActions({
      fetchWpConfig: 'dac/fetchWpConfig',
      fetchTokenConfig: 'dac/fetchTokenConfig',
      fetchReferendumConfig: 'dac/fetchReferendumConfig'
    }),
    loadBrand () {
      const theme = JSON.parse(this.$dir.getRef(this.$dir.REF_COLORS))
      const extension = this.$dir.getRef(this.$dir.REF_CLIENT_EXTENSION)
      this.brandData = { ...theme, dacName: this.$dir.title, extension }
    },
    async saveCustodianConfig () {
      console.log(`Saving custodian config`, this.custodianConfig)

      const action = {
        account: this.$dir.getAccount(this.$dir.ACCOUNT_CUSTODIAN),
        name: 'updateconfige',
        authorization: [
          {
            actor: this.$dir.getAccount(this.$dir.ACCOUNT_AUTH),
            permission: 'active'
          }
        ]
      }
      this.custodianConfig.should_pay_via_service_provider = !!this.custodianConfig.should_pay_via_service_provider
      action.data = { newconfig: this.custodianConfig, dac_id: this.$dir.dacId }

      const res = await this.$store.dispatch('user/proposeMsig', {
        actions: [action],
        title: `Update configuration of Custodian Contract`,
        description: ''
      })
      console.log(res)
    },
    async saveWpConfig () {
      console.log(`Saving worker proposal config`, this.wpConfig)

      const action = {
        account: this.$dir.getAccount(this.$dir.ACCOUNT_PROPOSALS),
        name: 'updateconfig',
        authorization: [
          {
            actor: this.$dir.getAccount(this.$dir.ACCOUNT_AUTH),
            permission: 'active'
          }
        ]
      }
      action.data = { new_config: this.wpConfig, dac_id: this.$dir.dacId }

      const res = await this.$store.dispatch('user/proposeMsig', {
        actions: [action],
        title: `Update configuration of Worker Proposal Contract`,
        description: ''
      })
      console.log(res)
    },
    async saveReferendumConfig () {
      console.log(`Saving referendum config`, this.referendumConfig)

      const action = {
        account: this.$dir.getAccount(this.$dir.ACCOUNT_REFERENDUM),
        name: 'updateconfig',
        authorization: [
          {
            actor: this.$dir.getAccount(this.$dir.ACCOUNT_AUTH),
            permission: 'active'
          }
        ]
      }
      action.data = { config: this.referendumConfig, dac_id: this.$dir.dacId }

      const res = await this.$store.dispatch('user/proposeMsig', {
        actions: [action],
        title: `Update configuration of Referendum Contract`,
        description: ''
      })
      console.log(res)
    },
    async saveTokenConfig () {
      console.log(`Saving token config`, this.tokenConfig)

      const action = {
        account: this.$dir.symbol.contract,
        name: 'stakeconfig',
        authorization: [
          {
            actor: this.$dir.getAccount(this.$dir.ACCOUNT_AUTH),
            permission: 'active'
          }
        ]
      }
      // this.tokenConfig.enabled = !!this.tokenConfig.enabled
      action.data = { config: this.tokenConfig, token_symbol: this.$dir.symbol.symbol }

      const res = await this.$store.dispatch('user/proposeMsig', {
        actions: [action],
        title: `Update configuration of Token Contract`,
        description: ''
      })
      console.log(res)
    },
    async saveBrand () {
      console.log(`Saving branding`, this.brandData)
      const colorsData = JSON.stringify({ colors: this.brandData.colors, is_dark: this.brandData.is_dark })

      const actions = [
        {
          account: this.$configFile.get('dacdirectory'),
          name: 'regref',
          authorization: [
            {
              actor: this.$dir.getAccount(this.$dir.ACCOUNT_AUTH),
              permission: 'active'
            }
          ],
          data: {
            dac_id: this.$dir.dacId,
            value: colorsData,
            type: this.$dir.REF_COLORS
          }
        },
        {
          account: this.$configFile.get('dacdirectory'),
          name: 'regref',
          authorization: [
            {
              actor: this.$dir.getAccount(this.$dir.ACCOUNT_AUTH),
              permission: 'active'
            }
          ],
          data: {
            dac_id: this.$dir.dacId,
            value: this.brandData.extension,
            type: this.$dir.REF_CLIENT_EXTENSION
          }
        }
      ]

      console.log(actions)
      const res = await this.$store.dispatch('user/proposeMsig', {
        actions,
        title: `Update configuration of Branding`,
        description: ''
      })
      console.log(res)
    }
  },

  mounted () {
    this.wpAccount = this.$dir.getAccount(this.$dir.ACCOUNT_PROPOSALS)
    this.referendumAccount = this.$dir.getAccount(this.$dir.ACCOUNT_REFERENDUM)
    this.wpEnabled = !!this.wpAccount
    this.referendumEnabled = !!this.referendumAccount
  },

  watch: {
    selectedTab: async function (tabName) {
      switch (tabName) {
        case 'proposals':
          this.fetchWpConfig()
          this.wpConfigLoaded = true
          this.wpEnabled = !!this.$dir.getAccount(this.$dir.ACCOUNT_PROPOSALS)
          break
        case 'token':
          await this.fetchTokenConfig()
          this.tokenConfig.enabled = !!this.tokenConfig.enabled
          this.tokenConfigLoaded = true
          break
        case 'referendum':
          await this.fetchReferendumConfig()
          this.referendumConfigLoaded = true
          this.referendumEnabled = !!this.$dir.getAccount(this.$dir.ACCOUNT_REFERENDUM)
          break
        case 'brand':
          this.loadBrand()
          break
        case 'features':
          break
      }
    },
    'brandData.colors.primary': function (newData) {
      colors.setBrand('primary', newData)
    },
    'brandData.colors.secondary': function (newData) {
      colors.setBrand('secondary', newData)
    },
    'brandData.colors.positive': function (newData) {
      colors.setBrand('positive', newData)
    },
    'brandData.colors.negative': function (newData) {
      colors.setBrand('negative', newData)
    },
    'brandData.colors.info': function (newData) {
      colors.setBrand('info', newData)
    },
    'brandData.colors.warning': function (newData) {
      colors.setBrand('warning', newData)
    },
    'brandData.is_dark': function (newData) {
      this.$q.dark.set(newData)
    }
  }

}
</script>
