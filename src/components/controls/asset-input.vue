<template>
  <div class="row no-wrap">
    <q-input
            class="full-width"
            :label="label"
            type="number"
            color="primary"
            v-model="internalValue.quantity"
            ref="quantity_input"
            @input="updateValueQuantity"
    />
    <q-select
            v-model="internalValue.symbol"
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
      default: () => []
    },
    label: {
      type: String,
      default: () => ''
    },
    value: {
      type: Object
    }
  },
  data () {
    return {
      selected_symbol: '',
      parsed: {}
    }
  },
  computed: {
    internalValue () {
      let extAsset = this.value
      if (!extAsset) {
        extAsset = { quantity: '0.0000 EOS', contract: 'eosio.token' }
      }
      return this.parse(extAsset)
    }
  },
  methods: {
    updateValueQuantity (val) {
      let symbolOpt = this.$refs.symbol_input.value
      let symbol
      if (typeof symbolOpt === 'string') {
        symbolOpt = this.$refs.symbol_input.options.filter(o => o.label === this.$refs.symbol_input.value)[0]
      }
      symbol = symbolOpt.value

      let quantity = parseFloat(val)

      this.updateValue(quantity, symbol)
    },
    updateValueAsset (val) {
      const symbol = val.value
      let quantity = parseFloat(this.$refs.quantity_input.value)

      this.updateValue(quantity, symbol)
    },
    updateValue (quantity, symbol) {
      if (!symbol) {
        return
      }
      if (isNaN(quantity)) {
        quantity = 0
      }
      quantity = `${quantity.toFixed(symbol.precision)} ${symbol.symbol}`

      const value = { quantity, contract: symbol.contract }
      console.log(`updating value`, value)
      // this.value = value

      this.$emit('input', value)
    },
    parse (val) {
      if (val) {
        val = JSON.parse(JSON.stringify(val))
        // console.log('parse', val)
        const contract = val.contract
        const [quantity, symbol] = val.quantity.split(' ')
        const [, decimals] = quantity.split('.')
        const precision = decimals ? decimals.length : 0
        // console.log({ contract, quantity, symbol, precision })
        return JSON.parse(JSON.stringify({ contract, quantity, symbol, precision }))
      }
      return null
    }
  }
}
</script>
