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

router.use(accountController.checkAuth)

router
  .route('/')
  .get(userController.getUser)
  .patch(userController.updateUser)
  .delete(
    accountController.checkPassAfterLoggedIn,
    userController.deleteUser
  )

router.get('/search', usersSearchHandler)

router
  .route('/task-category')
  .post(
    settingsController.setSettings,
    settingsController.addTaskCategory
  )

router
  .route('/task-category/:categoryId')
  .all(
    settingsController.setSettings,
    settingsController.setTaskCategory
  )
  .patch(settingsController.updateTaskCategory)
  .delete(settingsController.deleteTaskCategory)

router
  .route('/change-theme')
  .patch(
    settingsController.setSettings,
    settingsController.changeTheme
  )

module.exports = router
