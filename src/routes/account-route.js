const express = require('express')
const router = express.Router()
const accountController = ReqError.catch(
  require('../controller/account/account-controller')
)

router.post(
  '/request-email-verify',
  accountController.verifyEmailMail,
  accountController.sendOtpMail
)
router.post(
  '/signup',
  accountController.verifyEmailOtp,
  accountController.signup
)
router.post('/login', accountController.login)
router.post(
  '/password-forget',
  accountController.forgetPasswordMail,
  accountController.sendOtpMail
)
router.post('/password-reset', accountController.resetPassword)

// Now every request needs to be logged in and put his 'password' into the body
router.use(
  accountController.checkAuth,
  accountController.checkPassAfterLoggedIn
)

router.patch('/change-password', accountController.changePassword)
router.patch('/change-username', accountController.changeUsername)
router.patch(
  '/change-email',
  accountController.verifyEmailOtp,
  accountController.changeEmail
)

module.exports = router
