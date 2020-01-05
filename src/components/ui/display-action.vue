<template>
  <div>
    <transition
      appear
      enter-active-class="animated flipInX"
      leave-active-class="animated flipOutX"
    >
      <div appear class="q-pa-sm rounded-borders q-ma-xs">
        <q-btn
          v-if="viewable"
          size="lg"
          dense
          icon="pageview"
          flat
          title="view action data"
        >
          <q-popup-proxy>
            <q-list style="min-width:200px">
              <q-item v-for="(value, key) in action.data" :key="`_${key}`">
                <q-item-section avatar
                                v-if="
                      (action.name == 'setcode' || action.name == 'setabi') &&
                        (key == 'code' || key == 'abi')
                    "
                >
                  <q-icon
                        name="mdi-code-not-equal-variant"
                        class="q-mr-xs" />
                </q-item-section>
                <q-item-section>
                  <q-item-label>{{ key }}</q-item-label>
                  <q-item-label caption>{{ value }}</q-item-label>
                </q-item-section>
              </q-item>
            </q-list>
          </q-popup-proxy>
        </q-btn>
        <!-- <q-btn size="sm" dense  class="q-mr-xs text-text1" icon="edit" flat @click="edit_action_modal=true" title="edit action" /> -->

      </div>
    </transition>

  </div>
</template>

<script>
import { mapGetters } from 'vuex'
export default {
  name: 'displayAction',
  props: {
    action: Object,
    closable: Boolean,
    viewable: Boolean
  },
  data () {
    return {
      edit_action_modal: false
    }
  },
  computed: {
    ...mapGetters({
    }),
    getaction () {
      return this.action
    }
  }
}
</script>
<!--
<style lang="stylus">
@import '~variables'
</style>-->
