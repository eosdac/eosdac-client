<template>
  <div class="bg-accent">
    <!-- no props set = custom_mode -->
    <div v-if="account === '' && name === ''">
      <div class="row">
        <q-item>
          <q-item-section>
            <q-input
              v-model="custom_mode.account"
              type="text"
              debounce="1000"
              :label="$t('actionmaker.contract_name')"
              placeholder="eg. eosio/eosio.token"
              @input="loadActions"
            >
              <q-autocomplete
                :min-characters="0"
                @selected="custom_mode_parse_actions(custom_mode.account)"
                :static-data="{
                  field: 'value',
                  list: Object.keys($configFile.configFile.contracts)
                    .sort()
                    .map(fa => {
                      return {
                        value: $configFile.configFile.contracts[fa].name,
                        label: $configFile.configFile.contracts[fa].name
                      };
                    })
                }"
              />
            </q-input>
          </q-item-section>
          <q-item-section side>
            <q-btn
              color="primary"
              flat
              label="load"
              @click="loadActions"
            />
          </q-item-section>
        </q-item>
      </div>

      <div v-if="custom_mode.abi.actions" class="row q-mb-md bg-bg2 q-pa-xs">
        <q-btn
          size="12px"
          :icon="$configFile.icon.action"
          v-for="(action, i) in custom_mode.abi.actions"
          :label="action.name"
          :key="`a${i}`"
          class="animate-pop q-ma-xs"
          @click="
            custom_mode.action_name = action.name;
            custom_mode.action_type = action.type;
          "
        />
      </div>
    </div>

    <div
      v-if="data_fields.length"
      class=" animate-fade bg-bg2 q-pa-md q-mt-md round-borders"
    >
      <div class="row justify-between items-center q-mb-md">
          <q-breadcrumbs separator=" > ">
              <q-breadcrumbs-el>{{ this.account || custom_mode.account }}</q-breadcrumbs-el>
              <q-breadcrumbs-el>{{ this.name || custom_mode.action_name }}</q-breadcrumbs-el>
          </q-breadcrumbs>

        <auth-display v-model="authorization" :auth="getAuth" />
      </div>
      <div class="row q-col-gutter-md">
        <div
          v-for="(field, i) in data_fields"
          :key="`field_${i}`"
          class="col-xs-12 col-md-6"
        >
            <div>
              <div v-if="field.type == 'bytes'" class="full-width">
                <file-input
                  style="margin-top:20px"
                  v-if="field.name == 'abi'"
                  v-model="field.value"
                  label="Select abi"
                  :asbuffer="false"
                />
                <file-input
                  style="margin-top:20px"
                  v-if="field.name == 'code'"
                  v-model="field.value"
                  label="Select wasm"
                  :asbuffer="true"
                />
              </div>
              <div v-else-if="field.type == 'bool'">
                 <q-toggle v-model="data_fields[i].value" :label="field.name" color="positive" left-label />
              </div>
              <div v-else-if="isNumberType(field.type)">
                <q-input
                  class="animate-fade"
                  v-model="field.value"
                  :name="field.name"
                  ref="input"
                  color="primary"
                  :label="field.name"
                  type="number"
                  :placeholder="field.type"
                />
              </div>
              <div v-else-if="field.type == 'asset'">
                <q-input
                  class="animate-fade"
                  v-model="field.value"
                  :name="field.name"
                  ref="input"
                  color="primary"
                  :label="`${field.name} & symbol`"
                  type="text"
                  :placeholder="field.type"
                />
              </div>
              <div v-else>
                <q-input
                  class="animate-fade"
                  v-model="field.value"
                  :name="field.name"
                  ref="input"
                  color="primary"
                  :label="field.name"
                  type="text"
                  :placeholder="field.type"
                />
              </div>
            </div>
        </div>
      </div>

      <div class="row q-mt-md justify-end items-center">
        <span
          v-if="add_action_feedback != ''"
          class="text-positive on-left animate-fade q-caption"
          >{{ add_action_feedback }}</span
        >
        <q-btn
          color="primary"
          icon="add"
          :label="$t('actionmaker.add_action')"
          @click="processInputs"
        />
      </div>
    </div>

    <div v-if="isLoading" class="row justify-center">
      <q-spinner-pie color="primary" :size="60" />
    </div>
    <div v-if="abi_load_error != ''" class="animate-fade q-pa-md text-negative q-caption">
      {{ abi_load_error }}
    </div>

  </div>
</template>

<script>
import fileInput from 'components/controls/file-input'
import authDisplay from 'components/ui/auth-display'
const prettyHtml = require('json-pretty-html').default
import { mapGetters } from 'vuex'
const { TextDecoder, TextEncoder } = require('text-encoding')
const { Serialize } = require('eosjs')
const numberTypes = [
  'uint8',
  'int8',
  'uint16',
  'int16',
  'uint32',
  'uint64',
  'int64',
  'int32',
  'varuint32',
  'varint32',
  'uint128',
  'int128',
  'float32',
  'float64',
  'float128'
]
import { Notify } from 'quasar'

export default {
  name: 'actionMaker',
  components: {
    fileInput,
    authDisplay
  },
  props: {
    account: {
      type: String,
      default: ''
    },
    name: {
      type: String,
      default: ''
    },
    prefill: {
      type: Object,
      default: function () {
        return {}
      }
    },
    auth: {
      type: Array,
      default: function () {
        return []
      }
    },
    msigmode: {
      type: Boolean,
      default: false
    }
  },
  data () {
    return {
      add_action_feedback: '',
      abi_load_error: '',

      isLoading: false,

      data_fields: [],
      authorization: [],

      custom_mode: {
        account: '',
        action_name: '',
        action_type: '',
        abi: {}
      }
    }
  },
  computed: {
    ...mapGetters({
      getDacApi: 'global/getDacApi',
      getIsDark: 'ui/getIsDark',
      getAccountName: 'user/getAccountName',
      getAccount: 'user/getAccount'
    }),
    getAuth () {
      if (this.getAccountName && this.getAccount) {
        if (this.auth.length) {
          return this.auth
        }
      }

      return []
    }
  },

  methods: {
    prettyHtml,
    async getAbi (contract) {
      if (!this.getDacApi) return
      this.abi_load_error = ''
      this.isLoading = true

      let abi = await this.getDacApi.eos.get_abi(contract).catch(e => {
        console.log(e)
      })

      this.isLoading = false
      if (abi && abi.abi) {
        return abi.abi
      } else {
        this.abi_load_error = `ABI for ${contract} not found`
        return false
      }
    },

    async loadActions (contract) {
      console.log(`UPDATE`, contract)
      this.data_fields = []
      if (contract) {
        this.custom_mode_parse_actions(contract)
      } else {
        this.custom_mode.abi = {}
      }
    },

    getDataFieldsForActionType (abi, actionType) {
      console.log(abi)
      if (abi && abi.structs) {
        let struct = abi.structs.find(s => s.name === actionType)
        return struct.fields
      }
    },

    async setFieldsModel (contract, actionName, abi = false) {
      this.data_fields = []

      let actions = abi || (await this.getAbi(contract))
      let fields = this.getDataFieldsForActionType(actions, actionName)
      if (!fields) return
      this.data_fields = fields.map(f => {
        if (this.prefill[f.name]) {
          f.value = this.prefill[f.name]
        } else {
          f.value = ''
        }
        return f
      })
    },

    async processInputs () {
      let processError = false
      let actionData = this.data_fields.reduce((res, input) => {
        // validate and cast types
        let value = String(input.value).trim()

        if (
          (value.includes('[') && value.includes(']')) ||
          (value.includes('{') && value.includes('}'))
        ) {
          value = JSON.parse(value)
        } else if (this.isNumberType(input.type)) {
          value = Number(value)
        } else if (input.type === 'bool') {
          value = value === 'true'
        } else if (input.type === 'name' || input.type === 'account_name') {
          if (!this.$helper.isAccountname(value) && value !== '') {
            processError = `${input.name}: invalid accountname`
          }
        } else if (input.type === 'asset') {
          let [quantity, symbol] = value.replace(/\s\s+/g, ' ').split(' ')
          if (!quantity || !symbol || symbol.length < 3) {
            processError = `${input.name}: invalid asset`
          } else {
            value = Number(quantity).toFixed(4) + ' ' + symbol.toUpperCase()
          }
        }

        res[`${input.name}`] = value
        return res
      }, {})

      if (processError) {
        this.$q.notify({
          message: `Input Error`,
          timeout: 7000,
          type: 'negative',
          detail: processError,
          position: 'bottom-right',
          closeBtn: true
        })
        return
      }

      let action = {
        account: this.account || this.custom_mode.account,
        name: this.name || this.custom_mode.action_name,
        data: actionData
      }
      action.hex = await this.serializeActionData(action)

      action.authorization = JSON.parse(this.authorization)

      if (!action.hex) {
        return
      }

      this.add_action_feedback = `Action added`
      setTimeout(() => {
        this.add_action_feedback = ''
      }, 1500)

      this.custom_mode.account = ''
      this.custom_mode.action_name = ''
      this.loadActions('')

      this.$emit('actiondata', action)
    },

    async serializeActionData (action) {
      try {
        let account = action.account
        let name = action.name
        let data = action.data
        const contract = await this.getDacApi.eosapi.getContract(account)
        let hex = Serialize.serializeActionData(
          contract,
          account,
          name,
          data,
          new TextEncoder(),
          new TextDecoder()
        )
        return hex
      } catch (e) {
        console.log(e)
        Notify.create({
          message: `Serialize` + e.stack.split('\n')[0],
          detail: 'See console for more info',
          timeout: 2000,
          type: 'negative',
          position: 'bottom-right'
        })
        return false
      }
    },

    async custom_mode_parse_actions (accountname) {
      this.custom_mode.action_name = ''
      if (!this.$helper.isAccountname(accountname)) {
        console.log(`"${accountname}" is not a valid accountname`)
        return false
      }
      this.custom_mode.abi = {}

      let abi = await this.getAbi(accountname).catch(e => {
        this.isLoading = false
      })
      if (abi) {
        this.custom_mode.abi = abi
      }
    },

    isNumberType (type) {
      return numberTypes.includes(type)
    }
  },

  async mounted () {
    if (this.account !== '' && this.name !== '') {
      await this.setFieldsModel(this.account, this.name)
    }
  },
  watch: {
    'custom_mode.action_name': function (oldv, newv) {
      if (oldv !== newv) {
        this.setFieldsModel(
          this.custom_mode.account,
          this.custom_mode.action_type,
          JSON.parse(JSON.stringify(this.custom_mode.abi))
        )
      }
    },

    name: function () {
      if (this.account && this.name) {
        this.setFieldsModel(this.account, this.name)
      }
    }
  }
}
</script>
