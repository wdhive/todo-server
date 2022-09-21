const express = require('express')
const userController = ReqError.wrapper(
  require('../controller/account/user-controller')
)
const accountController = ReqError.wrapper(
  require('../controller/account/account-controller')
)

const router = express.Router()

router.post('/verify-email', accountController.verifyEmail)
router.post('/signup', accountController.signup)
router.post('/login', accountController.login)
router.post('/password-forget', accountController.forgetPassword)
router.post('/password-reset', accountController.resetPassword)

router.use(userController.checkUserMiddleware)
router.patch('/email', userController.changeEmail)
router.patch('/password', userController.changePassword)
router.patch('/username', userController.changeUsername)

router
  .route('/')
  .get(userController.getUser)
  .patch(userController.updateUser)
  .delete(userController.deleteUser)

module.exports = router
