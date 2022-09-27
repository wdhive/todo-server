const express = require('express')
const router = express.Router()
const [userController, accountController, settingsController] = ReqError.catch(
  require('../controller/account/user-controller'),
  require('../controller/account/account-controller'),
  require('../controller/account/settings-controller')
)

router.post('/request-email-verify', accountController.requestEmailVerify)
router.post(
  '/signup',
  accountController.verifyEmailOtpMiddleware,
  accountController.signup
)
router.post('/login', accountController.login)
router.post('/password-forget', accountController.forgetPassword)
router.post('/password-reset', accountController.resetPassword)

// Now every request needs to be logged in
router.use(accountController.checkAuthMiddleware)

router
  .route('/')
  .get(userController.getUser)
  .patch(userController.updateUser)
  .delete(
    accountController.checkPassAfterSignedinMiddleWare,
    userController.deleteUser
  )

router
  .route('/task-category')
  .post(
    settingsController.getSettingsMiddleware,
    settingsController.addTaskCategory
  )

router
  .route('/task-category/:categoryId')
  .all(
    settingsController.getSettingsMiddleware,
    settingsController.findAndSetTaskCategoryMiddleware
  )
  .patch(settingsController.updateTaskCategory)
  .delete(settingsController.deleteTaskCategory)

router
  .route('/change-theme')
  .patch(
    settingsController.getSettingsMiddleware,
    settingsController.changeTheme
  )

// Now every request needs to put his 'password' into the body
router.use(accountController.checkPassAfterSignedinMiddleWare)

router.patch('/change-password', accountController.changePassword)
router.patch('/change-username', accountController.changeUsername)
router.patch(
  '/change-email',
  accountController.verifyEmailOtpMiddleware,
  accountController.changeEmail
)

module.exports = router
