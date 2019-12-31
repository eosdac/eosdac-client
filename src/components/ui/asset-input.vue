<template>
  <div class="row no-wrap">
    <q-input
            class="full-width"
            type="number"
            :label="label"
            color="primary"
            v-model="value.quantity"
            ref="quantity_input"
            @input="updateValueQuantity"
    />
    <q-select
            v-model="selected_symbol"
            color="primary"
            ref="symbol_input"
            :options="
                  allowed.map(c => {
                    return { label: c.symbol, value: c };
                  })
                "
            @input="updateValueAsset"
    />
  </div>
</template>

<script>
export default {
  name: 'asset-input',
  props: {
    allowed: {
      type: Array,
      default: () => [ { quantity: '0.0000', symbol: 'EOS', precision: 4, contract: 'eosio.token' } ]
    },
    label: {
      type: String,
      default: () => ''
    }
  },
  data () {
    return {
      selected_symbol: 'EOS',
      value: { quantity: '0.0000', symbol: 'EOS', precision: 4, contract: 'eosio.token' }
    }
  },
  computed: {},
  methods: {
    updateValueQuantity (val) {
      // console.log(`updateValueQuantity`, val)
      const symbol = this.$refs.symbol_input.value.value
      let quantity = parseFloat(val)

      this.updateValue(quantity, symbol)
    },
    updateValueAsset (val) {
      // console.log(`updateValueAsset`, val)
      const symbol = val.value
      let quantity = parseFloat(this.$refs.quantity_input.value)

      this.updateValue(quantity, symbol)
    },
    updateValue (quantity, symbol) {
      // console.log(`updateValue`, quantity, symbol)
      if (!symbol) {
        return
      }
      if (isNaN(quantity)) {
        quantity = 0
      }
      quantity = quantity.toFixed(symbol.precision)

      const value = { quantity, symbol: symbol.symbol, precision: symbol.precision, contract: symbol.contract }
      console.log(`updating value`, value)
      this.value = value

      this.$emit('input', value)
    }
  }
}
</script>
