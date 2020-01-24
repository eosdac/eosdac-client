<template>
  <div class="wp-container" v-if="wp">
    <q-expansion-item
            icon-toggle
            group="msigproposals"
            header-class="wpproposal_header"
            :default-opened="expanded"
            :collapse-icon="$configFile.icon.collapse"
    >
      <template v-slot:header>
        <q-item-section avatar>
          <profile-pic :accountname="wp.proposer" />
        </q-item-section>

        <q-item-section>
          <q-item-label>
            {{ wp.title }}
          </q-item-label>
          <q-item-label caption><i>{{ $t(`${getCategoryNameFromId(wp.category)}`) }}</i></q-item-label>
          <q-item-label caption>
            <MarkdownViewer
                    :tags="[]"
                    :text="wp.summary.replace(/\n/g, '').replace(/#/g, '')"
                    :maxlen="140"
            />
          </q-item-label>
        </q-item-section>

        <q-item-section>{{ wp.pay_amount.quantity }}</q-item-section>
        <q-item-section>
          <q-item-label>
            <q-badge v-if="wp.status == wpEnums.PENDING_APPROVAL" color="warning" class="q-pa-xs">
              {{$t('workerproposals.pending_approval')}}
            </q-badge>
            <q-badge v-else-if="wp.status == wpEnums.WORK_IN_PROGRESS" color="positive" class="q-pa-xs">
              {{$t('workerproposals.work_in_progress')}}
            </q-badge>
            <q-badge v-else-if="wp.status == wpEnums.PENDING_VALIDATE" color="warning" class="q-pa-xs">
              {{$t('workerproposals.pending_validate')}}
            </q-badge>
            <q-badge v-else-if="wp.status == wpEnums.APPROVED" color="positive" class="q-pa-xs">
              {{$t('workerproposals.approved')}}
            </q-badge>
            <q-badge v-else-if="wp.status == wpEnums.VALIDATED" color="positive" class="q-pa-xs">
              {{$t('workerproposals.validated')}}
            </q-badge>
            <q-badge v-else-if="wp.status == wpEnums.COMPLETED" color="positive" class="q-pa-xs">
              {{$t('workerproposals.completed')}}
            </q-badge>
            <q-badge v-else-if="wp.status == wpEnums.EXPIRED" color="negative" class="q-pa-xs">
              {{$t('workerproposals.expired')}}
            </q-badge>
            <q-badge v-else-if="wp.status == wpEnums.CANCELLED" color="negative" class="q-pa-xs">
              {{$t('workerproposals.cancelled')}}
            </q-badge>
            <q-badge v-else>{{wp.status}}</q-badge>
          </q-item-label>

          <div v-if="[wpEnums.PENDING_APPROVAL, wpEnums.PENDING_VALIDATE].includes(wp.status)" class="q-pt-xs">
            <q-linear-progress :value="getVotingScore.yes / getVotingScore.threshold" v-if="getVotingScore.yes > 0" style="height:15px" color="positive" />
            <q-item-label caption @click.stop="expand_votes_modal = true">
              <q-chip>
                <q-avatar icon="mdi-thumb-up" color="positive"></q-avatar>
                {{ getVotingScore.yes }}
              </q-chip>
              <q-chip>
                <q-avatar icon="mdi-thumb-down" color="negative"></q-avatar>
                {{ getVotingScore.no }}
              </q-chip> / {{ getVotingScore.threshold }}
            </q-item-label>
          </div>
        </q-item-section>
      </template>

      <div class="row q-pa-md q-col-gutter-md">

        <div class="col-md-8">
          <q-card class="full-height">
            <q-card-section class="full-height">
              <div class="column full-height justify-between">
                <div class="col"><MarkdownViewer :text="wp.summary" class="inline-doc" /></div>
                <!-- comments -->
                <div class="col-auto justify-end" v-if="wp.comments.length && !fullscreen">
                  <div class="float-right">
                    <q-btn @click="showCommentModal = true" icon="mdi-plus-box-outline" color="positive" />
                  </div>
                  <div class="text-h6">{{$t('workerproposal.latest_comment')}}</div>
                  <div class="q-px-lg">

                    <q-chat-message
                            :key="c" :name="wp.comments[0].commenter"
                            :text="wp.comments[0].comment.split('\n')" />

                    <router-link :to="`/wps/${wp.id}`">{{$t('workerproposal.view_all_comments')}}</router-link>
                  </div>
                </div>
                <div v-else>
                  <q-btn @click="showCommentModal = true" icon="mdi-plus-box-outline" :label="$t('workerproposal.add_comment')" color="positive" />

                  <q-scroll-area style="height:200px" v-if="wp.comments.length">
                    <div class="q-px-lg">
                      <q-chat-message
                              v-for="(comment, c) in wp.comments"
                              :key="c" :name="comment.commenter"
                              :text="comment.comment.split('\n')"
                              :sent="getAccountName === comment.commenter" />
                    </div>

                  </q-scroll-area>
                </div>
                <!-- end comments -->
              </div>
            </q-card-section>
          </q-card>

        </div>

        <q-dialog v-model="showCommentModal" full-width>
          <q-card>
            <q-card-section class="bg-primary">{{$t('workerproposal.add_comment')}}</q-card-section>
            <q-card-section>
              <q-input type="textarea" v-model="currentComment[wp.id]" />
            </q-card-section>
            <q-card-section>
              <q-card-actions align="right">
                <q-btn @click="commentProposal" :label="$t('workerproposal.submit_comment')" color="positive" />
              </q-card-actions>
            </q-card-section>
          </q-card>
        </q-dialog>

        <div class="col-md-4">
          <q-card>
            <q-card-section>
              <q-item>
                <q-item-section>
                  <q-item-label>{{$t('workerproposal.proposer')}}</q-item-label>
                  <q-item-label caption>{{ wp.proposer }}</q-item-label>
                </q-item-section>
              </q-item>
            </q-card-section>

            <q-card-section>
              <q-item>
                <q-item-section>
                  <q-item-label>{{$t('workerproposal.requested_pay')}}</q-item-label>
                  <q-item-label caption>{{ wp.pay_amount.quantity }}</q-item-label>
                </q-item-section>
              </q-item>
            </q-card-section>

            <q-card-section>
              <q-item>
                <q-item-section>
                  <q-item-label label>{{$t('workerproposal.validator')}}</q-item-label>
                  <q-item-label caption>{{ wp.arbitrator }}</q-item-label>
                </q-item-section>
              </q-item>
            </q-card-section>

            <q-card-section v-if="wp.status == wpEnums.PENDING_APPROVAL">
              <q-item>
                <q-item-section>
                  <q-item-label>{{$t('workerproposal.time_left')}}</q-item-label>
                  <q-item-label caption>
                    <countdown
                            v-if="getExpiry.millisleft"
                            :time="Number(getExpiry.millisleft)"
                    >
                      <template slot-scope="props">
                        <div class="text-weight-light q-mb-xs">
                          <span v-if="props.days">{{ props.days }} {{$t('workerproposal.days')}}, </span>
                          <span v-if="props.hours">{{ props.hours }} {{$t('workerproposal.hours')}}, </span>
                          <span v-if="props.minutes">{{ props.minutes }} {{$t('workerproposal.minutes')}}, </span>
                          <span>{{ props.seconds }} {{$t('workerproposal.seconds')}}</span>
                        </div>
                      </template>
                    </countdown>
                    <div v-else class="q-caption text-weight-light q-mb-xs text-negative">
                      {{$t('workerproposal.expired')}}
                    </div>
                    <q-linear-progress
                            :value="getExpiry.percent"
                            color="secondary"
                            style="height: 4px"
                    />
                  </q-item-label>
                </q-item-section>
              </q-item>
            </q-card-section>

            <q-card-section>
              <q-item>
                <q-item-section>
                  <q-item-label>{{$t('workerproposal.status')}}</q-item-label>
                  <q-item-label caption>{{ wp.status }}</q-item-label>
                </q-item-section>
              </q-item>
            </q-card-section>

            <q-card-section>
              <q-item>
                <q-item-section>
                  <q-item-label>{{$t('workerproposal.propose_transaction')}}</q-item-label>
                  <q-item-label caption><a
                          target="_blank"
                          :href="$configFile.get('explorer_transaction').replace('{transaction_id}', wp.trx_id)"
                  >{{ $helper.truncate(wp.trx_id, 20) }}</a></q-item-label>
                </q-item-section>
              </q-item>
            </q-card-section>

            <q-card-section>
              <q-item>
                <q-item-section>
                  <q-item-label>{{$t('workerproposal.id')}}</q-item-label>
                  <q-item-label caption><router-link :to="`/wps/${wp.id}`">{{ wp.id }}</router-link></q-item-label>
                </q-item-section>
              </q-item>
            </q-card-section>

            <q-separator spaced />

            <q-card-section>

                <div v-if="!read_only && getAccountName">
                    <member-select
                            v-if="wp.status == wpEnums.PENDING_APPROVAL || wp.status == wpEnums.PENDING_VALIDATE"
                            :show_selected="false"
                            @change="delegatevote($event)"
                            :value="MyDirectDelegation || ''"
                            :accountnames="getCustNames"
                            placeholder="Select to Delegate"
                            :underline="false"
                            :label="$t('workerproposal.delegation')"
                            ref="directDelSelect"
                    />
                </div>
            </q-card-section>
            <q-card-section>
              <q-card-actions align="right" v-if="!read_only">
                  <div v-if="wp.status == wpEnums.PENDING_APPROVAL" class="col-12 q-pt-md">
                      <q-btn
                              v-if="getVoterStatus == 2 || getVoterStatus == 0"
                              class="on-right animate-pop"
                              color="positive"
                              :label="$t('workerproposal.approve')"
                              @click="voteprop('voteApprove')"
                      />
                      <q-btn
                              v-if="getVoterStatus == 1 || getVoterStatus == 0"
                              class="on-right animate-pop"
                              color="negative"
                              :label="$t('workerproposal.deny')"
                              @click="voteprop('voteDeny')"
                      />
                  </div>
                  <div v-else-if="wp.status == wpEnums.PENDING_VALIDATE">
                      <q-btn
                              v-if="getVoterStatus == 4 || getVoterStatus == 0"
                              class="on-right animate-pop"
                              color="positive"
                              :label="$t('workerproposal.approve_claim')"
                              @click="voteprop('claimApprove')"
                      />
                      <q-btn
                              v-if="getVoterStatus == 3 || getVoterStatus == 0"
                              class="on-right animate-pop"
                              color="negative"
                              :label="$t('workerproposal.deny_claim')"
                              @click="voteprop('claimDeny')"
                      />
                      <q-btn
                              v-if="getIsArbitrator"
                              class="on-right animate-pop"
                              flat
                              color="positive"
                              :label="$t('workerproposal.arb_approve')"
                              @click="arbApprove()"
                      />
                  </div>

                  <div v-if="getIsCreator">
                      <q-btn
                              v-if="wp.status == wpEnums.APPROVED"
                              class="on-right animate-pop"
                              color="info"
                              :label="$t('workerproposal.start_work')"
                              @click="startWork()"
                      />
                      <q-btn
                              v-if="wp.status == wpEnums.WORK_IN_PROGRESS"
                              class="on-right animate-pop"
                              color="info"
                              :label="$t('workerproposal.complete_work')"
                              @click="completeWork()"
                      />
                      <q-btn
                              v-if="wp.status == wpEnums.VALIDATED"
                              class="on-right animate-pop"
                              color="info"
                              :label="$t('workerproposal.claim')"
                              @click="finalize()"
                      />
                      <q-btn
                              v-if="wp.status != wpEnums.COMPLETED && wp.status != wpEnums.CANCELLED"
                              class="on-right animate-pop"
                              flat
                              color="negative"
                              :label="$t('workerproposal.cancel')"
                              @click="cancelProp()"
                      />
                  </div>
              </q-card-actions>
            </q-card-section>

          </q-card>
        </div>
      </div>
    </q-expansion-item>
    <q-separator  />

    <q-dialog v-model="expand_votes_modal">
      <q-card>
        <q-card-section>
          <div class="row items-center no-wrap">
            <div class="col">
              <div class="text-h6">{{$t('workerproposal.votes')}}</div>
            </div>
          </div>
        </q-card-section>
        <q-card-section>
          <div class="q-pa-md" v-if="wp.status !== 5 && wp.status !== 100">
            <div class="row justify-start q-mt-sm">
              <div
                      class="row items-center relative-position rounded-borders q-pr-md q-ma-sm"
                      v-for="(vote, i) in getVotes.filter(
                v => v.vote === 1 || v.vote === 3
              )"
                      :key="i + 'p'"
              >
                <profile-pic
                        :accountname="vote.voter"
                        :scale="0.5"
                        :show_role="false"
                />
                <router-link class="a2" :to="{ path: '/profile/' + vote.voter }">
                  <div class="q-ma-none" style="min-width:100px; overflow:hidden">
                    {{ vote.voter }}
                  </div>
                </router-link>
                <q-chip
                        v-if="vote.weight > 1"
                        :title="`voteweight ${vote.weight}`"
                >{{ vote.weight }}</q-chip
                >
                <q-icon
                        class="absolute"
                        style="top:-5px; right:-10px"
                        color="positive"
                        :name="$configFile.icon.check"
                        size="24px"
                />
              </div>

              <div
                      class="row items-center relative-position rounded-borders q-pr-md q-ma-sm"
                      v-for="(vote, i) in getVotes.filter(
                v => v.vote === 2 || v.vote === 4
              )"
                      :key="i + 'r'"
              >
                <profile-pic
                        :accountname="vote.voter"
                        :scale="0.5"
                        :show_role="false"
                />
                <router-link class=" a2" :to="{ path: '/profile/' + vote.voter }">
                  <div class="q-ma-none" style="min-width:100px; overflow:hidden">
                    {{ vote.voter }}
                  </div>
                </router-link>
                <q-chip
                        v-if="vote.weight > 1"
                        :title="`voteweight ${vote.weight}`"
                >{{ vote.weight }}</q-chip
                >
                <q-icon
                        class="absolute"
                        style="top:-5px; right:-10px"
                        color="negative"
                        name="clear"
                        size="24px"
                />
              </div>
            </div>
          </div>
        </q-card-section>
      </q-card>
    </q-dialog>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
// import profilePic from 'components/ui/profile-pic'
import MarkdownViewer from 'components/ui/markdown-viewer'
import memberSelect from 'components/controls/member-select'
import wpcats from '../../extensions/statics/config/wp_categories.json'
import ProfilePic from './profile-pic'
import countdown from '@chenfengyuan/vue-countdown'
import wpEnums from '../../modules/wp-enums'

export default {
  name: 'wpProposal',
  components: {
    ProfilePic,
    // profilePic,
    memberSelect,
    MarkdownViewer,
    countdown
  },
  props: {
    array_index: null,
    read_only: Boolean,
    wp: {
      type: Object,
      default: () => {
        return {}
      }
    },
    expanded: {
      type: Boolean,
      default: false
    },
    fullscreen: {
      type: Boolean,
      default: false
    }
  },
  data () {
    return {
      wp_expiration: 100,
      expand_votes_modal: false,
      currentComment: {},
      wpEnums,
      showCommentModal: false
    }
  },
  computed: {
    ...mapGetters({
      getAccountName: 'user/getAccountName',
      getWpConfig: 'dac/getWpConfig',
      getAuth: 'user/getAuth',
      getCustodians: 'dac/getCustodians'
    }),

    getVotes () {
      if (this.wp.votes && this.wp.votes.length) {
        if (
          this.wp.status === this.wpEnums.PENDING_APPROVAL ||
          this.wp.status === this.wpEnums.WORK_IN_PROGRESS ||
          this.wp.status === this.wpEnums.APPROVED
        ) {
          return this.wp.votes.filter(
            v => v.vote === 1 || v.vote === 2 || v.vote === null
          )
        }
        if (
          this.wp.status === this.wpEnums.PENDING_VALIDATE ||
          this.wp.status === this.wpEnums.VALIDATED ||
          this.wp.status === this.wpEnums.COMPLETED
        ) {
          return this.wp.votes.filter(
            v => v.vote === 3 || v.vote === 4 || v.vote === null
          )
        }
      }
      return []
    },

    MyDirectDelegation () {
      if (!this.getVotes.length) return false

      let myvote = this.getVotes.find(
        v => v.voter === this.getAccountName && v.vote === null
      )
      if (myvote) {
        return myvote.delegatee
      }

      let myDirectDelegatee = false
      for (let i = 0; i < this.getVotes.length; i++) {
        let vote = this.getVotes[i]
        if (vote.delegates && vote.delegates.length) {
          let check = vote.delegates.find(
            d => d.voter === this.getAccountName && d.delegate_type === 'direct'
          )
          if (check) {
            myDirectDelegatee = vote.voter
            break
          }
        }
      }
      return myDirectDelegatee
    },

    getIsCreator () {
      return this.getAccountName === this.wp.proposer
    },
    getIsArbitrator () {
      return this.getAccountName === this.wp.arbitrator
    },
    // get vote type of logged in user
    getVoterStatus () {
      let myvote = this.getVotes.find(v => v.voter === this.getAccountName)
      if (!myvote) {
        return 0
      } else {
        if (myvote.vote === null) {
          return 0
        } else {
          return myvote.vote
        }
      }
    },

    getExpiry () {
      const now = new Date().getTime()
      const expiry = Date.parse(this.wp.expiry)
      let msleft = expiry - now

      if (this.wp.status === this.wpEnums.EXPIRED) {
        msleft = 0
      }

      return {
        millisleft: msleft <= 0 ? 0 : msleft
      }
    },
    getVotingScore () {
      let score = { yes: 0, no: 0, threshold: null }
      if (
        this.wp.status === this.wpEnums.PENDING_APPROVAL ||
              this.wp.status === this.wpEnums.WORK_IN_PROGRESS ||
              this.wp.status === this.wpEnums.APPROVED
      ) {
        score.threshold = this.getWpConfig.proposal_threshold
        this.getVotes.forEach(v => {
          if (v.vote === 1) score.yes += v.weight
          if (v.vote === 2) score.no += v.weight
        })
      }
      if (
        this.wp.status === this.wpEnums.PENDING_VALIDATE ||
              this.wp.status === this.wpEnums.VALIDATED ||
              this.wp.status === this.wpEnums.COMPLETED
      ) {
        score.threshold = this.getWpConfig.finalize_threshold
        this.getVotes.forEach(v => {
          if (v.vote === 3) score.yes += v.weight
          if (v.vote === 4) score.no += v.weight
        })
      }
      return score
    },
    getCustNames () {
      if (this.getCustodians) {
        return this.getCustodians
          .map(c => {
            return c.cust_name
          })
          .filter(c => c !== this.getAccountName)
      } else {
        return []
      }
    }
  },

  methods: {
    getCategoryNameFromId (id) {
      console.log(`worker categories`, wpcats)
      const wpc = wpcats.find(wpc => parseInt(wpc.value) === parseInt(id))
      if (!wpc) {
        return id
      }
      return wpc.label
    },
    async delegatevote (delegatee) {
      console.log(delegatee)
      const authAccount = this.$dir.getAccount(this.$dir.ACCOUNT_AUTH)
      const actions = [
        {
          account: this.$dir.getAccount(this.$dir.ACCOUNT_PROPOSALS),
          name: 'delegatevote',
          // todo get permission from account instead hardcoding it
          authorization: [
            { actor: this.getAccountName, permission: this.getAuth },
            {
              actor: authAccount,
              permission: 'one'
            }
          ],
          data: {
            custodian: this.getAccountName,
            proposal_id: this.wp.id,
            delegatee_custodian: delegatee.new,
            dac_id: this.$dir.dacId
          }
        }
      ]
      const result = await this.$store.dispatch('user/transact', {
        actions: actions
      })
      if (result) {
        this.actionCallBack(this.wp.id)
        // check if delegatee has voted
        // let vote = this.wp.votes.find(v => v.voter == delegatee.new);
        // if (!vote) return;

        // let deltemplate = {
        //   voter: this.getAccountName,
        //   delegate_type: "direct"
        // };
        // vote.delegates.push(deltemplate);
        // // if (!vote.delegates.find(vd => vd.voter == this.getAccountName)) {
        // //   vote.delegates.push(deltemplate);
        // // }
        // console.log(result);
      } else {
        this.$refs.directDelSelect.selected = delegatee.old
      }
    },
    async actionCallBack (id) {
      /* await new Promise(resolve => setTimeout(resolve, 2000))
      const res = await this.$store.dispatch('dac/fetchWorkerProposals', {
        id: id
      })
      if (res) {
        this.wp.votes = res.results[0].votes
      }
      console.log(res) */
    },

    async commentProposal () {
      // comment(name commenter, name proposal_id, string comment, string comment_category, name dac_id)
      const actions = [
        {
          account: this.$dir.getAccount(this.$dir.ACCOUNT_PROPOSALS),
          name: 'comment',
          authorization: [
            { actor: this.getAccountName, permission: this.getAuth }
          ],
          data: {
            commenter: this.getAccountName,
            proposal_id: this.wp.id,
            comment: this.currentComment[this.wp.id],
            comment_category: '',
            dac_id: this.$dir.dacId
          }
        }
      ]

      const result = await this.$store.dispatch('user/transact', {
        actions: actions
      })
      if (result) {
        this.$emit('comment')
        this.showCommentModal = false
        console.log(result)
      }
    },

    async voteprop (votetype) {
      const authAccount = this.$dir.getAccount(this.$dir.ACCOUNT_AUTH)
      const map = {
        voteApprove: 1,
        voteDeny: 2,
        claimApprove: 3,
        claimDeny: 4
      }

      const actions = [
        {
          account: this.$dir.getAccount(this.$dir.ACCOUNT_PROPOSALS),
          name: 'voteprop',
          authorization: [
            { actor: this.getAccountName, permission: this.getAuth },
            {
              actor: authAccount,
              permission: 'one'
            }
          ],
          data: {
            custodian: this.getAccountName,
            proposal_id: this.wp.id,
            vote: map[votetype],
            dac_id: this.$dir.dacId
          }
        }
      ]

      const result = await this.$store.dispatch('user/transact', {
        actions: actions
      })
      if (result) {
        await this.actionCallBack(this.wp.id)
        this.$refs.directDelSelect.selected = ''
        // let vote = this.wp.votes.find(v => v.voter == this.getAccountName);
        // if (vote) {
        //   vote.vote = map[votetype];
        //   vote.delegatee = null;
        // } else {
        //   this.wp.votes.push({
        //     proposal_id: Number(this.wp.id),
        //     voter: this.getAccountName,
        //     delegatee: null,
        //     vote: map[votetype],
        //     comment_hash: ""
        //   });
        // }
        // console.log(result);
      }
    },
    async cancelProp () {
      const authAccount = this.$dir.getAccount(this.$dir.ACCOUNT_AUTH)
      const actions = [
        {
          account: this.$dir.getAccount(this.$dir.ACCOUNT_PROPOSALS),
          name: 'cancel',
          authorization: [
            { actor: this.getAccountName, permission: this.getAuth },
            {
              actor: authAccount,
              permission: 'one'
            }
          ],
          data: {
            proposal_id: this.wp.id,
            dac_id: this.$dir.dacId
          }
        }
      ]

      const result = await this.$store.dispatch('user/transact', {
        actions: actions
      })
      if (result) {
        // this.$emit('delete')
        console.log(result)
      }
    },
    async startWork () {
      const actions = [
        {
          account: this.$dir.getAccount(this.$dir.ACCOUNT_PROPOSALS),
          name: 'startwork',
          // authorization: [ {actor: this.getAccountName, permission: 'active'}],
          data: {
            proposal_id: this.wp.id,
            dac_id: this.$dir.dacId
          }
        }
      ]

      const result = await this.$store.dispatch('user/transact', {
        actions: actions
      })
      if (result) {
        // this.$emit('delete')
      }
    },
    async completeWork () {
      const actions = [
        {
          account: this.$dir.getAccount(this.$dir.ACCOUNT_PROPOSALS),
          name: 'completework',
          // authorization: [ {actor: this.getAccountName, permission: 'active'}],
          data: {
            proposal_id: this.wp.id,
            dac_id: this.$dir.dacId
          }
        }
      ]

      const result = await this.$store.dispatch('user/transact', {
        actions: actions
      })
      if (result) {
        // this.$emit('delete')
        console.log(result)
      }
    },

    async arbApprove () {
      const actions = [
        {
          account: this.$dir.getAccount(this.$dir.ACCOUNT_PROPOSALS),
          name: 'arbapprove',
          data: {
            arbitrator: this.getAccountName,
            proposal_id: this.wp.id,
            dac_id: this.$dir.dacId
          }
        },
        {
          account: this.$dir.getAccount(this.$dir.ACCOUNT_ESCROW),
          name: 'approve',

          data: {
            key: this.wp.id,
            approver: this.getAccountName
          }
        }
      ]

      const result = await this.$store.dispatch('user/transact', {
        actions: actions
      })
      if (result) {
        console.log(result)
      }
    },

    async finalize () {
      const actions = [
        {
          account: this.$dir.getAccount(this.$dir.ACCOUNT_PROPOSALS),
          name: 'finalize',
          // authorization: [ {actor: this.getAccountName, permission: 'active'}],
          data: {
            proposal_id: this.wp.id,
            dac_id: this.$dir.dacId
          }
        }
      ]

      const result = await this.$store.dispatch('user/transact', {
        actions: actions
      })
      if (result) {
        console.log(result)
      }
    }
  }
}
</script>
