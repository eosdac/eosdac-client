export default {
  'candidate': {
    'nominated_next': 'Nominated for next custodian board',
    'pay': 'Pay',
    'read_more': 'read more',
    'requestedpay': 'Requested Pay',
    'select': 'select',
    'staked': 'Staked',
    'unselect': 'unselect',
    'votes': 'Votes'
  },
  'constitution': {
    'direct_link': 'Direct Link',
    'hash': 'Hash',
    'not_signed_message': 'You aren\'t a member of {dacname} until you have agreed to the constitution',
    'sign': 'sign',
    'signed_message': 'You have signed the constitution!',
    'unsign': 'unsign'
  },
  'contract_errors': {
    'ACCOUNT_VOTE_NOT_ALLOWED': 'Account vote is not allowed for this type of referendum',
    'BURN_INVALID_QTY_': 'invalid quantity',
    'BURN_LOCKED_TOKEN': 'Burn tokens on transferLocked token. The issuer must `unlock` first.',
    'BURN_NON_POSITIVE_QTY_': 'must burn positive quantity',
    'BURN_SYMBOL_MISMATCH': 'symbol precision mismatch',
    'BURN_UNKNOWN_SYMBOL': 'Attempting to burn a token unknown to this contract',
    'CLAIMPAY_INVALID_CLAIM_ID': 'Invalid pay claim id.',
    'COMPLETEWORK_WRONG_STATE': 'Worker proposal can only be completed from work_in_progress state',
    'CREATEPROP_DUPLICATE_ID': 'A Proposal with the id already exists. Try again with a different id.',
    'CREATEPROP_INVALID_ARBITRATOR': 'Invalid arbitrator.',
    'CREATEPROP_INVALID_PAY_AMOUNT': 'Invalid pay amount. Must be greater than 0.',
    'CREATEPROP_INVALID_SYMBOL': 'Invalid pay amount symbol.',
    'CREATEPROP_SHORT_SUMMARY': 'Summary length is too short.',
    'CREATEPROP_SHORT_TITLE': 'Title length is too short.',
    'CREATE_EXISITNG_SYMBOL': 'token with symbol already exists',
    'CREATE_INVALID_SUPPLY': 'invalid supply',
    'CREATE_INVALID_SYMBOL': 'invalid symbol name',
    'CREATE_MAX_SUPPLY_MUST_BE_POSITIVE': 'max-supply must be positive',
    'DELEGATEVOTE_DELEGATE_SELF': 'Cannot delegate voting to yourself.',
    'DELEGATEVOTE_PROPOSAL_NOT_FOUND': 'Proposal not found.',
    'FINALIZE_INSUFFICIENT_VOTES': 'Insufficient votes on worker proposal to be finalized.',
    'FINALIZE_WRONG_STATE': 'Proposal is not in the pending_finalize state therefore cannot be finalized.',
    'GENERAL_MEMBER_HAS_NOT_AGREED_TO_ANY_TERMS': 'Account has not agreed to any terms',
    'GENERAL_MEMBER_HAS_NOT_AGREED_TO_LATEST_TERMS': 'Agreed terms isn\'t the latest.',
    'GENERAL_REG_MEMBER_NOT_FOUND': 'Account is not registered with members.',
    'ISSUE_INVALID_PRECISION': 'symbol precision mismatch',
    'ISSUE_INVALID_QUANTITY': 'invalid quantity.',
    'ISSUE_INVALID_SYMBOL': 'invalid symbol name',
    'ISSUE_NON_EXISTING_SYMBOL': 'token with symbol does not exist, create token before issue',
    'ISSUE_NON_POSITIVE': 'must issue positive quantity',
    'ISSUE_QTY_EXCEED_SUPPLY': 'quantity exceeds available supply',
    'MEMBERREG_NOT_LATEST_TERMS': 'Agreed terms isn\'t the latest.',
    'MEMBERREG_NO_VALID_TERMS': 'No valid member terms found.',
    'MEMBERUNREG_ACTIVE_CANDIDATE': 'An active candidate must resign their nomination as candidate before being able to unregister from the members.',
    'MEMBERUNREG_MEMBER_NOT_REGISTERED': 'Member is not registered.',
    'NEWMEMTERMS_DUPLICATE_TERMS': 'Next member terms cannot be duplicate of the latest.',
    'NEWMEMTERMS_EMPTY_HASH': 'Member terms document hash cannot be empty.',
    'NEWMEMTERMS_EMPTY_TERMS': 'Member terms cannot be empty.',
    'NEWMEMTERMS_HASH_TOO_LONG': 'Member terms document hash should be less than 32 characters long.',
    'NEWMEMTERMS_TERMS_TOO_LONG': 'Member terms document url should be less than 256 characters long.',
    'NEWPERIOD_EARLY': 'New period is being called too soon. Wait until the period has completed.',
    'NEWPERIOD_EXPECTED_CAND_NOT_FOUND': 'Corrupt data: Trying to set a lockup delay on candidate leaving office.',
    'NEWPERIOD_NOT_ENOUGH_CANDIDATES': 'Not enough candidates to unlock.',
    'NEWPERIOD_VOTER_ENGAGEMENT_LOW_ACTIVATE': 'Voter engagement is insufficient to activate the DAC.',
    'NOMINATECAND_ALREADY_REGISTERED': 'Candidate is already registered and active.',
    'NOMINATECAND_INSUFFICIENT_FUNDS_TO_STAKE': 'Insufficient funds have been staked.',
    'NOMINATECAND_PAY_LIMIT_EXCEEDED': 'Requested pay limit for a candidate was exceeded.',
    'NOMINATECAND_STAKING_FUNDS_INCOMPLETE': 'A registering candidate must transfer sufficient tokens to the contract for staking.',
    'PROPOSAL_EXPIRED': 'The worker proposal is expired.',
    'REMOVECANDIDATE_NOT_CURRENT_CANDIDATE': 'Candidate is not already registered.',
    'REMOVECUSTODIAN_NOT_CURRENT_CUSTODIAN': 'The entered account name is not for a current custodian.',
    'STARTWORK_INSUFFICIENT_VOTES': 'Insufficient votes on worker proposal.',
    'STARTWORK_WRONG_STATE': 'Proposal not found.Proposal is not in the pending approval state therefore cannot start work.',
    'TRANSFER_INVALID_QTY': 'invalid quantity',
    'TRANSFER_NONEXISTING_DESTN': 'to account does not exist',
    'TRANSFER_NON_POSITIVE_QTY': 'must transfer positive quantity',
    'TRANSFER_OVERDRAWN': 'overdrawn balance',
    'TRANSFER_SYMBOL_MISMATCH': 'symbol precision mismatch',
    'TRANSFER_TO_SELF': 'cannot transfer to self',
    'UNLOCK_INVALID_SYMBOL': 'invalid symbol name',
    'UNLOCK_NON_EXISTING_SYMBOL': 'token with symbol does not exist, create token before unlock',
    'UNSTAKE_CAND_NOT_REGISTERED': 'Candidate is not already registered.',
    'UNSTAKE_CANNOT_UNSTAKE_FROM_ACTIVE_CAND': 'Cannot unstake tokens for an active candidate. Call withdrawcand first.',
    'UNSTAKE_CANNOT_UNSTAKE_UNDER_TIME_LOCK': 'Cannot unstake tokens before they are unlocked from the time delay.',
    'UPDATEBIO_BIO_SIZE_TOO_LONG': 'The bio should be less than 256 characters.',
    'UPDATECONFIG_INVALID_AUTH_HIGH_TO_NUM_ELECTED': 'The auth threshold can never be satisfied with a value greater than the number of elected custodians',
    'UPDATECONFIG_INVALID_AUTH_MID_TO_LOW_AUTH': 'The low auth threshold cannot be greater than the mid auth threshold.',
    'UPDATECONFIG_INVALID_CONTRACT': 'Invalid contract attempt to be set for notifying.',
    'UPDATEREQPAY_EXCESS_MAX_PAY': 'Requested pay amount limit for a candidate was exceeded.',
    'UPDATEREQPAY_NOT_CURRENT_REG_CANDIDATE': 'Candidate is not already registered.',
    'UPDATETERMS_NO_EXISTING_TERMS': 'Existing terms not found for the given ID',
    'UPDATE_BIO_NOT_CURRENT_REG_CANDIDATE': 'Candidate is not already registered.',
    'VOTECUST_CANDIDATE_NOT_FOUND': 'Candidate could not be found.',
    'VOTECUST_DUPLICATE_VOTES': 'Added duplicate votes for the same candidate.',
    'VOTECUST_MAX_VOTES_EXCEEDED': 'Max number of allowed votes was exceeded.',
    'VOTECUST_VOTING_FOR_INACTIVE_CAND': 'Attempting to vote for an inactive candidate.',
    'VOTECUST_VOTING_IS_DISABLED': 'Voting is currently disabled.',
    'VOTEPROP_INVALID_PROPOSAL_STATE': 'Invalid proposal state to accept votes.',
    'VOTEPROP_INVALID_VOTE': 'Invalid vote for the current proposal state.',
    'VOTEPROP_PROPOSAL_NOT_FOUND': 'Proposal not found.',
    'scatter_firewall': 'Scatter has blocked this request.  Please check Scatter under Settings > Firewall and remove eosio.msig::approve if it is there.'
  },
  'dac_financials': {
    'treasury_explainer_header': 'The Treasury Account',
    'treasury_explainer': 'The following account has been set up as the treasury account for the DAC.  This account is controlled by the DAC and is designed to hold all of the token balances which are owned by it, the funds here are used to pay for worker proposals and custodian pay.',
    'treasury_explainer_to_fund': 'To fund the account, send tokens to the following account from any other account.  There is no need to set a memo.',
    'intro': 'The following EOS accounts represent value flow over time within the DAC and can be useful for budgeting and decision making.',
    'clear': 'Clear All',
    'edit': 'edit',
    'empty_queue': 'No transactions in the queue',
    'exec': 'Exec All',
    'export': 'Export Queue',
    'import_file': 'Import File',
    'propose_transfer': 'Propose Transfer',
    'propose_transfer_help': 'Fill in the form to propose a transfer from one of the DAC accounts. The transfers will be submitted to the blockchain as multisignature proposals. The custodians need to vote before the transfer can be executed.',
    'cust_only': 'custodians only',
    'send': 'send',
    'signing': 'signing',
    'trx_que': 'Trx Queue',
    'view': 'view'
  },
  'default': {
    'powered_by': 'Powered by eosDAC',
    'constitution': 'Constitution',
    'constitution_has_been_updated': 'The Constitution has been updated. Please sign the updated Constitution to use the Member Client.',
    'login': 'login',
    'logout': 'Logout',
    'member_client': 'Member Client',
    'menu': 'Menu',
    'read_the_constitution': 'Read the Constitution',
    'sign_the_constitution': 'Sign the Constitution',
    'submit': 'Submit',
    'update': 'Update',
    'you_have_not_yet_registered': 'You have not been registered as a Member yet. Please sign the constitution to use the Member Client.',
    'your_token_balance': 'Your {tokenName} Balance',
    'liquid_balance': 'Liquid Balance',
    'staked_balance': 'Staked Balance'
  },
  'four_zero_four': {
    'go_back': 'Go back',
    'sorry_nothing_here': 'Sorry, nothing here...'
  },
  'lang_selector': {
    'choose_your_language': 'Choose your Language',
    'languages': {
      'chinese': 'Chinese (Simplified)',
      'english_gb': 'English (GB)',
      'english_us': 'English (US)',
      'french': 'French',
      'german': 'German',
      'italian': 'Italian',
      'japanese': 'Japanese',
      'korean': 'Korean',
      'russian': 'Russian',
      'spanish': 'Spanish',
      'vietnamese': 'Vietnamese'
    }
  },
  'manage_candidateship': {
    'amount_to_stake_placeholder': 'amount to stake {token_symbol}',
    'candidate': 'Candidate',
    'current_stake': 'Staked Tokens',
    'page_description_active_custodian': 'You are currently active as an {dacname} custodian board member.',
    'page_description_registered': 'Thank you for registering as a candidate to serve on the {dacname} custodian board. As part of your candidacy registration, some of your tokens have been staked. Click the \'+\' button to increase your stake.',
    'page_description_unregistered': 'This page is for registering as a candidate for a position on the custodian board. This position comes with responsibiliies outlined in the {dacname} Constitution. Please, do not register as a candidate unless you fully understand and can meet the responsibilites of an {dacname} custodian board member. Please review section 5 of the constitution carefully before registering.',
    'pay_description': 'Please fill in The amount you want to receive for being a custodian during one period. The maximum amount is {requested_pay}.',
    'member': 'Member',
    'register': 'register',
    'requested_custodian_pay_placeholder': 'requested pay in {system_token}',
    'requestedpay': 'Requested Pay',
    'stake_amount': 'Stake Amount',
    'stake_description': 'Please specify the amount of tokens you want to stake. The minimum amount is {minimum_stake}.',
    'total_votes': 'Total Votes',
    'unregister': 'unregister',
    'unstake': 'unstake',
    'unstake_description': 'Please note, the unstaking action has a built in delay of 60 minutes from the time you unstake before you will see the funds back in your wallet. Please be patient for the transfer to complete. Also, if you were ever elected as a custodian, the funds will be held in a smart contract for a number of days, currently set to: '
  },
  'transactionbuilder': {
    'add_actions': 'No actions added yet. You can add multiple actions to the transaction. Drag/Drop to change order.',
    'add_title_description': 'Add a Title and Description to your DAC proposal.',
    'title': 'Title',
    'description': 'Description',
    'set_expiry': 'Set a date when the msig proposal should expire. The msig transaction will not be executable after this date even if enough signatures are collected.',
    'submit_proposal': 'Submit Proposal'
  },
  'actionmaker': {
    'contract_name': 'Enter the contract name',
    'add_action': 'Add Action'
  },
  'menu': {
    'create_msigs': 'Create Msigs',
    'credits': 'Credits',
    'custodian_tools': 'Custodian Tools',
    'custodians': 'Vote For Custodians',
    'dac_activity': '{dacname} Activity',
    'explore': 'Explore',
    'manage_financials': 'Manage Financials',
    'manage_dac': 'Manage DAC',
    'member_status': 'Member Status',
    'member_tools': 'Member Tools',
    'my_payments': 'My Payments',
    'my_worker_proposals': 'My Worker Proposals',
    'new_referendum': 'Propose Referendum',
    'new_worker_proposal': 'New Worker Proposal',
    'profile': 'Profile',
    'referendums': 'Referendums',
    'register_as_candidate': 'Register As Candidate',
    'settings': 'Settings',
    'signature_required': 'Signature Required',
    'support': 'Support & Feedback',
    'switch_account': 'Switch Account',
    'unregister_as_candidate': 'Manage Candidateship',
    'view_custodians': 'View Custodians',
    'view_financials': 'View Financials',
    'view_msigs': 'View Proposals',
    'view_worker_proposals': 'View Worker Proposals',
    'vote_msigs': 'Vote Proposals',
    'vote_worker_proposals': 'Vote Worker Proposals'
  },
  'msig_creator': {
    'actions': 'Actions',
    'advanced': 'advanced',
    'back': 'Back',
    'expiration': 'Expiration',
    'id_name': 'ID/name',
    'json_description': 'For convenience the action data is shown in hex and plain text.',
    'msig_delay': 'Add a delay for executing the msig in seconds ',
    'multisignature_account': 'Multisignature Account',
    'new_id': 'generate new id',
    'next': 'Next',
    'no_actions': 'No actions added yet.',
    'page_title': 'Create Msig Transaction',
    'reset': 'Reset after submit',
    'review_msig_transaction': 'Review Msig Transaction',
    'sort_notify': 'Sort the actions by dragging.',
    'step1': 'Select Action',
    'step1_desc': 'Select an action or enable advanced mode.',
    'step2': 'Add Actions',
    'step2_desc': 'Add actions to the multisignature transaction.',
    'step3': 'Add Info',
    'step3_desc': 'Give the msig transaction a title and description',
    'step4': 'Set Options',
    'step4_descl': 'Set a date on which the transaction should expire. The transaction will be unexecutable after this date even if all signatures are collected.',
    'step4_descr': 'Configure additional options from the msig. Don\'t change if you\'re not sure.',
    'step5': 'Review & Submit',
    'step5_desc': 'Please review your msig carefully. You can jump back and forth to make changes.',
    'sum_placeholder': 'Short info about the transaction',
    'summary': 'Description',
    'title': 'title',
    'view_full_msig': 'view full msig'
  },
  'profile': {
    'account_name': 'account name',
    'bio': 'Bio',
    'cancel': 'cancel',
    'download': 'Download',
    'edit': 'Edit',
    'familyName': 'Family Name',
    'female': 'Female',
    'gender': 'Gender',
    'givenName': 'Name',
    'http_error': 'Image link should be https',
    'male': 'Male',
    'maxLinksmsg': 'Sorry, max {number_allowed_links} links allowed.',
    'other': 'Other',
    'profile': 'Profile',
    'profile_picture_url': 'Profile Picture Url',
    'save': 'Save',
    'set_picture': 'Set Picture',
    'social_link': 'Social Link',
    'social_profile_link': 'Social profile link',
    'website': 'Website'
  },
  'settings': {
    'API': 'API',
    'API_endpoint': 'API Endpoint',
    'NOT_REGISTERED': 'NOT REGISTERED',
    'REGISTERED': 'REGISTERED',
    'auto_logout_delay_l': 'Automatically log out after the specified amount of inactivity in minutes. 0 is never log out',
    'debug_console_log_l': 'Console Logging',
    'debug_console_log_s': 'Toggle logging messages to the browser console',
    'debug_data_structure_l': 'Data Structures',
    'debug_data_structure_s': 'Display data structures on the bottom of each page',
    'debug_dev_tools_l': 'Dev & Debug Tools',
    'debug_dev_tools_s': 'debug and dev playground',
    'language_preference': 'Language Preference',
    'locale_language_l': 'Choose your Language',
    'locale_numbers_l': 'Localize Numbers',
    'locale_numbers_s': 'Toggle number localization',
    'member_status': 'Member Status',
    'notify_dac_msg_l': 'Live DAC Notifications',
    'notify_dac_msg_s': 'Enable live notifications from actions made on the DAC smart contracts',
    'notify_error_msg_l': 'Error Notifications',
    'notify_error_msg_s': 'Enabele error messages',
    'notify_info_msg_l': 'Info Notifications',
    'notify_info_msg_s': 'Enable info messages',
    'notify_success_msg_l': 'Success Notifications',
    'notify_success_msg_s': 'Enable success messages',
    'off': 'off',
    'on': 'on',
    'register_as_member': 'Register as Member',
    'register_now': 'Register Now',
    'settings': 'Settings',
    'toolbar_menu_items_l': 'Toolbar Menu Items',
    'toolbar_menu_items_s': 'Display balances in the toolbar. (big screens only)',
    'toolbar_profile_image_l': 'Toolbar Profile Image',
    'toolbar_profile_image_s': 'Display your avatar next to the login button',
    'toolbar_reveal_l': 'Hide Toolbar',
    'toolbar_reveal_s': 'Hide toolbar when scrolling down',
    'transaction_popup_desc': 'Enable/disable transaction popups',
    'transaction_popup_label': 'Transaction Popups',
    'trx_delay_l': 'Set a delay on transactions in seconds',
    'unregister_membership': 'Unregister Membership',
    'user_preference': 'User Settings'
  },
  'transaction': {
    'cancel': 'Cancel',
    'delay_seconds': 'delay {trx_delay} seconds',
    'error': 'Error',
    'explorer': 'Explorer',
    'loading': 'loading',
    'please_login': 'Please Login',
    'signature_rejected': 'You have cancelled the transaction',
    'transaction': 'Transaction',
    'rejected': 'Rejected',
    'transaction_cancelled': 'Transaction Cancelled',
    'transaction_successful': 'Transaction Successful',
    'waiting_for_signature': 'waiting for signature',
    'you_must_login': 'You need to login before performing an action'
  },
  'vote_custodians': {
    'candidate_list': 'Candidate List',
    'custodian_board': 'Custodian Board',
    'description_main': 'The Custodian Board manages the operations and affairs of the DAC, including but not limited to the governance and administration of the assets and liabilities of the DAC. The following DAC members have vested some of their tokens to submit themselves as candidates for a position on the custodian board which last for 7 days. Every 7 days, your votes are recalculated to select who will be part of the next custodian board. Voting is important! Please vote often and stay engaged within the DAC to know who is providing value.',
    'description_side': 'You can vote for up to {maxvotes} custodian candidates at a time. Please select candidates who you think will bring value to the DAC.',
    'my_votes': 'My Votes',
    'no_custodians': 'No custodians yet',
    'rows_per_page': 'Rows Per Page',
    'search': 'Search',
    'submit_my_votes': 'SUBMIT MY VOTES',
    'voting_disabled_text': 'Voting is currently disabled. You are able to test out the graphical interface but your votes won\'t be submitted to the chain. Voting will be enabled shortly.',
    'voting_disabled_title': 'Voting Disabled',
    'voting_progress': 'voting progress',
    'no_candidates': 'No candidates'
  },
  'display_custodians': {
    'new_election': 'New election in',
    'days': 'days',
    'hours': 'hours',
    'minutes': 'minutes',
    'seconds': 'seconds',
    'activation_progress': 'DAC Activation Progress',
    'voting_progress': 'Voting Progress',
    'candidates_votes': 'Number of Candidates with Votes'
  },
  'votingprogress': {
    'activated_at': 'The DAC will be activated at 15%',
    'loading': 'loading...',
    'refresh': 'Refresh',
    'seconds': 'seconds',
    'threshold_met': 'Voting threshold met. The DAC can be unlocked.',
    'update_in': 'update in'
  },

  'proposals': {
    'review_proposals': 'Review Proposals',
    'open': 'open',
    'executed': 'executed',
    'cancelled': 'cancelled',
    'expired': 'expired',
    'no_proposals': 'No proposals available',
    'loading': 'Loading'
  },

  'proposal': {
    'new': 'new',
    'trx': 'Proposal Transaction ID',
    'executed_by': 'Executed by',
    'executed_trx': 'Executed Transaction ID',
    'expiration': 'Expiration',
    'received_approvals': 'Received Approvals',
    'proposal_name': 'Proposal Name',
    'proposed_by': 'Proposed by',
    'approve': 'Approve',
    'unapprove': 'Unapprove',
    'cancel': 'cancel',
    'execute': 'execute',
    'resubmit': 'resubmit',
    'approvals': 'Approvals'
  },

  'action': {
    'transfer': 'Transfer',
    'click_icon': 'Click the icon to view data'
  },

  'workerproposals': {
    'my_delegations': 'my delegations',
    'inbox': 'inbox',
    'pending_approval': 'Pending Approval',
    'work_in_progress': 'Work in Progress',
    'pending_claim': 'Pending Claim',
    'validated': 'Work Validated',
    'completed': 'Completed',
    'expired': 'Expired',
    'cancelled': 'Cancelled',
    'loading': 'Loading',
    'no_proposals': 'No proposals available',
    'delegate_votes': 'Delegate votes'
  },

  'workerproposal': {
    'proposer': 'Proposer',
    'requested_pay': 'Requested Pay',
    'validator': 'Validator',
    'submitted': 'Submitted',
    'status': 'Status',
    'time_left': 'Time Left',
    'expired': 'expired',
    'days': 'days',
    'hours': 'hours',
    'minutes': 'minutes',
    'seconds': 'seconds',
    'id': 'ID',
    'vote_threshold': 'Vote Threshold',
    'delegation': 'Delegation',
    'approve': 'Approve',
    'deny': 'Deny',
    'approve_claim': 'Approve Claim',
    'deny_claim': 'Deny Claim',
    'arb_approve': 'Arbitrator approve',
    'work_is_in_progress': 'Work is in progress',
    'start_work': 'Start work',
    'complete_work': 'Complete work',
    'propose_transaction': 'Propose Transaction',
    'claim': 'Claim',
    'cancel': 'Cancel',
    'votes': 'Votes'
  },

  'newworkerproposal': {
    'title': 'Submit Worker Proposal',
    'intro': 'Please fill in the form to explain your worker proposal.',
    'title_required': 'A title is required',
    'proposal_title': 'Title',
    'select_category': 'Please select a category',
    'proposal_category': 'Category',
    'arbitrator': 'Arbitrator',
    'proposal_description': 'Description',
    'submit': 'Submit Proposal'
  },

  'referendums': {
    'title': 'Referendums',
    'new_title': 'Propose New Referendum',
    'form_title': 'Title',
    'form_content': 'Content',
    'submit': 'Propose Referendum'
  },

  'referendum': {
    'vote_yes': 'Vote Yes',
    'vote_no': 'Vote No',
    'vote_abstain': 'Vote Abstain',
    'votes_yes': 'Yes',
    'votes_no': 'No',
    'votes_abstain': 'Abstain'
  },

  'newperiod_first': {
    'call_new_period': 'The required number of votes have been received to unlock this DAC!',
    'start_new_period': 'Unlock Now',
    'dac_locked': 'The DAC is still locked but can now be unlocked'
  },

  'mypayments': {
    'pending_payments': 'Pending Payments',
    'total': 'Total',
    'no_payments': 'No payments due',
    'claim': 'claim',
    'update_requested_pay': 'Update Requested Pay',
    'your_current_pay': 'Your current pay amount is set to {currentpay}',
    'pay_invalid': 'Your current requested pay is invalid, you MUST update it before proceeding'
  },

  'manageconstitution': {
    'review_constitution': 'Review the constitution history and propose constitution updates.',
    'constitution_history': 'Constitution History',
    'version': 'Version',
    'new_constitution': 'New Constitution',
    'constitution_url': 'Constitution URL',
    'new_constitution_detected': 'New constitution detected. Please review the constitution and verify the md5 hash before updating. The constitution change will be put up for voting via msig.',
    'no_constitution_loaded': 'No constitution loaded',
    'loading': 'loading'
  },

  'contracts_config': {
    'general': 'General',
    'proposals': 'Worker Proposals',
    'token': 'Token',
    'referendum': 'Referendum',
    'brand': 'Colors & Brand',
    'features': 'Features',
    'general_title': 'Voting & Custodian Config',
    'general_number_elected': 'Number Elected',
    'general_max_votes': 'Max Votes',
    'general_lockup': 'Custodian Lockup',
    'general_max_req_pay': 'Maximum Requested Pay',
    'general_lockup_release': 'Lockup Release Delay',
    'general_period_length': 'Period Length',
    'general_auth_high': 'High Threshold',
    'general_auth_mid': 'Medium Threshold',
    'general_auth_low': 'Low Threshold',
    'general_initial_quorum': 'Unlock Threshold (%)',
    'general_vote_quorum': 'Ongoing Quorum (%)',
    'general_use_service': 'Use Service Provider',
    'general_propose_changes': 'Propose Changes',
    'proposals_title': 'Proposals',
    'proposals_proposal_threshold': 'Proposal Threshold',
    'proposals_finalise_threshold': 'Finalize Threshold',
    'proposals_escrow_expiry': 'Escrow Expiry',
    'proposals_approval_expiry': 'Approval Expiry',
    'proposals_propose_changes': 'Propose Changes',
    'token_title': 'Token Config',
    'token_enable_staking': 'Enable Staking',
    'token_min_stake_time': 'Minimum Stake Time',
    'token_max_stake_time': 'Maximum Stake Time',
    'token_propose_changes': 'Propose Changes',
    'referendum_title': 'Referendums',
    'referendum_fees': 'Fees',
    'referendum_pass_rate': 'Pass rate',
    'referendum_quorum_token': 'Quorum (Token Votes)',
    'referendum_quorum_account': 'Quorum (Account Votes)',
    'referendum_allow_per_account': 'Allow Per-Account Voting',
    'referendum_propose_changes': 'Propose Changes',
    'branding_title': 'Branding',
    'branding_dac_name': 'DAC Name',
    'branding_homepage': 'Homepage',
    'branding_description': 'Description',
    'branding_logo': 'Logo URL',
    'branding_logo_notext': 'Logo (No Text) URL',
    'branding_background_url': 'Background URL',
    'branding_discord': 'Discord URL',
    'branding_telegram': 'Telegram URL',
    'branding_extension': 'Client Extension',
    'branding_dark_theme': 'Dark Theme',
    'branding_primary': 'Primary',
    'branding_secondary': 'Secondary',
    'branding_accent': 'Accent',
    'branding_info': 'Info',
    'branding_positive': 'Positive',
    'branding_negative': 'Negative',
    'branding_warning': 'Warning',
    'branding_propose_changes': 'Propose Changes',
    'branding_colors_disabled': 'Color selection is disabled because a custom extension is being used',
    'features_title': 'Features',
    'features_referendum_contract': 'Referendum contract name',
    'features_wp_contract': 'Worker proposals contract name',
    'features_referendums': 'Referendums',
    'features_wp': 'Worker Proposals'
  },

  'wp_categories': {
    'cat_0': 'General',
    'cat_1': 'Block Production',
    'cat_2': 'B2B',
    'cat_3': 'Content Creation',
    'cat_4': 'Community Engagement',
    'cat_5': 'Tech and Development',
    'cat_6': 'Legal and Governance',
    'cat_7': 'Operations',
    'cat_8': 'Translations',
    'cat_9': 'Custodians',

    'cat_0_desc': 'This is a short description about General',
    'cat_1_desc': 'This is a also short description about Block Production',
    'cat_2_desc': 'This is a short description about B2B',
    'cat_3_desc': 'This is a too short description about Content Creation',
    'cat_4_desc': 'This is a short description about Community Engagement',
    'cat_5_desc': 'Short description about Tech and Development',
    'cat_6_desc': 'This is a short description about Legal and Governance',
    'cat_7_desc': 'This is a short description about Operations',
    'cat_8_desc': 'This is a short description about Translations',
    'cat_9_desc': 'This is a short description about Custodians'
  },

  'conf_cust_contr': {
    'auth_threshold_high_title': 'Vote threshold high',
    'auth_threshold_low_title': 'Vote threshold low',
    'auth_threshold_mid_title': 'Vote threshold mid',
    'authaccount_title': 'Authority account',
    'initial_vote_quorum_percent_title': 'Initial vote quorum (%)',
    'lockup_release_time_delay_title': 'Unstake delay',
    'lockupasset_title': 'Candidate stake amount',
    'maxvotes_title': 'Maximum number of votes',
    'numelected_title': 'Number of custodians',
    'periodlength_title': 'Period length',
    'requested_pay_max_title': 'Maximum requested pay',
    'serviceprovider_title': 'Service provider',
    'should_pay_via_service_provider_title': 'Pay via service provider',
    'tokenholder_title': 'Token holder account',
    'vote_quorum_percent_title': 'Vote quorum (%)',

    'auth_threshold_high_desc': 'How many custodians are required to approve highest level actions?',
    'auth_threshold_low_desc': 'How many custodians are required to approve lowest level actions?',
    'auth_threshold_mid_desc': 'How many custodians are required to approve mid level actions?',
    'authaccount_desc': 'The DAC account that manages all permissions.',
    'initial_vote_quorum_percent_desc': 'What percentage of tokens are needed for a quorum to initially launch the DAC?',
    'lockup_release_time_delay_desc': 'How much time before locked up stake can be released back to the candidate using the unstake action?',
    'lockupasset_desc': 'How many tokens does a member need to lock up in order to register as a custodian candidate? This ensure candidates have skin in the game to protect the value of the $TOKENSYBMOL token which secures the DAC.',
    'maxvotes_desc': 'How many votes does each member get when voting for custodians?',
    'numelected_desc': 'How many custodians will be elected to the custodian board?',
    'periodlength_desc': 'How long will each custodian period be in seconds?',
    'requested_pay_max_desc': 'What is the maximum amount of tokens a custodian can request as a candidate?',
    'serviceprovider_desc': 'The optional account that will be used for legal contracts as a traditionally recognized entity acting as a service provider for the DAC.',
    'should_pay_via_service_provider_desc': 'Do payments need to pass via the service provider?',
    'tokenholder_desc': 'The DAC account that holds the tokens.',
    'vote_quorum_percent_desc': 'Amount of token value in votes required to trigger the allow a new set of custodians to be set after the initial threshold has been achieved.'
  },

  'conf_wp_contr': {
    'proposal_threshold_title': '',
    'finalize_threshold_title': '',
    'escrow_expiry_title': '',
    'approval_expiry_title': '',

    'proposal_threshold_desc': '',
    'finalize_threshold_desc': '',
    'escrow_expiry_desc': '',
    'approval_expiry_desc': ''
  },

  'msig_transfer': {
    'form_title': 'Title',
    'form_title_error': 'Title is required and can\'t be longer than 230 chars',
    'form_description': 'Description',
    'form_description_error': 'Description is required and can\'t be longer than 900 chars',
    'form_from': 'From',
    'form_from_error': 'Select a from account',
    'form_to': 'To',
    'form_to_error': 'Please enter a valid accountname',
    'form_quantity': 'Quantity',
    'form_memo': 'Memo',
    'form_memo_error': 'Memo can\'t be longer then 255 chars.',
    'form_add': 'add'
  },

  'ual': {
    'close': 'Close',
    'connecting_to': 'Connecting to {name}...',
    'no_authenticators': 'No compatible authenticators found',
    'input_account': 'Enter your account name',
    'back': 'back',
    'service_unavailable': 'Service Unavailable'
  }
}
