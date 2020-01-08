<template>
  <q-page class="q-pa-md">
    <div class="q-pa-md rounded-borders shadow-4 bg-logo">
      <transaction-builder :enable_msig="true" />
    </div>
  </q-page>
</template>

<script>
import transactionBuilder from 'components/controls/transaction-builder'
export default {
  name: 'transactions',
  components: {
    transactionBuilder
  }
}
</script>
