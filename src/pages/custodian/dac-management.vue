<template>
  <q-page class="q-pa-md">
    <h4>Manage DAC</h4>

    <q-tabs align="justify">
      <q-route-tab
        default
        label="financials"
        to="/custodian/dac-management/financials"
        exact
      />
      <q-route-tab
        label="constitution"
        to="/custodian/dac-management/constitution"
      />
      <q-route-tab
        label="configuration"
        to="/custodian/dac-management/configuration"
      />
      <q-route-tab
        label="advanced"
        to="/custodian/dac-management/advanced"
      />
    </q-tabs>
    <router-view />
  </q-page>
</template>

<script>
export default {
  // name: 'PageName',
}
</script>

<style></style>
