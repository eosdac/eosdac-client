<script>
/**
 * Asset input shows an amount+token fields
 *
 * @todo Should this be in the components/ui as it's very simiar to components/ui/seconds-input.vue?
 */
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
    },
    max: {
      default: false
    }
  },

  data () {
    return {
      precision: 0,
      selectedValue: 0, // use computed
      selectedSymbol: ''
    }
  },

  computed: {
    amount: {
      get: function () {
        let newValue = parseFloat(this.selectedValue)
        newValue = newValue.toFixed(this.precision)
        return newValue
      },
      set: function (newValue) {
        newValue = parseFloat(newValue)
        newValue = newValue.toFixed(this.precision)
        this.selectedValue = newValue
      }
    }
  },

  mounted () {
    let parsed          = this.value.quantity.split(' ')
    this.selectedSymbol = parsed[1]
    Array.from(this.allowed).forEach(currency => {
      if (currency.symbol === this.selectedSymbol) {
        this.precision = currency.precision
      }
    })
    this.amount = parsed[0]
  },

  methods: {
    onChange () {
      this.$forceUpdate()
      let value = this.amount + ' ' + this.selectedSymbol
      let selectedContract = null
      Array.from(this.allowed).forEach(currency => {
        if (currency.symbol === this.selectedSymbol) {
          selectedContract = currency.contract
        }
      })
      this.$emit('input', { quantity: value, contract: selectedContract })
    }
  }
}
</script>
<template>
  <div class="row no-wrap q-gutter-sm">
    <q-input
      :label="label"
      type="number" v-model.number="amount"
      class="col" input-class = "text-right"
      :suffix="(allowed.length > 1) ? '': selectedSymbol"
      :max="max" min=0
      @change="onChange" @blur="onChange"
      :step="1/Math.pow(10,precision)"
    />
    <q-select
      v-if="allowed.length > 1"
      v-model="selectedSymbol"
      color="primary"
      label=""
      :options="allowed.map(c => { return { label: c.symbol, value: c } })"
    />
  </div>
</template>
