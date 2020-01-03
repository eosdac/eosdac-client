<template>
  <q-page class="text-text1">
    <div class="q-pa-md">
      <!-- padding wrapper -->
      <!-- <period-timer style="transform: scale(0.5)" /> -->
      <!-- {{ oldvotes }} -->

      <div class="shadow-4 rounded-borders q-pa-md q-mb-md">
        <display-custodians />
      </div>

      <div class="row q-col-gutter-lg">
        <!-- first column  -->
        <div class="col-xs-12 col-md-9">
          <!-- <pre>{{getSelectedCand}}</pre> -->
            <div class="text-h5">
              {{ $t("vote_custodians.candidate_list") }}- {{ custodians.length }}
            </div>
            <p>
              {{
                $t("vote_custodians.description_main", {
                  dacname: $dir.title
                })
              }}
            </p>

            <div
              v-if="!loading"
              class="row bg-bg1 q-pa-md q-mb-md shadow-4 rounded-borders justify-between animate-fade"
            >
<!--              <q-search-->
<!--                color="primary-light"-->
<!--                v-model="filter"-->
<!--                :placeholder="$t('vote_custodians.search')"-->
<!--              />-->
              <div
                class="row inline items-center q-mt-md"
                style="font-size:12px;"
              >
                <span>{{ $t("vote_custodians.rows_per_page") }}:</span>
                <q-select
                  class="q-ml-md"
                  style="width:45px;"
                  hide-underline
                  v-model="pagination.items_per_page"
                  emit-value
                  :options="[
                    { label: '4', value: 4 },
                    { label: '8', value: 8 },
                    { label: '16', value: 16 },
                    { label: '24', value: 24 },
                    { label: '48', value: 48 }
                  ]"
                />
                <q-pagination
                  color="primary"
                  v-show="true"
                  v-model="pagination.page"
                  :min="1"
                  :max="pagination.max"
                  :max-pages="6"
                  direction-links
                  size="12px"
                />
              </div>
            </div>
            <div
              class="q-pa-md q-mb-md rounded-borders shadow-4 bg-bg1 text-text2"
              v-if="!custodians.length"
            >
              No candidates
            </div>
            <div v-else>
              <Candidate
                v-for="candidate in paginate"
                :key="candidate.candidate_name"
                :ref="candidate.candidate_name"
                :data="candidate"
                @clickvotefor="addToVoteList(candidate.candidate_name)"
                @clickunvotefor="deleteFromVoteList(candidate.candidate_name)"
              />
            </div>

            <div
              v-if="!loading"
              class="row bg-bg1 q-pa-md q-mb-md shadow-4 rounded-borders justify-between animate-fade"
            >
<!--              <q-search-->
<!--                color="primary-light"-->
<!--                v-model="filter"-->
<!--                :placeholder="$t('vote_custodians.search')"-->
<!--              />-->
              <div
                class="row inline items-center q-mt-md "
                style="font-size:12px;"
              >
                <span>{{ $t("vote_custodians.rows_per_page") }}:</span>
                <q-select
                  class="q-ml-md"
                  style="width:45px;"
                  hide-underline
                  v-model="pagination.items_per_page"
                  emit-value
                  :options="[
                    { label: '4', value: 4 },
                    { label: '8', value: 8 },
                    { label: '16', value: 16 },
                    { label: '24', value: 24 },
                    { label: '48', value: 48 }
                  ]"
                />
                <q-pagination
                  color="primary"
                  v-show="true"
                  v-model="pagination.page"
                  :min="1"
                  :max="pagination.max"
                  :max-pages="6"
                  direction-links
                  size="12px"
                />
              </div>
            </div>
        </div>
        <!-- second column -->
        <div class="col-xs-12 col-md-3">
          <div>
            <div class="text-h5">
              {{ $t("vote_custodians.my_votes") }}
              <span>- {{ getSelectedCand.length }}/{{ getMaxVotes }}</span>
            </div>
            <p class="text-text2 q-body-1">
              {{
                $t("vote_custodians.description_side", {
                  maxvotes: getMaxVotes,
                  dacname: $dir.title
                })
              }}
            </p>

            <q-card id="votebox">
                <q-card-section v-if="!votesdidchange">
                    <q-item>
                        <q-item-section avatar>
                            <q-icon name="icon-ui-3"></q-icon>
                        </q-item-section>
                        <q-item-section class="text-h5 text-uppercase">
                            {{ $t("vote_custodians.my_votes") }}
                        </q-item-section>
                    </q-item>
                </q-card-section>
                <q-card-section v-else avatar>

                    <q-btn
                            v-bind:class="{ pulse: votesdidchange }"
                            color="primary"
                            size="xl"
                            icon="icon-ui-3"
                            class="full-width"
                            @click="voteForCandidates()"
                    >
                        {{$t("vote_custodians.submit_my_votes")}}
                    </q-btn>
                </q-card-section>

                <q-card-section>
                    <q-list class="q-mt-md">
                        <q-item
                                v-for="(cand, i) in getSelectedCand"
                                :key="i"
                        >
                            <q-item-section avatar>
                                <q-item-label>
                                    <profile-pic :accountname="cand.candidate_name" :scale="0.6" />
                                </q-item-label>
                            </q-item-section>
                            <q-item-section>
                                <router-link
                                        class="text-h6"
                                        :to="{ path: '/profile/' + cand.candidate_name }"
                                >
                                    {{ cand.candidate_name }}
                                </router-link>
                            </q-item-section>
                            <q-item-section side>
                                <q-btn
                                        dense
                                        round
                                        color="primary"
                                        icon="close"
                                        @click="deleteFromVoteList(cand.candidate_name)"
                                />
                            </q-item-section>
                        </q-item>
                    </q-list>
                </q-card-section>

            </q-card>
          </div>
        </div>
      </div>
      <!-- end row -->

      <q-dialog
        v-model="voting_disabled_modal"
        minimized
        :content-css="{ width: '50%' }"
      >
        <div class="bg-dark rounded-borders q-pa-md">
          <div style="overflow: auto;">
            <q-btn
              round
              color="primary"
              class="float-right"
              @click="voting_disabled_modal = false"
              icon="close"
            />
          </div>

          <div class="q-mb-xl q-mt-md">
            <div class="q-pb-md q-mb-md" style="border-bottom:1px solid grey">
              {{ $t("vote_custodians.voting_disabled_title") }}
            </div>
            <p class="text-text2">
              {{ $t("vote_custodians.voting_disabled_text") }}
            </p>
          </div>
        </div>
      </q-dialog>
    </div>
    <!-- end wrapper -->

<!--    <debug-data-->
<!--      :data="[{ getDacVotes: getDacVotes }, { getCandidates: getCandidates }]"-->
<!--    />-->
  </q-page>
</template>

<script>
import Candidate from 'components/ui/candidate'
import profilePic from 'components/ui/profile-pic'
import displayCustodians from 'components/ui/display-custodians'
// import debugData from 'components/ui/debug-data'

import { Notify } from 'quasar'

import { mapGetters } from 'vuex'

export default {
  name: 'Votecustodians',
  components: {
    Candidate,
    // debugData,
    displayCustodians,
    profilePic
  },
  data () {
    return {
      voting_disabled_modal: false, //! this.$configFile.network.custodianContract.enable_voting,
      loading: false,
      voting_progress: 14,
      custodians: [],
      contractstate: [],
      pagination: {
        page: 1,
        max: 1,
        items_per_page: 24
      },
      filter: '',
      oldvotes: [],
      votesdidchange: false
    }
  },

  computed: {
    ...mapGetters({
      getAccountName: 'user/getAccountName',
      getTokenBalance: 'user/getDacBalance',
      getCandidates: 'dac/getCandidates',
      getDacVotes: 'user/getDacVotes',
      getCustodianConfig: 'dac/getCustodianConfig',
      getCustodianState: 'dac/getCustodianState'
      // getMemberRoles: 'account/getMemberRoles'
    }),

    getSelectedCand () {
      return this.custodians.filter(x => x.selected === true)
    },

    getMaxVotes () {
      if (this.getCustodianConfig.maxvotes) {
        return this.getCustodianConfig.maxvotes
      }
      return 0
    },

    paginate () {
      let filtered

      if (this.filter !== '') {
        filtered = this.custodians.filter(cand => {
          return cand.candidate_name.indexOf(this.filter) !== -1
        })
      } else {
        filtered = this.custodians
      }

      filtered = filtered.slice(
        (this.pagination.page - 1) * this.pagination.items_per_page,
        this.pagination.page * this.pagination.items_per_page
      )

      return filtered
    }
  },

  async mounted () {
    this.getAllCandidates()
  },

  methods: {
    async recalcPagination () {
      console.log(`recalc : ${this.custodians.length} / ${this.pagination.items_per_page}`)
      this.pagination.max = Math.ceil(this.custodians.length / this.pagination.items_per_page)
    },
    async getAllCandidates () {
      if (this.getCandidates) {
        this.custodians = this.getCandidates
      } else {
        this.loading = true
        this.custodians = await this.$store.dispatch(
          'dac/fetchActiveCandidates'
        )
        this.loading = false
      }
      this.recalcPagination(this.custodians)

      await this.getMemberVotes()
    },

    addToVoteList (name, init = false) {
      let selected = this.custodians.filter(x => x.selected === true)
      if (selected.length < this.getMaxVotes) {
        let cand = this.custodians.find(x => x.candidate_name === name)
        if (cand) {
          cand.selected = true
          if (!init) {
            cand.total_votes =
              cand.total_votes * 1 + this.getTokenBalance * 10000
          }
        }
        this.checkVotesChanged()
      } else {
        if (!init) {
          console.log('reached max number of votes.')
          Notify.create({
            message: `Reached maximum number of votes`,
            timeout: 2000,
            type: 'negative',
            position: 'bottom-right'
          })
        }
      }
    },

    deleteFromVoteList (name) {
      let cand = this.custodians.find(x => x.candidate_name === name)
      cand.selected = false
      cand.total_votes = cand.total_votes * 1 - this.getTokenBalance * 10000
      this.checkVotesChanged()
    },

    // cast votes
    async voteForCandidates () {
      if (!this.votesdidchange) {
        return false
      }

      let votes = this.custodians
        .filter(x => x.selected === true)
        .map(c => c.candidate_name)

      let actions = [
        {
          account: this.$dir.getAccount(this.$dir.ACCOUNT_CUSTODIAN),
          name: 'votecuste',
          data: {
            voter: this.getAccountName,
            newvotes: votes,
            dac_id: this.$dir.dacId
          }
        }
      ]

      let result = await this.$store.dispatch('user/transact', {
        actions: actions
      })
      if (result) {
        this.votesdidchange = false
        this.sortCandidatesByVotes()
        this.oldvotes = votes
        this.$store.dispatch('user/fetchDacVotes')
        // only refresh cust state when dac is locked
        if (this.getCustodianState.met_initial_votes_threshold === 0) {
          this.$store.dispatch('dac/fetchCustodianContractState')
        }
      }
    },

    sortCandidatesByVotes () {
      this.custodians = this.custodians.sort(function (a, b) {
        let t = b.total_votes - a.total_votes
        return t
      })
    },

    checkVotesChanged () {
      let newvotes = this.custodians.filter(x => x.selected === true)

      if (newvotes.length !== this.oldvotes.length) {
        this.votesdidchange = true
      } else if (
        newvotes.every(v => this.oldvotes.includes(v.candidate_name))
      ) {
        this.votesdidchange = false
      } else {
        this.votesdidchange = true
      }
    },

    // get current votes from member from chain
    async getMemberVotes () {
      if (!this.getAccountName) {
        console.log('Guest mode, unable to retrieve votes')
        return false
      }

      let votes = await this.$store.dispatch('user/fetchDacVotes')
      // let votes = [{candidates: ['piecesnbitss', 'evilmikehere']}];

      if (votes) {
        this.votesdidchange = false
        this.oldvotes = votes
        this.oldvotes.forEach(vote => {
          this.addToVoteList(vote, true)
        })
      } else {
        this.oldvotes = []
        this.votesdidchange = false
        console.log(`${this.getAccountName} has not voted.`)
      }
    }
  },
  watch: {
    getAccountName (val) {
      this.votesdidchange = false
      this.getSelectedCand.forEach(sc => {
        sc.selected = false
      })
      this.getMemberVotes()
    },
    'pagination.items_per_page' () {
      console.log('change')
      this.recalcPagination()
    }
  }
}
</script>

<style lang="stylus">
/*@import '~quasar-variables'*/

.list-item {
  display: inline-block;
  margin-right: 10px;
}

.list-enter-active, .list-leave-active {
  transition: all 0.5s ease;
}

.list-enter, .list-leave-to{
  opacity: 0;
  transform: translateY(35px);
}

.pulse{
  background-color:$p-light !important;
  transition: background-color 1000ms linear;
  -webkit-animation: pulse 1.2s infinite;
  -moz-animation: pulse 1s infinite;
  -ms-animation: pulse 1s infinite;
  animation: pulse 1.5s infinite;
}

@keyframes pulse {
    0% {
        transform: scale(0.95);
        box-shadow: 0 0 0 0 $secondary;
    }

    60% {
        transform: scale(1);
        box-shadow: 0 0 0 10px rgba(0, 0, 0, 0);
    }

    90% {
        transform: scale(0.95);
        box-shadow: 0 0 0 0 rgba(0, 0, 0, 0);
    }

    100% {
        transform: scale(0.95);
        box-shadow: 0 0 0 0 rgba(0, 0, 0, 0);
    }
}

#votebox{
  position:relative;
  transition: all 1s ease 0s;
  top: 0;
}
</style>
