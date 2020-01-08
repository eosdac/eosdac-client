<template>
  <div>
    <div class="row items-center" v-for="(action, key) in actions" v-bind:key="key">
      <q-item>
        <q-item-section avatar>
          <display-action :action="action" viewable />
        </q-item-section>
      </q-item>
      <q-item>
        <q-breadcrumbs separator=">" inlist="">
          <q-breadcrumbs-el :label="action.account" />
          <q-breadcrumbs-el :label="action.name" />
        </q-breadcrumbs>
      </q-item>
      <q-item>
        <span class="q-pa-sm">
        <span class="on-left">Authorization</span>
        <span>{{
          action.authorization
            .map(a => a.actor + "@" + a.permission)
            .join(", ")
        }}</span>
      </span>
      </q-item>

    </div>
    <!-- <q-carousel
      v-model="activeSlide"
      @input="handleslide($event)"
    >
      <q-carousel-slide v-for="(action, i) in actions" :key="i + 'actionslide'">
        <div
          class="action_data_parser q-py-md"
          v-for="(key, i) in Object.keys(action.data)"
          :key="i + 'actionkey'"
        >
          <div>
            <span>{{ key }}: </span
            ><span>{{ action.data[key] }}</span>
          </div>
        </div>
      </q-carousel-slide>
    </q-carousel> -->

    <!-- controls -->
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
  computed: {},

  data () {
    return {
      activeSlide: 0,
      seenAll: false
    }
  },

  methods: {
    nextAction () {
      if (this.activeSlide < this.actions.length - 1) this.activeSlide++
    },
    prevAction () {
      if (this.activeSlide > 0) this.activeSlide--
    },
    parseActionData (actiondata) {
      let values = Object.values(actiondata)
      return values
    },
    handleslide (e) {
      // console.log('slide',e)
      this.activeSlide = e
      if (this.activeSlide === this.actions.length - 1 && !this.seenAll) {
        this.seenAll = true
        this.$emit('seenAllActions')
      }
    }
  },

  mounted: function () {
    if (this.actions.length === 1) this.$emit('seenAllActions')
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
