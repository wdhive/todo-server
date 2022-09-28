const express = require('express')
const router = express.Router()
const accountController = ReqError.catch(
  require('../controller/account/account-controller')
)

router.post(
  '/request-email-verify',
  accountController.emailVerifyMiddleWare,
  accountController.sendOtpMail
)
router.post(
  '/signup',
  accountController.verifyEmailOtpMiddleware,
  accountController.signup
)
router.post('/login', accountController.login)
router.post(
  '/password-forget',
  accountController.forgetPasswordMiddleWare,
  accountController.sendOtpMail
)
router.post('/password-reset', accountController.resetPassword)

// Now every request needs to be logged in and put his 'password' into the body
router.use(
  accountController.checkAuthMiddleware,
  accountController.checkPassAfterSignedinMiddleWare
)

router.patch('/change-password', accountController.changePassword)
router.patch('/change-username', accountController.changeUsername)
router.patch(
  '/change-email',
  accountController.verifyEmailOtpMiddleware,
  accountController.changeEmail
)

module.exports = router
