export default {
  'candidate': {
    'nominated_next': '次期カストディアンに指名されました',
    'pay': '支払い',
    'read_more': '続きを読む',
    'requestedpay': '希望報酬',
    'select': '選択',
    'staked': 'ステーク',
    'unselect': '選択解除',
    'votes': '票'
  },
  'constitution': {
    'direct_link': 'ダイレクトリンク',
    'hash': 'ハッシュ',
    'signed_message': '規約に署名しました！',
    'switch_contrast': 'コントラストを切り替え'
  },
  'contract_errors': {
    'BURN_INVALID_QTY_': '不正な数量です',
    'BURN_LOCKED_TOKEN': '転送がロックされているトークンをバーンしています。まず発行者が`unlock`する必要があります。',
    'BURN_NON_POSITIVE_QTY_': '正の数量をバーンして下さい',
    'BURN_SYMBOL_MISMATCH': 'シンボルの精度が一致しません',
    'BURN_UNKNOWN_SYMBOL': 'このコントラクトに知られていないトークンをバーンしようとしています',
    'CLAIMPAY_INVALID_CLAIM_ID': '不正な支払い依頼IDです。',
    'CREATE_EXISITNG_SYMBOL': 'このシンボルのトークンは既に存在しています',
    'CREATE_INVALID_SUPPLY': '不正なサプライです',
    'CREATE_INVALID_SYMBOL': '不正なシンボル名です',
    'CREATE_MAX_SUPPLY_MUST_BE_POSITIVE': '最大サプライは正の値で入力して下さい',
    'GENERAL_MEMBER_HAS_NOT_AGREED_TO_ANY_TERMS': '規約に合意していないアカウントです',
    'GENERAL_MEMBER_HAS_NOT_AGREED_TO_LATEST_TERMS': '最新の規約に合意していません。',
    'GENERAL_REG_MEMBER_NOT_FOUND': 'メンバーとして登録されていないアカウントです。',
    'ISSUE_INVALID_PRECISION': 'シンボルの精度が一致しません',
    'ISSUE_INVALID_QUANTITY': '不正な数量です。',
    'ISSUE_INVALID_SYMBOL': '不正なシンボル名です',
    'ISSUE_NON_EXISTING_SYMBOL': 'このシンボル名のトークンが存在しません。発行する前にトークンを作成して下さい。',
    'ISSUE_NON_POSITIVE': '正の数量を発行してください',
    'ISSUE_QTY_EXCEED_SUPPLY': '数量が利用可能なサプライを超えています',
    'MEMBERREG_NOT_LATEST_TERMS': '合意した規約が最新のものではありません',
    'MEMBERREG_NO_VALID_TERMS': '正当なメンバー規約が見つかりません。',
    'MEMBERUNREG_ACTIVE_CANDIDATE': 'アクティブな候補者は、メンバーから登録解除できるようになる前に、候補者としての任命を辞任する必要があります。',
    'MEMBERUNREG_MEMBER_NOT_REGISTERED': 'メンバーが登録されていません。',
    'NEWMEMTERMS_DUPLICATE_TERMS': '次のメンバー規約に最新の規約の複製を使用することはできません。',
    'NEWMEMTERMS_EMPTY_HASH': '空のメンバー規約ドキュメントのハッシュを使用することはできません。',
    'NEWMEMTERMS_EMPTY_TERMS': '空のメンバー規約を使用することはできません。',
    'NEWMEMTERMS_HASH_TOO_LONG': 'メンバー規約ドキュメントのハッシュは32文字未満である必要があります。',
    'NEWMEMTERMS_TERMS_TOO_LONG': 'メンバー規約ドキュメントurlは256文字未満である必要があります。',
    'NEWPERIOD_EARLY': '現在の期間が完了するまで、新規の期間を呼び出すことはできません。',
    'NEWPERIOD_EXPECTED_CAND_NOT_FOUND': '破損データ: 離任した候補にロックアップ遅延の設定を試みています。',
    'NEWPERIOD_VOTER_ENGAGEMENT_LOW_ACTIVATE': 'DACをアクティベートするために十分な投票が足りていません。',
    'NOMINATECAND_ALREADY_REGISTERED': '既に登録され、アクティブな候補者です。',
    'NOMINATECAND_INSUFFICIENT_FUNDS_TO_STAKE': 'ステーク数量が不十分です。',
    'NOMINATECAND_PAY_LIMIT_EXCEEDED': '候補者への希望報酬額が上限を超えています。',
    'NOMINATECAND_STAKING_FUNDS_INCOMPLETE': '登録してる候補者は、十分な数量のトークンをステークとしてコントラクトに転送する必要があります。',
    'REMOVECANDIDATE_NOT_CURRENT_CANDIDATE': '候補者はまだ登録されていません。',
    'REMOVECUSTODIAN_NOT_CURRENT_CUSTODIAN': '入力されたアカウント名は現在のカストディアンのものではありません。',
    'TRANSFER_INVALID_QTY': '不正な数量です',
    'TRANSFER_NONEXISTING_DESTN': '宛先のアカウントが存在しません',
    'TRANSFER_NON_POSITIVE_QTY': '正の数量を転送してください',
    'TRANSFER_OVERDRAWN': '残高が足りません',
    'TRANSFER_SYMBOL_MISMATCH': 'シンボルの精度が一致しません',
    'TRANSFER_TO_SELF': '自分に送金することはできません',
    'UNLOCK_INVALID_SYMBOL': '不正なシンボル名です',
    'UNLOCK_NON_EXISTING_SYMBOL': 'このシンボルのトークンは存在しません。ロックを解除する前にトークンを作成して下さい。',
    'UNSTAKE_CAND_NOT_REGISTERED': '候補者はまだ登録されていません。',
    'UNSTAKE_CANNOT_UNSTAKE_FROM_ACTIVE_CAND': 'アクティブな候補者のトークンはステークを解除できません。先にwithdrawcandを呼び出して下さい。',
    'UNSTAKE_CANNOT_UNSTAKE_UNDER_TIME_LOCK': 'トークンが時間遅延からロック解除される前に、トークンのステークを解除することはできません。',
    'UPDATEBIO_BIO_SIZE_TOO_LONG': 'バイオグラフィーは最低で256文字必要です。',
    'UPDATECONFIG_INVALID_AUTH_HIGH_TO_NUM_ELECTED': '承認閾値を選任されたカストディアンの人数以上の値で満たすことはできません。',
    'UPDATECONFIG_INVALID_AUTH_MID_TO_LOW_AUTH': '低承認閾値を中承認閾値より大きな値にすることはできません。',
    'UPDATECONFIG_INVALID_CONTRACT': '通知のために設定しようとしているコントラクトが無効です。',
    'UPDATEREQPAY_EXCESS_MAX_PAY': '候補者への希望報酬額が上限を超えています。',
    'UPDATEREQPAY_NOT_CURRENT_REG_CANDIDATE': '候補者はまだ登録されていません。',
    'UPDATETERMS_NO_EXISTING_TERMS': '指定されたIDの規約が実在しません。',
    'UPDATE_BIO_NOT_CURRENT_REG_CANDIDATE': '候補者はまだ登録されていません。',
    'VOTECUST_CANDIDATE_NOT_FOUND': '候補者が見つかりませんでした。',
    'VOTECUST_DUPLICATE_VOTES': '候補者への重複した票を追加しました。',
    'VOTECUST_MAX_VOTES_EXCEEDED': '可能投票数の最大値を超えました。',
    'VOTECUST_VOTING_FOR_INACTIVE_CAND': 'アクティブでない候補者への投票を試みています。',
    'VOTECUST_VOTING_IS_DISABLED': '投票は現在停止中です。'
  },
  'default': {
    'constitution': '規約',
    'constitution_has_been_updated': '規約が更新されました。 更新された規約に署名して、Member Clientを使用してください。',
    'login': 'ログイン',
    'logout': 'ログアウト',
    'member_client': 'メンバークライアント',
    'menu': 'メニュー',
    'sign_the_constitution': '規約に署名する',
    'you_have_not_yet_registered': 'まだメンバーとして登録されていません。メンバークライアントを使用するためには規約に署名してください。',
    'your_token_balance': '{tokenName}残高'
  },
  'four_zero_four': {
    'go_back': '戻る',
    'sorry_nothing_here': '申し訳ありません、リクエストが見つかりませんでした'
  },
  'lang_selector': {
    'choose_your_language': '言語を選択',
    'languages': {
      'chinese': '中国語（簡体字）',
      'english_gb': '英語（GB）',
      'english_us': '英語（US）',
      'french': 'フランス語',
      'german': 'ドイツ語',
      'italian': 'イタリア語',
      'japanese': '日本語',
      'korean': '韓国語',
      'russian': 'ロシア語',
      'spanish': 'スペイン語',
      'vietnamese': 'ベトナム語'
    }
  },
  'manage_candidateship': {
    'amount_to_stake_placeholder': 'ステークしている{token_symbol}の総量',
    'locked_tokens': 'ロックされているトークン',
    'page_description_active_custodian': '現在、カストディアンボードのアクティブメンバーです。',
    'page_description_registered': '{dacname}のカストディアン候補へのご登録ありがとうございます。候補登録の一環として、いくつかのトークンがステークされます。',
    'page_description_unregistered': 'このページは、カストディアンボードのメンバー候補への登録ページです。カストディアンボードのメンバーは、規約で概説されている責任を負います。カストディアンボードのメンバーとしての責任を理解し、それを全うできる場合にのみ、候補者登録をしてください。登録前に、規約のセクション5を入念に確認して下さい。',
    'pay_description': 'カストディアンとして受け取りたい一期分の数量を入力して下さい。要求できる数量は最大で {requested_pay} です。',
    'register': '登録',
    'requested_custodian_pay_placeholder': '希望報酬額(EOS)',
    'requestedpay': '希望報酬額',
    'stake_amount': 'ステーク総量',
    'stake_description': 'ステークしたいトークンの数量を入力して下さい。指定できる数量は最小で {minimum_stake} です。',
    'unregister': '登録解除',
    'unstake': 'ステークを解除',
    'unstake_description': 'ステークを解除してからウォレットに残高が反映されるまで、承認時間として60分の待ち時間が生じることにご注意下さい。ご不便をおかけしますが処理が完了するまでお待ち下さい。また、カストディアンとして選任された場合、残高は所定の日数、スマートコントラクトに保管されます。現在の保管日数：'
  },
  'markdown_viewer': {
    'select_text_to_edit': '編集したいテキストをハイライトする。'
  },
  'menu': {
    'custodians': 'カストディアン',
    'member_status': 'メンバーステータス',
    'profile': 'プロフィール',
    'register_as_candidate': '候補者として登録する',
    'settings': '設定',
    'support': 'サポート&フィードバック',
    'unregister_as_candidate': '候補者としての登録を解除する'
  },
  'profile': {
    'account_name': 'アカウント名',
    'bio': 'バイオグラフィー',
    'cancel': 'キャンセル',
    'download': 'ダウンロード',
    'edit': '編集',
    'familyName': '姓',
    'female': '女性',
    'gender': '性別',
    'givenName': '名',
    'male': '男性',
    'maxLinksmsg': 'すみません、登録できるリンクは最大で  {number_allowed_links} 個までです。',
    'other': 'その他',
    'profile': 'プロフィール',
    'profile_picture_url': 'プロフィール写真のURL',
    'save': '保存',
    'social_link': 'SNSリンク',
    'social_profile_link': 'SNSプロフィールリンク',
    'website': 'ウェブサイト'
  },
  'settings': {
    'API': 'API',
    'API_endpoint': 'APIエンドポイント',
    'NOT_REGISTERED': '未登録',
    'REGISTERED': '登録済み',
    'language_preference': '言語の設定',
    'member_status': 'メンバーステータス',
    'off': 'オフ',
    'on': 'オン',
    'register_as_member': 'メンバー登録',
    'register_now': '登録する',
    'settings': '設定',
    'transaction_popup_desc': 'トランザクションのポップアップを有効/無効にする',
    'transaction_popup_label': 'トランザクションポップアップ',
    'unregister_membership': 'メンバーシップの登録を解除する',
    'user_preference': 'ユーザー設定'
  },
  'transaction': {
    'cancel': 'キャンセル',
    'error': 'エラー',
    'transaction': 'トランザクション',
    'transaction_successful': '成功した取引'
  },
  'vote_custodians': {
    'candidate_list': '候補リスト',
    'description_main': 'カストディアン取締役会は、DACの資産および負債の統治および管理を含むがこれに限定されないDACの運営および業務を管理する。 次のDACメンバーは、7日間継続するカストディアン・ボード上の地位について、自分自身と候補者を提出するためにトークンの一部を権利確定している。 7日ごとに、あなたの投票は、次のカストディアンのボードに参加する人を選ぶために再計算されます。 投票は重要です！ 誰が価値を提供しているかを知るために、頻繁に投票してDACに参加してください。',
    'description_side': 'あなたは一度に最大5つのカストディアンの候補者に投票することができます。 DACに価値をもたらすと思う候補者を選んでください。',
    'my_votes': '私の投票',
    'rows_per_page': 'ページあたりの行数',
    'search': '検索',
    'submit_my_votes': '私の票を提出',
    'voting_disabled_text': '現在投票はできません。グラフィカルインターフェースを用いてテストすることはできますが、投票はブロックチェーンに送信されません。投票は近日中に可能になります。',
    'voting_disabled_title': '現在投票はできません',
    'voting_progress': '投票進捗'
  },
  'votingprogress': {
    'activated_at': '15%でDACがアクティベートされます',
    'loading': '読み込み中...',
    'refresh': '更新',
    'seconds': '秒',
    'threshold_met': '投票の閾値(15%)に到達しました。{dacname}がアンロックされます。',
    'update_in': '更新まで'
  }
}