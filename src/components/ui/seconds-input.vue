<template>
  <div class="row no-wrap q-gutter-sm">
    <q-input
      class = "col"
      :label ="label"
      v-model ="internalValue.quantity"
      type = "number"
      input-class = "text-right"
      ref = "quantity_input"
      @input ="updateValueQuantity"
    />
    <q-select
      v-model ="internalValue.timeframe"
      label = ""
      ref = "timeframe_input"
      :options ="allowed.map(c => {return { label: c, value: c };})"
      @input="updateValueTimeframe"
    />
  </div>
</template>

<script>
/**
 * Seconds selector
 *
 * Timeframe should have a label defined as an empty string, or else, the
 * selected value looks a bit shifted up, not aligning with the quantity
 * input.
 *
 * @todo add option for weeks and months
 * @todo Should this be in the components/controls as it's very simiar to components/controls/asset-input.vue?
 */

const oneMinute = 60
const oneHour = oneMinute * 60
const oneDay = oneHour * 24
const oneYear = oneDay * 365

export default {
  name: 'seconds-input',
  props: {
    allowed: {
      type: Array,
      default: () => ['seconds', 'minutes', 'hours', 'days', 'years']
    },
    label: {
      type: String,
      default: () => ''
    },
    value: {
      type: Number
    }
  },
  data () {
    return {}
  },
  computed: {
    internalValue () {
      let seconds = this.value
      if (!seconds) {
        seconds = 0
      }
      return this.bestFit(seconds)
    }
  },
  methods: {
    bestFit (seconds) {
      let quantity = seconds
      let timeframe = 'seconds'
      if (quantity % oneYear === 0) {
        timeframe = 'years'
        quantity /= oneYear
      } else if (quantity % oneDay === 0) {
        timeframe = 'days'
        quantity /= oneDay
      } else if (quantity % oneHour === 0) {
        timeframe = 'hours'
        quantity /= oneHour
      } else if (quantity % oneMinute === 0) {
        timeframe = 'minutes'
        quantity /= oneMinute
      }

      const val = { quantity, timeframe }
      return val
    },
    updateValueQuantity (val) {
      let timeframeOpt = this.$refs.timeframe_input.value
      let timeframe
      if (typeof timeframeOpt === 'string') {
        timeframeOpt = this.$refs.timeframe_input.options.filter(o => o.label === this.$refs.timeframe_input.value)[0]
      }
      timeframe = timeframeOpt.value
      let quantity = parseFloat(val)

      this.updateValue(quantity, timeframe)
    },
    updateValueTimeframe (val) {
      // console.log(`updateValueTimeframe selected`, val)
      const symbol = val.value
      let quantity = parseInt(this.$refs.quantity_input.value)

      this.updateValue(quantity, symbol)
    },
    updateValue (quantity, timeframe) {
      // console.log(`updateValue`, quantity, timeframe)
      if (!timeframe) {
        return
      }
      if (isNaN(quantity)) {
        quantity = 0
      }

      switch (timeframe) {
        case 'years':
          quantity *= oneYear
          break
        case 'days':
          quantity *= oneDay
          break
        case 'hours':
          quantity *= oneHour
          break
        case 'minutes':
          quantity *= oneMinute
          break
      }
      // quantity = `${quantity.toFixed(timeframe.precision)} ${timeframe.symbol}`
      //
      // const value = { quantity, contract: timeframe.contract }
      console.log(`updating value`, quantity)

      this.$emit('input', quantity)
    }
  }
}
</script>
