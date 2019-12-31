<template>
  <q-page class="q-pa-md">
    <div
      class="q-pa-md round-borders bg-bg1 bg-logo shadow-4 row"
      style="min-height:200px"
    >
      <q-select
        label="Select contract"
        color="primary"
        dark
        v-model="selected_contract"
        :options="getContractOptions()"
      />
      <contract-settings :contract="selected_contract" />
    </div>
  </q-page>
</template>

<script>
import { mapGetters } from 'vuex'
import contractSettings from 'components/controls/contract-settings'

export default {
  name: 'playground',
  components: {
    contractSettings
  },
  data () {
    return {
      selected_contract: this.$dir.getAccount(this.$dir.ACCOUNT_CUSTODIAN)
    }
  },
  computed: {
    ...mapGetters({
      getDacDirectory: 'global/getDacDirectory',
      getDacApi: 'global/getDacApi'
    })
  },
  methods: {
    getContractOptions () {
      let contracts = [
        this.$dir.getAccount(this.$dir.ACCOUNT_CUSTODIAN)
        // this.$configFile.get("wpcontract")
      ]
      return contracts.map(c => {
        return { value: c, label: c }
      })
    }
  },
  async mounted () {
  }
}
</script>
