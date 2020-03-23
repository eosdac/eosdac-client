<template>
  <q-item class="memberselector no-padding">
    <q-item-section>
      <q-select
              color="primary"
              :options="accountnames"
              :label="label"
              v-model="selected"
      >
        <template v-slot:before>
          <q-avatar>
            <profile-pic :accountname="selected"
                        :border="false"
                        :show_role="false"
                        :scale="0.5" />
          </q-avatar>
        </template>
      </q-select>
    </q-item-section>
  </q-item>
</template>

<script>
import { mapGetters } from 'vuex'
import profilePic from 'components/ui/profile-pic'
export default {
  name: 'memberSelect',
  components: {
    profilePic
  },
  props: {
    value: String,
    accountnames: {
      type: Array,
      default: () => {
        return []
      }
    },
    placeholder: {
      type: String,
      default: ''
    },
    itsme: {
      type: String,
      default: ''
    },
    show_selected: {
      type: Boolean,
      default: true
    },
    underline: {
      type: Boolean,
      default: true
    },
    label: {
      type: String,
      default: ''
    }
  },
  data () {
    return {
      selected: this.value,
      profiles: []
    }
  },
  computed: {
    ...mapGetters({
      getAccountName: 'user/getAccountName'
    }),
    checkItsMe () {
      if (this.itsme) {
        return this.getAccountName === this.selected
      } else {
        return false
      }
    },
    getOptions () {
      if (this.profiles.length && this.accountnames.length) {
        const data = this.accountnames.map(ac => {
          let sublabel = this.itsme && this.getAccountName === ac ? this.itsme : ''
          const data = {
            label: ac,
            sublabel,
            value: ac,
            image: this.$profiles.default_avatar
          }
          const pd = this.profiles.find(p => p && p.account === ac)
          if (pd && pd.profile.image) {
            data.image = pd.profile.image
          }

          return data
        })
        return data
      }
      return []
    }
  },
  methods: {
    async getAvatars () {
      if (this.accountnames.length) {
        this.profiles = await this.$profiles.getProfiles(this.accountnames)
      }
    },
    updateSelected (v) {
      let old = this.selected
      this.selected = v
      this.$emit('change', { new: this.selected, old: old })
      this.$emit('input', this.selected)
    }
  },
  async mounted () {
    await this.getAvatars()
  },
  watch: {
    accountnames: function () {
      this.getAvatars()
    },
    value: function (v) {
      this.selected = v
    }
  }
}
</script>

<style lang="stylus">
 /*@import '~variables'*/
.q-item-image{
  min-height: 40px;
  height: 40px;
  min-width: 40px;
  width: 40px;
  border-radius: 50%;
  object-fit: cover;
}
.itsmeclass {
  filter: grayscale(90%);
}
</style>
