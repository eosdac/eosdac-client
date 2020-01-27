<template>
  <q-page class="q-pa-md">

    <div class="row q-col-gutter-md">
      <div class="col-lg-2">
        <q-tabs vertical v-model="selectedTab" class="text-secondary">
          <q-tab name="general">{{$t('contracts_config.general')}}</q-tab>
          <q-tab name="proposals" v-if="wpEnabled">{{$t('contracts_config.proposals')}}</q-tab>
          <q-tab name="token">{{$t('contracts_config.token')}}</q-tab>
          <q-tab name="referendum" v-if="referendumEnabled">{{$t('contracts_config.referendum')}}</q-tab>
          <q-tab name="brand">{{$t('contracts_config.brand')}}</q-tab>
          <q-tab name="features">{{$t('contracts_config.features')}}</q-tab>
        </q-tabs>
      </div>
      <q-tab-panels class="col-lg-10" v-model="selectedTab">
        <q-tab-panel name="general">
          <div class="text-h5 q-mb-md">{{$t('contracts_config.general_title')}}</div>
          <!-- {{custodianConfig}} -->
          <q-card>
            <q-card-section>
              <q-input type="number" v-model="custodianConfig.numelected" :label="$t('contracts_config.general_number_elected')" />
              <q-input type="number" v-model="custodianConfig.maxvotes" :label="$t('contracts_config.general_max_votes')" />
              <asset-input :allowed="[dacToken, systemToken]" v-model="custodianConfig.lockupasset" :label="$t('contracts_config.general_lockup')" />
              <asset-input :allowed="[dacToken, systemToken]" v-model="custodianConfig.requested_pay_max" :label="$t('contracts_config.general_max_req_pay')" />
              <seconds-input v-model="custodianConfig.lockup_release_time_delay" :label="$t('contracts_config.general_lockup_release')" />
              <seconds-input v-model="custodianConfig.periodlength" :label="$t('contracts_config.general_period_length')" />
              <div class="row">
                <q-input type="number" v-model="custodianConfig.auth_threshold_high" :label="$t('contracts_config.general_auth_high')" />
                <q-input type="number" v-model="custodianConfig.auth_threshold_mid" :label="$t('contracts_config.general_auth_mid')" />
                <q-input type="number" v-model="custodianConfig.auth_threshold_low" :label="$t('contracts_config.general_auth_low')" />
              </div>
              <div class="row">
                <q-input type="number" v-model="custodianConfig.initial_vote_quorum_percent" :label="$t('contracts_config.general_initial_quorum')" />
                <q-input type="number" v-model="custodianConfig.vote_quorum_percent" :label="$t('contracts_config.general_vote_quorum')" />
              </div>
              <q-toggle v-model="custodianConfig.should_pay_via_service_provider" :label="$t('contracts_config.general_use_service')" />
            </q-card-section>
            <q-card-actions align="right">
              <q-btn color="positive" :label="$t('contracts_config.propose_changes')" @click="startSave('general')" />
            </q-card-actions>
          </q-card>
        </q-tab-panel>

        <q-tab-panel name="proposals" v-if="wpEnabled">
          <div class="text-h5 q-mb-md">{{$t('contracts_config.proposals_title')}}</div>
          <!-- {{wpConfig}} -->
          <q-card v-if="wpConfigLoaded">
            <q-card-section>
              <q-input type="number" v-model="wpConfig.proposal_threshold" :label="$t('contracts_config.proposals_proposal_threshold')" />
              <q-input type="number" v-model="wpConfig.finalize_threshold" :label="$t('contracts_config.proposals_finalise_threshold')" />
              <seconds-input v-model="wpConfig.approval_duration" :label="$t('contracts_config.proposals_approval_expiry')" />
            </q-card-section>
            <q-card-actions align="right">
              <q-btn color="positive"  :label="$t('contracts_config.propose_changes')" @click="startSave('proposals')" />
            </q-card-actions>
          </q-card>
        </q-tab-panel>

        <q-tab-panel name="token">
          <div class="text-h5 q-mb-md">{{$t('contracts_config.token_title')}}</div>

          <!-- {{tokenConfig}} -->
          <q-card v-if="tokenConfigLoaded">
            <q-card-section>
              <!-- <q-toggle v-model="tokenConfig.enabled" :label="$t('contracts_config.token_enable_staking')" /> -->
              <seconds-input v-model="tokenConfig.min_stake_time" :label="$t('contracts_config.token_min_stake_time')" />
              <seconds-input v-model="tokenConfig.max_stake_time" :label="$t('contracts_config.token_max_stake_time')" />
            </q-card-section>
            <q-card-actions align="right">
              <q-btn color="positive" :label="$t('contracts_config.token_propose_changes')" @click="startSave('token')" />
            </q-card-actions>
          </q-card>

        </q-tab-panel>

        <q-tab-panel name="referendum" v-if="referendumEnabled">
          <div class="text-h5 q-mb-md">{{$t('contracts_config.referendum_title')}}</div>
<!--           {{referendumConfig}}-->
          <q-card v-if="referendumConfigLoaded">
            <q-card-section>
              <seconds-input v-model="referendumConfig.duration" :label="$t('contracts_config.duration')" />
            </q-card-section>
            <q-card-section v-if="referendumConfig.fee !== null">
              <referendum-config-group v-model="referendumConfig.allow_vote_type" type="bool" :label="$t('contracts_config.allow_vote_type')" />
              <referendum-config-group v-model="referendumConfig.allow_per_account_voting" type="bool" :label="$t('contracts_config.referendum_allow_per_account')" />
              <referendum-config-group v-model="referendumConfig.fee" type="asset" :allowed="[dacToken, systemToken]" :label="$t('contracts_config.referendum_fees')" />
              <referendum-config-group v-model="referendumConfig.pass" type="number" :label="$t('contracts_config.referendum_pass_rate')" />
              <referendum-config-group v-model="referendumConfig.quorum_token" type="number" :label="$t('contracts_config.referendum_quorum_token')" />
              <referendum-config-group v-model="referendumConfig.quorum_account" type="number" :label="$t('contracts_config.referendum_quorum_account')" />
            </q-card-section>
            <q-card-section v-else>
              Referendum contract is not configured yet
            </q-card-section>
            <q-card-actions align="right">
              <q-btn color="positive" :label="$t('contracts_config.propose_changes')" @click="startSave('referendum')" />
            </q-card-actions>
          </q-card>

        </q-tab-panel>

        <q-tab-panel name="brand">
          <div class="text-h5 q-mb-md">{{$t('contracts_config.branding_title')}}</div>
          <div class="row q-col-gutter-md" v-if="brandData">
            <div class="col-md-6">
              <q-card>
                <q-card-section>
                  <q-input v-model="brandData.dacName" :label="$t('contracts_config.branding_dac_name')" />
                </q-card-section>

                <q-card-section>
                  <q-input v-model="brandData.homepage" :label="$t('contracts_config.branding_homepage')" />
                </q-card-section>

                <q-card-section>
                  <q-input type="textarea" v-model="brandData.description" :label="$t('contracts_config.branding_description')" />
                </q-card-section>

                <q-card-section v-if="!brandData.extension">
                  <q-input v-model="brandData.logoUrl" :label="$t('contracts_config.branding_logo')" />
                </q-card-section>

                <q-card-section v-if="!brandData.extension">
                  <q-input v-model="brandData.logoNoTextUrl" :label="$t('contracts_config.branding_logo_notext')" />
                </q-card-section>

                <q-card-section v-if="!brandData.extension">
                  <q-input v-model="brandData.backgroundUrl" :label="$t('contracts_config.branding_background_url')" />
                </q-card-section>

                <q-card-section>
                  <q-input v-model="brandData.discordUrl" :label="$t('contracts_config.branding_discord')" />
                </q-card-section>

                <q-card-section>
                  <q-input v-model="brandData.telegramUrl" :label="$t('contracts_config.branding_telegram')" />
                </q-card-section>

                <q-card-section>
                  <q-input v-model="brandData.extension" :label="$t('contracts_config.branding_extension')" />
                </q-card-section>
              </q-card>
            </div>
            <div class="col-md-6">
              <q-card v-if="!brandData.extension">
                <q-card-section>
                  <q-toggle v-model="brandData.is_dark" :label="$t('contracts_config.branding_dark_theme')" />
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
                    <q-item-section>{{$t('contracts_config.branding_primary')}} {{brandData.colors.primary}}</q-item-section>
                  </q-item>

                  <q-item>
                    <q-item-section side>
                      <q-btn push color="secondary" label="">
                        <q-popup-proxy>
                          <q-color v-model="brandData.colors.secondary" />
                        </q-popup-proxy>
                      </q-btn>
                    </q-item-section>
                    <q-item-section>{{$t('contracts_config.branding_secondary')}} {{brandData.colors.secondary}}</q-item-section>
                  </q-item>

                  <q-item>
                    <q-item-section side>
                      <q-btn push color="accent" label="">
                        <q-popup-proxy>
                          <q-color v-model="brandData.colors.accent" />
                        </q-popup-proxy>
                      </q-btn>
                    </q-item-section>
                    <q-item-section>{{$t('contracts_config.branding_accent')}} {{brandData.colors.accent}}</q-item-section>
                  </q-item>

                  <q-item>
                    <q-item-section side>
                      <q-btn push color="info" label="">
                        <q-popup-proxy>
                          <q-color v-model="brandData.colors.info" />
                        </q-popup-proxy>
                      </q-btn>
                    </q-item-section>
                    <q-item-section>{{$t('contracts_config.branding_info')}} {{brandData.colors.info}}</q-item-section>
                  </q-item>

                  <q-item>
                    <q-item-section side>
                      <q-btn push color="positive" label="">
                        <q-popup-proxy>
                          <q-color v-model="brandData.colors.positive" />
                        </q-popup-proxy>
                      </q-btn>
                    </q-item-section>
                    <q-item-section>{{$t('contracts_config.branding_positive')}} {{brandData.colors.positive}}</q-item-section>
                  </q-item>

                  <q-item>
                    <q-item-section side>
                      <q-btn push color="negative" label="">
                        <q-popup-proxy>
                          <q-color v-model="brandData.colors.negative" />
                        </q-popup-proxy>
                      </q-btn>
                    </q-item-section>
                    <q-item-section>{{$t('contracts_config.branding_negative')}} {{brandData.colors.negative}}</q-item-section>
                  </q-item>

                  <q-item>
                    <q-item-section side>
                      <q-btn push color="warning" label="">
                        <q-popup-proxy>
                          <q-color v-model="brandData.colors.warning" />
                        </q-popup-proxy>
                      </q-btn>
                    </q-item-section>
                    <q-item-section>{{$t('contracts_config.branding_warning')}} {{brandData.colors.warning}}</q-item-section>
                  </q-item>

                </q-card-section>

                <q-card-actions align="right">
                  <q-btn color="positive" :label="$t('contracts_config.branding_propose_changes')" @click="startSave('brand')" />
                </q-card-actions>
              </q-card>
              <q-card v-else>
                <q-card-section class="text-warning">{{$t('contracts_config.branding_colors_disabled')}}</q-card-section>

                <q-card-actions align="right">
                  <q-btn color="positive" :label="$t('contracts_config.propose_changes')" @click="startSave('brand')" />
                </q-card-actions>
              </q-card>
            </div>
          </div>
<!--            <div>{{brandData}}</div>-->

        </q-tab-panel>
        <q-tab-panel name="features">
          <div class="text-h5 q-mb-md">{{$t('contracts_config.features_title')}}</div>
          <q-card>
            <q-card-section>
              <div class="row">
                <div class="col-xs-4">{{$t('contracts_config.features_referendums')}}</div>
                <div class="col-xs-4">
                  <q-toggle v-model="referendumEnabled" />
                </div>
                <div class="col-xs-4">
                  <q-input v-model="referendumAccount" v-if="referendumEnabled" :label="$t('contracts_config.features_referendum_contract')" />
                </div>
              </div>
            </q-card-section>
            <q-card-section>
              <div class="row">
                <div class="col-xs-4">{{$t('contracts_config.features_wp')}}</div>
                <div class="col-xs-4">
                  <q-toggle v-model="wpEnabled" />
                </div>
                <div class="col-xs-4">
                  <q-input v-model="wpAccount" v-if="wpEnabled" :label="$t('contracts_config.features_wp_contract')" />
                </div>
              </div>
            </q-card-section>
            <q-card-section>
                <q-card-actions align="right">
                  <q-btn color="positive" :label="$t('contracts_config.propose_changes')" @click="startSave('features')" />
                </q-card-actions>
            </q-card-section>
          </q-card>

        </q-tab-panel>
      </q-tab-panels>
    </div>

    <q-dialog v-model="showProposeDialog">
      <q-card style="width: 700px; max-width: 80vw;">
        <q-card-section>
          <q-input :label="$t('contracts_config.propose_title')" v-model="msigTitle" />
          <q-input :label="$t('contracts_config.propose_description')" v-model="msigDescription" type="textarea" />
        </q-card-section>
        <q-card-section>
            <q-card-actions align="right">
              <q-btn color="positive" :label="$t('contracts_config.propose_changes')" @click="proposeChanges" />
            </q-card-actions>
        </q-card-section>
      </q-card>
    </q-dialog>

  </q-page>
</template>

<script>
import { mapActions, mapGetters } from 'vuex'
import { colors } from 'quasar'
import AssetInput from '../../components/controls/asset-input'
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

    const referendumConfig = {}
    referendumConfig.duration = 60 * 60 * 24 * 30
    referendumConfig.fee = [
      { key: 0, value: { contract: 'eosio.token', quantity: '100.0000 EOS' } },
      { key: 1, value: { contract: 'eosio.token', quantity: '100.0000 EOS' } },
      { key: 2, value: { contract: 'eosio.token', quantity: '100.0000 EOS' } }
    ]
    referendumConfig.pass = [
      { key: 0, value: 3000 },
      { key: 1, value: 2000 },
      { key: 2, value: 1000 }
    ]
    referendumConfig.quorum_token = [
      { key: 0, value: 3000 },
      { key: 1, value: 2000 },
      { key: 2, value: 1000 }
    ]
    referendumConfig.quorum_account = [
      { key: 0, value: 3000 },
      { key: 1, value: 2000 },
      { key: 2, value: 1000 }
    ]
    referendumConfig.allow_per_account_voting = [
      { key: 0, value: 0 },
      { key: 1, value: 0 },
      { key: 2, value: 0 }
    ]
    referendumConfig.allow_vote_type = [
      { key: 0, value: 0 },
      { key: 1, value: 0 },
      { key: 2, value: 1 }
    ]

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
      brandMsigTitle: 'Update Configuration of Branding',
      brandMsigDescription: '',
      featuresMsigTitle: 'Update DAC Features',
      featuresMsigDescription: '',
      showProposeDialog: false,
      msigTitle: '',
      msigDescription: '',
      tokenConfigLoaded: false,
      referendumConfig,
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
      getReferendumConfig: 'dac/getReferendumConfig'
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
      const description = this.$dir.getRef(this.$dir.REF_DESCRIPTION)
      const homepage = this.$dir.getRef(this.$dir.REF_HOMEPAGE)
      const logoUrl = this.$dir.getRef(this.$dir.REF_LOGO_URL)
      const logoNoTextUrl = this.$dir.getRef(this.$dir.REF_LOGO_NOTEXT_URL)
      const backgroundUrl = this.$dir.getRef(this.$dir.REF_BACKGROUND_URL)
      const discordUrl = this.$dir.getRef(this.$dir.REF_DISCORD_URL)
      const telegramUrl = this.$dir.getRef(this.$dir.REF_TELEGRAM_URL)

      this.brandData = { ...theme, dacName: this.$dir.title, extension, description, homepage, logoUrl, logoNoTextUrl, backgroundUrl, discordUrl, telegramUrl }
    },
    startSave (type) {
      this.savingType = type
      this.showProposeDialog = true
    },
    async proposeChanges () {
      this.showProposeDialog = false

      switch (this.savingType) {
        case 'general':
          await this.saveCustodianConfig()
          break
        case 'proposals':
          await this.saveWpConfig()
          break
        case 'token':
          await this.saveTokenConfig()
          break
        case 'referendum':
          await this.saveReferendumConfig()
          break
        case 'brand':
          await this.saveBrand()
          break
        case 'features':
          await this.saveFeatures()
          break
      }

      this.msigTitle = ''
      this.msigDescription = ''
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
        title: this.msigTitle,
        description: this.msigDescription
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
        title: this.msigTitle,
        description: this.msigDescription
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
        title: this.msigTitle,
        description: this.msigDescription
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
        title: this.msigTitle,
        description: this.msigDescription
      })
      console.log(res)
    },
    getBrandAction (type, value, name = 'regref') {
      if (name === 'regref' && this.$dir.getRef(type) === value) {
        return null
      } else if (name === 'regaccount' && this.$dir.getAccount(type) === value) {
        return null
      }
      const data = {
        dac_id: this.$dir.dacId,
        value,
        type
      }
      if (name === 'regaccount') {
        data.account = data.value
        delete data.value
      }
      // console.log('getBrandAction', data)
      return {
        account: this.$configFile.get('dacdirectory'),
        name,
        authorization: [
          {
            actor: this.$dir.getAccount(this.$dir.ACCOUNT_AUTH),
            permission: 'active'
          }
        ],
        data
      }
    },
    getFeatureAction (type, account) {
      if (this.$dir.getAccount(type) === account) {
        return null
      }
      let name = 'regaccount'
      const data = {
        dac_id: this.$dir.dacId,
        account,
        type
      }
      if (account === '') {
        name = 'unregaccount'
        delete data.account
      }
      // console.log('getBrandAction', data)
      return {
        account: this.$configFile.get('dacdirectory'),
        name,
        authorization: [
          {
            actor: this.$dir.getAccount(this.$dir.ACCOUNT_AUTH),
            permission: 'active'
          }
        ],
        data
      }
    },
    async saveBrand () {
      console.log(`Saving branding`, this.brandData)
      const colorsData = JSON.stringify({ colors: this.brandData.colors, is_dark: this.brandData.is_dark })

      const actions = []
      actions.push(this.getBrandAction(this.$dir.REF_CLIENT_EXTENSION, this.brandData.extension))
      actions.push(this.getBrandAction(this.$dir.REF_DESCRIPTION, this.brandData.description))
      actions.push(this.getBrandAction(this.$dir.REF_HOMEPAGE, this.brandData.homepage))
      actions.push(this.getBrandAction(this.$dir.REF_DISCORD_URL, this.brandData.discordUrl))
      actions.push(this.getBrandAction(this.$dir.REF_TELEGRAM_URL, this.brandData.telegramUrl))
      if (!this.brandData.extension) {
        actions.push(this.getBrandAction(this.$dir.REF_COLORS, colorsData))
        actions.push(this.getBrandAction(this.$dir.REF_LOGO_URL, this.brandData.logoUrl))
        actions.push(this.getBrandAction(this.$dir.REF_LOGO_NOTEXT_URL, this.brandData.logoNoTextUrl))
        actions.push(this.getBrandAction(this.$dir.REF_BACKGROUND_URL, this.brandData.backgroundUrl))
      }

      console.log(actions)
      const res = await this.$store.dispatch('user/proposeMsig', {
        actions: actions.filter(a => a !== null),
        title: this.msigTitle,
        description: this.msigDescription
      })
      console.log(res)
    },

    setBrand (type, color) {
      if (!this.brandData.extension) {
        colors.setBrand(type, color)
      }
    },

    async saveFeatures () {
      const actions = []
      console.log('saveFeatures', this.wpAccount)
      const refAccount = (this.referendumEnabled) ? this.referendumAccount : ''
      const wpAccount = (this.wpEnabled) ? this.wpAccount : ''
      actions.push(this.getFeatureAction(this.$dir.ACCOUNT_REFERENDUM, refAccount))
      actions.push(this.getFeatureAction(this.$dir.ACCOUNT_PROPOSALS, wpAccount))

      console.log('saveFeatures', actions)
      const res = await this.$store.dispatch('user/proposeMsig', {
        actions: actions.filter(a => a !== null),
        title: this.msigTitle,
        description: this.msigDescription
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
          const referendumConfig = this.getReferendumConfig
          if (referendumConfig && referendumConfig.fee) {
            this.referendumConfig = JSON.parse(JSON.stringify(referendumConfig))
          }
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
      this.setBrand('primary', newData)
    },
    'brandData.colors.secondary': function (newData) {
      this.setBrand('secondary', newData)
    },
    'brandData.colors.accent': function (newData) {
      this.setBrand('accent', newData)
    },
    'brandData.colors.positive': function (newData) {
      this.setBrand('positive', newData)
    },
    'brandData.colors.negative': function (newData) {
      this.setBrand('negative', newData)
    },
    'brandData.colors.info': function (newData) {
      this.setBrand('info', newData)
    },
    'brandData.colors.warning': function (newData) {
      this.setBrand('warning', newData)
    },
    'brandData.is_dark': function (newData) {
      this.$q.dark.set(newData)
    }
  }

}
</script>
