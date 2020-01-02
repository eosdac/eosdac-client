<template>
  <div class="row justify-start items-center">
    <div
      v-for="(a, i) in getAllAuth"
      :key="`auth${i}`"
      class="rounded-borders q-body-1 q-pa-sm q-ma-xs bg-bg1 row items-center animate-pop"
    >
      <q-icon name="mdi-shield-account" class=" text-text2" size="16px" />
      <div class="q-caption q-mx-sm">{{ `${a.actor}@${a.permission}` }}</div>
      <q-btn
        v-if="i >= auth.length"
        icon="close"
        size="xs"
        color="negative"
        flat
        dense
        @click="deleteAuth(i)"
      />
    </div>

    <div class="row">
      <q-btn icon="add" flat dense round @click="addAuth(new_auth)" />
      <q-input
        color="primary"
        placeholder="actor@permission"
        v-model="new_auth"
        @keyup.enter.native="addAuth(new_auth)"
      />
    </div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
export default {
  // name: 'ComponentName',
  props: {
    auth: {
      type: Array,
      default: () => []
    },
    defaultAuth: {
      type: Object,
      default: () => {
        return {}
      }
    }
  },
  data () {
    return {
      auths: [],
      new_auth: ''
    }
  },
  computed: {
    ...mapGetters({
      getAccount: 'user/getAccount'
    }),
    getAllAuth () {
      let newauth = []
      if (this.new_auth) {
        console.log(this.parseAuth(this.new_auth))
        const newA = this.parseAuth(this.new_auth)
        if (newA) {
          newauth.push(newA)
        }
      }
      let all = [...this.auth, ...this.auths, ...newauth]
      this.$emit('input', JSON.stringify(all))
      return all
    }
  },
  methods: {
    parseAuth (authstring) {
      let actor, permission
      if (authstring.indexOf('@') > -1) {
        [actor, permission] = authstring.split('@')
      } else {
        actor = authstring
        permission = 'active'
      }

      if (!actor) {
        return null
      }

      return { actor, permission }
    },
    addAuth (authstring) {
      if (authstring === '') {
        return
      }
      const auth = this.parseAuth(authstring)

      if (!auth) {
        this.new_auth = ''
        return
      }

      this.auths.push(auth)
      this.new_auth = ''
    },
    deleteAuth (index) {
      index = index - this.auth.length
      console.log(index)
      this.auths.splice(index, 1)
    }
  }
}
</script>
