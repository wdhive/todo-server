const express = require('express')
const file = require('../file')
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

router.get('/new-token', accountController.sendJwt)

router
  .route('/')
  .get(userController.getUser)
  .patch(file.fileMiddleware, userController.updateUser)
  .delete(accountController.checkPassAfterLoggedIn, userController.deleteUser)

router.get('/search', usersSearchHandler)

router
  .route('/collections')
  .post(settingsController.setSettings, settingsController.createTaskCollection)

router
  .route('/collections/:collection')
  .all(settingsController.setSettings, settingsController.setTaskCollection)
  .patch(settingsController.updateTaskCollection)
  .delete(settingsController.deleteTaskCollection)

router
  .route('/change-theme')
  .patch(settingsController.setSettings, settingsController.changeTheme)

module.exports = router
