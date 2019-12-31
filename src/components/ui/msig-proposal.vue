<template>
  <div class="proposal-container">
    <q-expansion-item
        icon-toggle
        label="First"
        group="msigproposals"
        header-class="msigproposal_header"
        :collapse-icon="$configFile.icon.collapse"
        @show="handleIsSeenCache(true)"
    >
      <template v-slot:header>
        <q-item-section avatar>
          <q-icon
                  size="48px"
                  :name="'icon-' + matchIcon"
                  :color="getStatusColor"
          />
        </q-item-section>
        <q-item-section>
          <q-item-label>
            {{ msig.title }}
            <q-chip
                    v-if="!is_seen_computed"
                    dense
                    class="animate-fade absolute"
                    color="negative">new</q-chip>
          </q-item-label>
          <q-item-label caption>
            <MarkdownViewer
                    :tags="[]"
                    :text="msig.description"
                    :maxlen="140"
            />
          </q-item-label>
        </q-item-section>

        <q-item-section>
          <span>Expiration: </span>
          <span class="text-text2">{{
                  new Date(msig.trx.expiration).toUTCString()
                }}</span>
        </q-item-section>

        <q-item-section side top>
          <div @click="approvals_modal = true" class="cursor-pointer">
            <div class="q-caption text-text2">Received Approvals:</div>
            <div class="text-text1 q-title">
            <span
                    v-if="provided_approvals"
                    class="text-primary-light cursor-pointer animate-fade"
            >{{ provided_approvals.length }}</span
            >
              <span class="">/{{ msig.threshold }}</span>
            </div>
          </div>
        </q-item-section>
        </template>

      <q-card>
        <q-card-section>
          <MarkdownViewer
                    :tags="[
                      'h1',
                      'h2',
                      'h3',
                      'italic',
                      'bold',
                      'underline',
                      'strikethrough',
                      'subscript',
                      'superscript',
                      'anchor',
                      'orderedlist',
                      'unorderedlist'
                    ]"
                    :text="msig.description"
            />
        </q-card-section>

        <q-card-section>
          Proposal Name: <span class="text-text2">{{ msig.proposal_name }}</span>
        </q-card-section>
        <q-card-section>
          Proposed by:
          <router-link :to="{ path: '/profile/' + msig.proposer }">{{
            msig.proposer
            }}</router-link>
        </q-card-section>
        <q-card-section>
          Actions: <span class="text-text2">{{ msig.trx.actions.length }}</span>
        </q-card-section>

        <q-card-section>
          <Actionparser
                  class="q-body-1"
                  @seenAllActions="disable_approve = false"
                  :actions="msig.trx.actions"
          />
        </q-card-section>

        <q-card-actions align="right" v-if="!read_only">

          <span v-if="msig.status === 1">
                <q-btn
                        v-if="!isApproved"
                        :disabled="disable_approve"
                        color="positive"
                        label="Approve"
                        @click="approveProposal(msig.proposer, msig.proposal_name)"
                />
                <q-btn
                        v-if="isApproved"
                        color="negative"
                        label="Unapprove"
                        @click="unapproveProposal(msig.proposer, msig.proposal_name)"
                />
                <q-btn
                        v-if="isCreator"
                        color="negative"
                        flat
                        label="cancel"
                        @click="cancelProposal(msig.proposer, msig.proposal_name)"
                />
                <q-btn
                        v-if="isExecutable"
                        color="info"
                        label="execute"
                        @click="executeProposal(msig.proposer, msig.proposal_name)"
                />
              </span>
          <span v-if="msig.status === 3">
                <q-btn
                        v-if="isCreator"
                        color="negative"
                        label="cancel"
                        @click="cancelProposal(msig.proposer, msig.proposal_name)"
                />
                <q-btn
                        color="positive"
                        label="resubmit"
                        @click="resubmit(msig)"
                />
          </span>
        </q-card-actions>
      </q-card>
    </q-expansion-item>

    <!-- modal for displaying approvals mobile+desktop -->
    <q-dialog minimized v-model="approvals_modal">
      <div class="bg-dark text-text1 bg-logo">
        <!-- header -->
        <div
          style="height:50px"
          class="bg-bg1 row items-center justify-between q-px-md"
        >
          <span
            >Approvals
            <span v-if="provided_approvals" class="q-caption text-weight-thin"
              >needs {{ msig.threshold - provided_approvals.length }} more</span
            ></span
          >
          <q-btn icon="close" @click="approvals_modal = false" flat dense />
        </div>
        <!-- content -->
        <div class=" q-pa-md">
          <div class="row justify-start q-mt-sm">
            <!-- <pre>{{provided_approvals}}</pre> -->
            <div
              class="row items-center relative-position bg-bg1 round-borders q-pr-md q-ma-sm"
              v-for="(c, i) in provided_approvals"
              :key="i + 'p'"
            >
              <profile-pic
                :accountname="c.actor"
                :scale="0.5"
                :show_role="true"
              />
              <router-link class=" a2" :to="{ path: '/profile/' + c.actor }">
                <div class="q-ma-none" style="min-width:100px; overflow:hidden">
                  {{ c.actor }}
                </div>
                <div class="q-caption text-text2">@{{ c.permission }}</div>
              </router-link>

              <q-icon
                class="absolute"
                style="top:-5px; right:-10px"
                color="positive"
                :name="$configFile.icon.check"
                size="24px"
              />
            </div>

            <div
              class="row items-center relative-position bg-bg1 round-borders q-pr-md q-ma-sm"
              v-for="(c, i) in requested_approvals"
              :key="i + 'r'"
            >
              <profile-pic
                :accountname="c.actor"
                :scale="0.5"
                :show_role="true"
              />
              <router-link class="a2" :to="{ path: '/profile/' + c.actor }">
                <div class="q-ma-none" style="min-width:100px; overflow:hidden">
                  {{ c.actor }}
                </div>
                <div class="q-caption text-text2">@{{ c.permission }}</div>
              </router-link>
            </div>
            <!-- <pre>{{getmsigIsSeenCache}}</pre> -->
          </div>
        </div>
      </div>
    </q-dialog>
    <!-- <Transaction ref="Transaction" v-on:done="transactionCallback($event)" /> -->
  </div>
</template>

<script>
import Actionparser from 'components/ui/action-parser'
import profilePic from 'components/ui/profile-pic'
import MarkdownViewer from 'components/ui/markdown-viewer'
import { openURL } from 'quasar'

import { mapGetters } from 'vuex'
export default {
  name: 'Msigproposal',
  components: {
    Actionparser,
    profilePic,
    MarkdownViewer
  },

  props: {
    msig: Object
  },

  data () {
    return {
      systemmsig: this.$configFile.get('systemmsigcontract'),
      dacmsig: this.$configFile.get('dacmsigcontract'),
      provided_approvals: null,
      requested_approvals: null,

      isHidden: false,
      approvals_modal: false,
      mobile_details_modal: false,

      isSeen: this.is_seen_computed,

      disable_approve: true
    }
  },
  computed: {
    ...mapGetters({
      getAccountName: 'user/getAccountName',
      getMsigIsSeenCache: 'user/getMsigIsSeenCache',
      getIsCustodian: 'user/getIsCustodian',
      getSettingByName: 'user/getSettingByName',
      getAuth: 'user/getAuth',
      getCustodians: 'dac/getCustodians',
      getAuthAccountPermLevel: 'dac/getAuthAccountPermLevel'
    }),

    read_only: function () {
      return !this.getIsCustodian
    },
    getCustodianApprovals () {
      let custNames = this.getCustodians.map(c => c.cust_name)
      let custodianApprovals = this.provided_approvals.filter(pa =>
        custNames.includes(pa.actor)
      )
      return custodianApprovals
    },

    isExecutable: function () {
      if (this.provided_approvals) {
        let custNames = this.getCustodians.map(c => c.cust_name)
        let custodianApprovals = this.provided_approvals.filter(pa =>
          custNames.includes(pa.actor)
        )
        return custodianApprovals.length >= this.msig.threshold
      } else {
        return false
      }
    },
    isApproved: function () {
      if (this.provided_approvals) {
        return !!this.provided_approvals.find(
          a => a.actor === this.getAccountName
        )
      } else {
        return false
      }
    },
    isCreator: function () {
      return this.getAccountName === this.msig.proposer
    },

    parseActions: function () {
      if (this.msig) {
        return this.msig.trx.actions
        // return this.provided_approvals.length > 0;
      } else {
        return false
      }
    },

    matchIcon: function () {
      const msigTypes = {
        TYPE_TRANSFER: 1,
        TYPE_NEWACCOUNT: 2,
        TYPE_CONFIG: 3,
        TYPE_COMMS: 4,
        TYPE_CODE: 5,
        TYPE_CUSTODIAN: 6,
        TYPE_DAC_OPS: 7,
        TYPE_TERMS: 8,
        TYPE_UNKNOWN: 99
      }

      let icon = 'action-default'
      switch (this.msig.type) {
        case msigTypes.TYPE_TRANSFER:
          icon = 'action-transfer'
          break
        case msigTypes.TYPE_CODE:
          icon = 'action-codechange'
          break
        case msigTypes.TYPE_CONFIG:
          icon = 'action-configupdate'
          break
        case msigTypes.TYPE_TERMS:
          icon = 'action-newmemterms'
          break
        default:
          icon = 'action-default'
          break
      }
      return icon
    },

    getStatusColor: function () {
      let statuscolor = ''
      if (this.msig.status === 1 && this.isApproved) {
        statuscolor = 'positive'
      }
      if (this.msig.status === 0) {
        statuscolor = 'negative'
      }
      if (this.isExecutable || this.msig.status === 2) {
        statuscolor = 'info'
      }
      return statuscolor
    },

    is_seen_computed: function () {
      return this.getMsigIsSeenCache.includes(this.msig.trxid)
    }
  },

  methods: {
    openURL,
    async checkApprovals () {
      let avatars = await this.$profiles.getAvatars([
        ...this.msig.provided_approvals.map(a => a.actor),
        ...this.msig.requested_approvals.map(a => a.actor)
      ])

      // let cust_names = this.getCustodians.map(c => c.cust_name);

      this.provided_approvals = this.msig.provided_approvals
        // .filter(ra => cust_names.includes(ra.actor))
        .map(pa => {
          pa.avatar = avatars.find(p => p.account === pa.actor)
          return pa
        })

      this.requested_approvals = this.msig.requested_approvals
        // .filter(ra => cust_names.includes(ra.actor))
        .map(ra => {
          ra.avatar = avatars.find(p => p.account === ra.actor)
          return ra
        })
    },

    // approve a proposal via msig relay {"proposer":0,"proposal_name":0,"level":0}
    async approveProposal (proposer, proposalName) {
      let actions = [
        {
          account: this.systemmsig,
          name: 'approve',
          data: {
            proposer: proposer,
            proposal_name: proposalName,
            level: { actor: this.getAccountName, permission: this.getAuth }
          }
        },
        {
          account: this.dacmsig,
          name: 'approvede',
          authorization: [
            { actor: this.getAccountName, permission: this.getAuth },
            {
              actor: this.$configFile.get('authaccount'),
              permission: 'one'
            }
          ],
          data: {
            proposer: proposer,
            proposal_name: proposalName,
            approver: this.getAccountName,
            dac_id: this.$configFile.get('dacid')
          }
        }
      ]
      let result = await this.$store.dispatch('user/transact', {
        actions: actions
      })
      if (result) {
        this.transactionCallback('e_approval')
      }
    },

    // unapprove a proposal via msig relay {"proposer":0,"proposal_name":0,"level":0}
    async unapproveProposal (proposer, proposalName) {
      let actions = [
        {
          account: this.systemmsig,
          name: 'unapprove',
          data: {
            proposer: proposer,
            proposal_name: proposalName,
            level: { actor: this.getAccountName, permission: this.getAuth }
          }
        },
        {
          account: this.dacmsig,
          name: 'unapprovede',
          authorization: [
            { actor: this.getAccountName, permission: this.getAuth },
            {
              actor: this.$configFile.get('authaccount'),
              permission: 'one'
            }
          ],
          data: {
            proposer: proposer,
            proposal_name: proposalName,
            unapprover: this.getAccountName,
            dac_id: this.$configFile.get('dacid')
          }
        }
      ]
      let result = await this.$store.dispatch('user/transact', {
        actions: actions
      })
      if (result) {
        this.transactionCallback('e_unapproval')
      }
    },
    // execute a proposal via msig relay {"proposer":0,"proposal_name":0,"executer":0}
    async executeProposal (proposer, proposalName) {
      let actions = [
        {
          account: this.systemmsig,
          name: 'exec',
          data: {
            proposer: proposer,
            proposal_name: proposalName,
            executer: this.getAccountName
          }
        },
        {
          account: this.dacmsig,
          name: 'executede',
          authorization: [
            { actor: this.getAccountName, permission: this.getAuth },
            {
              actor: this.$configFile.get('authaccount'),
              permission: 'one'
            }
          ],
          data: {
            proposer: proposer,
            proposal_name: proposalName,
            executer: this.getAccountName,
            dac_id: this.$configFile.get('dacid')
          }
        }
      ]
      let result = await this.$store.dispatch('user/transact', {
        actions: actions
      })
      if (result) {
        this.transactionCallback('e_exec')
      }
    },

    // cancel a proposal via msig relay {"proposer":0,"proposal_name":0,"canceler":0}
    async cancelProposal (proposer, proposalName) {
      let actions = [
        {
          account: this.systemmsig,
          name: 'cancel',
          data: {
            proposer: proposer,
            proposal_name: proposalName,
            canceler: this.getAccountName
          }
        },
        {
          account: this.dacmsig,
          name: 'cancellede',
          authorization: [
            { actor: this.getAccountName, permission: this.getAuth },
            {
              actor: this.$configFile.get('authaccount'),
              permission: this.getAuthAccountPermLevel // can be one or admin depending of the logged in user
            }
          ],
          data: {
            proposer: proposer,
            proposal_name: proposalName,
            canceler: this.getAccountName,
            dac_id: this.$configFile.get('dacid')
          }
        }
      ]
      let result = await this.$store.dispatch('user/transact', {
        actions: actions
      })
      if (result) {
        this.transactionCallback('e_cancel')
      }
    },

    transactionCallback (eType) {
      if (eType === 'e_approval') {
        this.provided_approvals = null // temporary show spinner by setting to null
        this.msig.requested_approvals = this.msig.requested_approvals.filter(
          ra => ra.actor !== this.getAccountName
        )
        this.msig.provided_approvals.push({
          actor: this.getAccountName,
          permission: this.getAuth
        })
        console.log(
          'trx will be executed in ',
          this.getSettingByName('trx_delay').value,
          'seconds'
        )
        this.checkApprovals()
      }
      if (eType === 'e_unapproval') {
        this.provided_approvals = null // temporary show spinner by setting to null
        this.msig.provided_approvals = this.msig.provided_approvals.filter(
          pa => pa.actor !== this.getAccountName
        )
        this.msig.requested_approvals.push({
          actor: this.getAccountName,
          permission: this.getAuth
        })
        console.log(
          'trx will be executed in ',
          this.getSettingByName('trx_delay').value,
          'seconds'
        )
        this.checkApprovals()
      }

      if (eType === 'e_cancel') {
        // hide the proposal
        this.isHidden = true
      }
      if (eType === 'e_exec') {
        console.log('executed')
        this.isHidden = true
      }
      this.mobile_details_modal = false
    },

    handleIsSeenCache (isSeenToggleBool) {
      console.log(isSeenToggleBool, this.msig.trxid)

      if (isSeenToggleBool) {
        this.isSeen = true
        this.$store.commit('user/setMsigIsSeenCache', {
          mode: 'add',
          msig_id: this.msig.trxid
        })
      } else {
        this.isSeen = false
        this.$store.commit('user/setMsigIsSeenCache', {
          mode: 'remove',
          msig_id: this.msig.trxid
        })
      }
    },
    async resubmit (msig) {
      let clone = JSON.parse(JSON.stringify(msig))
      await this.$store.dispatch('user/proposeMsig', {
        actions: clone.trx.actions,
        title: `Resubmit: ${clone.title}`,
        description: clone.description
      })
    }
  },

  mounted: function () {
    this.checkApprovals()
  }
}
</script>
<!--
<style lang="stylus">
@import '~variables'

.proposal_approved{
  border:2px solid $positive;
  transition : border 400ms ease;
}

.proposal_unapproved{
  border:2px solid transparent;
  transition : border 400ms ease;
}
</style>-->
