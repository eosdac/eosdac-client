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

    <q-item clickable to="/constitution">
      <q-item-section avatar>
        <q-icon :name="$configFile.icon.constitution" />
      </q-item-section>

      <q-item-section>
        <q-item-label v-if="getAccountName">{{$t('default.sign_the_constitution')}}</q-item-label>
        <q-item-label v-else>{{$t('default.read_the_constitution')}}</q-item-label>
      </q-item-section>
    </q-item>

    <custodian-menu />
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
import custodianMenu from './custodian-menu'
import memberMenu from './member-menu'
// import devMenu from "./dev-menu";
// import menuExtension from "../../../extensions/components/menu/menu-extension";
export default {
  name: 'MainMenu',
  components: {
    custodianMenu,
    memberMenu
    // devMenu,
    // menuExtension
  },
  data () {
    return {}
  },
  computed: {
    ...mapGetters({
      getAccountName: 'user/getAccountName',
      getSettingByName: 'user/getSettingByName',
      getIsCustodian: 'user/getIsCustodian',
      getIsCandidate: 'user/getIsCandidate'
    })
  }
}
</script>

<style lang="stylus">
  .main-menu
    font-size: 1.15em
</style>
