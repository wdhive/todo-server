const express = require('express')
const router = express.Router()
const [
  accountController,
  userController,
  settingsController,
  usersSearchHandler,
] = ReqError.catch(
  require('../controller/account/account-controller'),
  require('../controller/user/user-controller'),
  require('../controller/user/settings-controller'),
  require('../controller/user/users-search-handler')
)

router.use(accountController.checkAuthMiddleware)

router
  .route('/')
  .get(userController.getUser)
  .patch(userController.updateUser)
  .delete(
    accountController.checkPassAfterSignedinMiddleWare,
    userController.deleteUser
  )

router.get('/search', usersSearchHandler)

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

module.exports = router
