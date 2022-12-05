const express = require('express')
const { catchError } = require('req-error')

const file = require('../file')
const router = express.Router()

const accountController = catchError(
  require('../controller/account/account-controller')
)

router.post(
  '/request-email-verify',
  accountController.verifyEmailMail,
  accountController.sendOtpMail
)

router.post(
  '/signup',
  file.fileMiddleware,
  accountController.verifyEmailOtp,
  accountController.signup,
  accountController.sendJwt
)
router.post('/login', accountController.login, accountController.sendJwt)

router.post(
  '/password-forget',
  accountController.forgetPasswordMail,
  accountController.sendOtpMail
)
router.post(
  '/password-reset',
  accountController.resetPassword,
  accountController.sendJwt
)

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
