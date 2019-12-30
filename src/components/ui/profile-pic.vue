<template>
  <q-avatar v-if="loaded" :size="size">
    <img :src="profilePic" />

    <div v-if="show_role">

      <q-badge v-if="show_role" floating transparent color="transparent">
        <q-icon v-if="is_custodian"
                color="warning"
                :name="$configFile.icon.cust_symbol" />
      </q-badge>
    </div>
  </q-avatar>
  <div v-else class="row justify-center items-center">
    <q-spinner-pie size="30px" color="primary" />
  </div>
</template>

<script>
import { mapGetters } from 'vuex'

export default {
  name: 'profilePic',
  props: {
    accountname: String,
    scale: Number,
    size: String,
    show_role: {
      type: Boolean,
      default: true
    },
    border: {
      type: Boolean,
      default: true
    }
  },

  data () {
    return {
      profilePic: '',
      loaded: false
    }
  },

  computed: {
    ...mapGetters({
      getCustodians: 'dac/getCustodians'
    }),

    is_custodian () {
      if (this.getCustodians) {
        return this.getCustodians.find(c => c.cust_name === this.accountname)
      } else {
        return false
      }
    }
  },
  methods: {
    async setProfilePic () {
      this.loaded = false
      this.profilePic = this.$profiles.default_avatar
      let p = await this.$profiles.getAvatars([this.accountname])
      this.profilePic = p[0].image

      let preloaderImg = document.createElement('img')
      preloaderImg.src = this.profilePic
      preloaderImg.addEventListener('load', event => {
        this.loaded = true
        preloaderImg = null
      })
      setTimeout(() => {
        if (this.loaded === false) {
          this.profilePic = this.$profiles.default_avatar
          this.loaded = true
          preloaderImg = null
        }
      }, 6000)
    }
  },
  mounted () {
    this.setProfilePic()
  },
  watch: {
    accountname: function () {
      this.setProfilePic()
    }
  }
}
</script>
