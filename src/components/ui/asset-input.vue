<template>
  <div class="row no-wrap">
    <q-input
            class="full-width"
            type="number"
            :label="label"
            color="primary-light"
            v-model="data.pay_amount"
    />
    <q-select
            stack-label="&nbsp"
            hide-underline
            v-model="data.symbol"
            color="primary"
            :options="
                  allowed.map(c => {
                    return { label: c.symbol, value: c.symbol };
                  })
                "
    />
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
export default {
  name: 'asset-input',
  props: {
    allowed: {
      type: Array,
      default: () => []
    },
    data: {
      type: Object,
      default: () => []
    },
    label: {
      type: String,
      default: () => []
    }
  },
  data () {
    return {
    }
  },
  computed: {
    ...mapGetters({
      getAccount: 'user/getAccount'
    })
  },
  methods: {
  }
}
</script>
