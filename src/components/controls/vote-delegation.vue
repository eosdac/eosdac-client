<template>
  <div v-if="getAccountName && wpcats.length">
    <div class="relative-position">
      <div class="row q-col-gutter-xs">
        <div
          class="col-xs-12 col-md-6 col-xl-4"
          v-for="(cat, i) in wpcats"
          :key="`wpcat${i}`"
        >
          <q-item>
            <q-item-section>
              <q-card class="q-pa-sm">
                <q-icon
                        v-if="
                  getAccountName &&
                    cat.delegatee &&
                    getAccountName !== cat.delegatee
                "
                        :name="$configFile.icon.check"
                        size="24px"
                        color="positive"
                        class="q-pa-sm absolute-top-right"
                />
                <q-item-label>{{ $t(cat.label) }}</q-item-label>
                <q-item-label caption>
                  {{ $t(cat.desc) }}
                </q-item-label>
                <member-select
                        @change="handleCatDelegation(cat.value, $event)"
                        v-model="cat.delegatee"
                        :accountnames="getCustNames"
                />
              </q-card>

            </q-item-section>
          </q-item>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import memberSelect from 'components/controls/member-select'
import wpcats from '../../extensions/statics/config/wp_categories.json'
import { mapGetters } from 'vuex'
export default {
  // name: 'ComponentName',
  components: {
    memberSelect
  },
  data () {
    return {
      wpcats: []
    }
  },
  computed: {
    ...mapGetters({
      getCustodians: 'dac/getCustodians',
      getAccountName: 'user/getAccountName',
      getAuth: 'user/getAuth',
      getCatDelegations: 'user/getCatDelegations'
    }),
    getCustNames () {
      if (this.getCustodians) {
        return this.getCustodians.map(c => {
          return c.cust_name
        })
      } else {
        return []
      }
    }
  },
  methods: {
    async setWpCats (forceReload = false) {
      let mycatvotes
      if (!this.getCatDelegations || forceReload) {
        mycatvotes = await this.$store.dispatch(
          'user/fetchCatDelegations',
          this.getAccountName
        )
        console.log('my catvotes', mycatvotes)
      } else {
        mycatvotes = this.getCatDelegations
        console.log('my stored catvotes', mycatvotes)
      }

      this.wpcats = JSON.parse(JSON.stringify(wpcats)).map(wpc => {
        let checkdelegation = mycatvotes.find(
          cv => cv.category_id === wpc.value
        )
        if (checkdelegation) {
          wpc.delegatee = checkdelegation.delegatee
        } else {
          wpc.delegatee = this.getAccountName
        }

        return wpc
      })
    },
    async handleCatDelegation (catId, delegatee) {
      let actions = []
      const authAccount = this.$dir.getAccount(this.$dir.ACCOUNT_AUTH)

      let delegate = {
        account: this.$dir.getAccount(this.$dir.ACCOUNT_PROPOSALS),
        name: 'delegatecat',
        authorization: [
          { actor: this.getAccountName, permission: this.getAuth },
          {
            actor: authAccount,
            permission: 'one'
          }
        ],
        data: {
          custodian: this.getAccountName,
          category: catId,
          delegatee_custodian: delegatee.new,
          dac_id: this.$dir.dacId
        }
      }
      let undelegate = {
        account: this.$dir.getAccount(this.$dir.ACCOUNT_PROPOSALS),
        name: 'undelegateca',
        authorization: [
          { actor: this.getAccountName, permission: this.getAuth },
          {
            actor: authAccount,
            permission: 'one'
          }
        ],
        data: {
          custodian: this.getAccountName,
          category: catId,
          dac_id: this.$dir.dacId
        }
      }

      if (this.getAccountName === delegatee.new) {
        actions.push(undelegate)
      } else {
        actions.push(delegate)
      }

      let result = await this.$store.dispatch('user/transact', {
        actions: actions
      })
      if (result) {
      } else {
        this.wpcats.find(w => w.value === catId).delegatee = delegatee.old
      }
    }
  },

  mounted () {
    if (this.getAccountName) {
      this.setWpCats(true)
    }
  },
  watch: {
    getAccountName: function () {
      this.setWpCats(true)
    }
  }
}
</script>
