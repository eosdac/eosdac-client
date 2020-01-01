<template>
  <div :label="label" class="q-pa-lg">
    <div class="text-h6">{{label}}</div>

    <div class="row q-col-gutter-md">
      <div v-for="(item, i) in internalValue" :key="i" class="col-lg-4">
          <asset-input :allowed="allowed" v-model="item.value" :label="subLabel(item.key)" v-if="type === 'asset'" />
          <q-toggle :false-value="0" :true-value="1" v-model="item.value" :label="subLabel(item.key)" v-if="type === 'bool'" />
          <q-input type="number" v-model="item.value" :label="subLabel(item.key)" v-if="type === 'number'" />
      </div>
    </div>
  </div>
</template>

<script>

import AssetInput from './asset-input'
export default {
  name: 'referendum-config-group',
  components: { AssetInput },
  props: {
    allowed: {
      type: Array,
      default: () => []
    },
    label: {
      type: String,
      default: () => ''
    },
    type: {
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
      const group = this.value
      return group
    }
  },
  methods: {
    updateValueQuantity (val) {
      // console.log(`updateValueQuantity`, val)
      let timeframeOpt = this.$refs.timeframe_input.value
      let timeframe
      if (typeof timeframeOpt === 'string') {
        timeframeOpt = this.$refs.timeframe_input.options.filter(o => o.label === this.$refs.timeframe_input.value)[0]
      }
      timeframe = timeframeOpt.value

      console.log('timeframeOpt', timeframeOpt)
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
      console.log(`updating value`, quantity)

      this.$emit('input', quantity)
    },
    subLabel (type) {
      let text = ''
      switch (type) {
        case 0:
          text = 'Binding'
          break
        case 1:
          text = 'Semi-Binding'
          break
        case 2:
          text = 'Opinion'
          break
      }
      return text
    }
  }
}
</script>
