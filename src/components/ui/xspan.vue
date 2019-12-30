<template>
    <q-spinner-pie v-if="value === null" color="primary" />
    <span v-else>{{ value }}</span>
</template>

<script>
export default {
  name: 'Xspan',
  props: {
    value: null
  },
  data () {
    return {}
  }
}
</script>
