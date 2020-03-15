export default {
  showLoginModal: false,
  signingOverlay: {
    show: false,
    status: '', // 0=wait for sig, 1=success, 2=error
    msg: '',
    isShowCloseButton: true
  },
  activeAuthenticator: null,
  authenticatorUser: null,
  UAL: null,
  accountName: null,
  SESSION: {
    accountName: null,
    authenticatorName: null,
    timestamp: null
  },
  paymentInfo: null
}
