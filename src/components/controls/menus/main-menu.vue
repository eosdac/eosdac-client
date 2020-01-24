<template>
  <q-list no-border link inset-delimiter class="main-menu">

    <q-item clickable to="/vote-custodians">
      <q-item-section avatar>
        <q-icon :name="$configFile.icon.vote" />
      </q-item-section>

      <q-item-section>
        <q-item-label v-if="getAccountName">{{$t('menu.custodians')}}</q-item-label>
        <q-item-label v-else>{{$t('menu.view_custodians')}}</q-item-label>
      </q-item-section>

    </q-item>

    <q-item clickable to="/manage-candidateship" v-if="getAccountName">
      <q-item-section avatar>
        <q-icon :name="$configFile.icon.cand_reg" />
      </q-item-section>

      <q-item-section>
        <q-item-label v-if="!getIsCandidate || !getIsCandidate.is_active">{{$t('menu.register_as_candidate')}}</q-item-label>
        <q-item-label v-else>{{$t('menu.unregister_as_candidate')}}</q-item-label>
      </q-item-section>

    </q-item>

    <q-item clickable to="/constitution" v-if="!getAgreedTermsVersion">
      <q-item-section avatar>
        <q-icon :name="$configFile.icon.constitution" />
      </q-item-section>

      <q-item-section>
        <q-item-label v-if="getAgreedTermsVersion">{{$t('default.sign_the_constitution')}}</q-item-label>
        <q-item-label v-else>{{$t('default.read_the_constitution')}}</q-item-label>
      </q-item-section>
    </q-item>

    <q-item clickable to="/review-proposals">
      <q-item-section avatar>
        <q-icon name="mdi-account-supervisor-circle" />
      </q-item-section>

      <q-item-section class="text-weight-light" v-if="getIsCustodian">{{$t('menu.vote_msigs')}}</q-item-section>
      <q-item-section class="text-weight-light" v-else>{{$t('menu.view_msigs')}}</q-item-section>
    </q-item>

    <q-item clickable to="/review-worker-proposals" v-if="wpEnabled">
      <q-item-section avatar>
        <q-icon name="mdi-human" />
      </q-item-section>

      <q-item-section class="text-weight-light" v-if="getIsCustodian">{{$t('menu.vote_worker_proposals')}}</q-item-section>
      <q-item-section class="text-weight-light" v-else>{{$t('menu.view_worker_proposals')}}</q-item-section>
    </q-item>

    <q-item clickable to="/custodian/dac-management" v-if="getIsCustodian">
      <q-item-section avatar>
        <q-icon name="mdi-cogs" />
      </q-item-section>

      <q-item-section class="text-weight-light">{{$t('menu.manage_dac')}}</q-item-section>
    </q-item>

    <q-item clickable to="/dac-activity/financials" v-if="!getIsCustodian">
      <q-item-section avatar>
        <q-icon :name="$configFile.icon.constitution" />
      </q-item-section>

      <q-item-section class="text-weight-light">{{$t('menu.view_financials')}}</q-item-section>
    </q-item>

    <q-item v-if="getEnableCustPayments" clickable to="/custodian/my-payments">
      <q-item-section avatar>
        <q-icon name="mdi-wallet-outline" />
      </q-item-section>

      <q-item-section class="text-weight-light">{{$t('menu.my_payments')}}</q-item-section>
    </q-item>

    <q-item clickable to="/explore-dac">
      <q-item-section avatar>
        <q-icon name="mdi-globe-model" />
      </q-item-section>

      <q-item-section class="text-weight-light">{{$t('menu.explore')}}</q-item-section>
    </q-item>

<!--    <custodian-menu />-->
    <member-menu />

    <!--<menu-extension />-->

    <!-- <q-item clickable to="/settings">
      <q-item-section avatar>
        <q-icon :name="$configFile.icon.settings" />
      </q-item-section>
      <q-item-section>
        <q-item-label>{{$t('menu.settings')}}</q-item-label>
      </q-item-section>
    </q-item>

    <q-item v-if="getSettingByName('debug_dev_tools').value" clickable to="/dashboard">
      <q-item-section avatar>
        <q-icon :name="$configFile.icon.dev" />
      </q-item-section>
      <q-item-section>
        <q-item-label>
          Dashboard
        </q-item-label>
      </q-item-section>
    </q-item> -->

<!--    <dev-menu />-->
  </q-list>
</template>

<script>
import { mapGetters } from 'vuex'
// import custodianMenu from './custodian-menu'
import memberMenu from './member-menu'
// import devMenu from "./dev-menu";
// import menuExtension from "../../../extensions/components/menu/menu-extension";
export default {
  name: 'MainMenu',
  components: {
    // custodianMenu,
    memberMenu
    // devMenu,
    // menuExtension
  },
  data () {
    return {
      referendumsEnabled: !!this.$dir.getAccount(this.$dir.ACCOUNT_REFERENDUM),
      wpEnabled: !!this.$dir.getAccount(this.$dir.ACCOUNT_PROPOSALS)
    }
  },
  computed: {
    ...mapGetters({
      getAccountName: 'user/getAccountName',
      getAgreedTermsVersion: 'user/getAgreedTermsVersion',
      getSettingByName: 'user/getSettingByName',
      getIsCustodian: 'user/getIsCustodian',
      getIsCandidate: 'user/getIsCandidate',
      getEnableCustPayments: 'dac/getEnableCustPayments'
    })
  }
}
</script>

<style lang="stylus">
  .main-menu
    font-size: 1.15em
</style>
