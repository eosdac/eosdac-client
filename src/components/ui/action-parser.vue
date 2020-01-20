<template>
  <div>
    <q-list separator>
      <q-item v-for="(action, key) in actions" :key="key">
        <q-item-section v-if="actionMetadata[key].type === 'transfer'" avatar>
          <q-icon :name="$configFile.icon.systemtoken" v-if="action.account === 'eosio.token'" />
          <q-icon :name="$configFile.icon.dactoken" v-else />
        </q-item-section>
        <q-item-section v-else avatar class="q-pa-none">
          <display-action :action="action" viewable />
        </q-item-section>
        <q-item-section v-if="actionMetadata[key].type === 'transfer'">
          <q-item-label>{{$t('action.transfer')}} <b>{{$helper.assetToLocaleNumber(action.data.quantity)}}</b></q-item-label>
          <q-item-label caption>{{action.data.from}} -> {{action.data.to}}</q-item-label>
          <q-item-label caption>{{action.data.memo}}</q-item-label>
        </q-item-section>
        <q-item-section v-else>
          <q-item-label>{{action.account}} :: {{action.name}}</q-item-label>
          <q-item-label caption>{{$t('action.click_icon')}}</q-item-label>
        </q-item-section>
        <q-item-section side>
          <q-item-label v-for="(auth, a) in action.authorization" :key="a">{{auth.actor}}@{{auth.permission}}</q-item-label>
        </q-item-section>
      </q-item>
    </q-list>
  </div>
</template>

<script>
import displayAction from 'components/ui/display-action'
export default {
  name: 'Actionparser',
  components: {
    displayAction
  },

  props: {
    actions: Array
  },
  computed: {
    actionMetadata () {
      return this.actions.map((a) => {
        const ret = { type: 'custom' }
        if (a.name === 'transfer' && a.data.from && a.data.to && a.data.quantity) {
          ret.type = 'transfer'
        }
        return ret
      })
    }
  },

  data () {
    return {
      activeSlide: 0,
      seenAll: false
    }
  },

  methods: {
    parseActionData (actiondata) {
      let values = Object.values(actiondata)
      return values
    }
  }
}
</script>
<!--
<style lang="stylus">
@import '~variables'
.action_data_parser{
  border-bottom: 1px solid grey;
}

.action_data_parser:last-of-type{
  border-bottom:none;
}
</style>-->
