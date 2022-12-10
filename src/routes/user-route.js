const router = require('express').Router()
const { catchError } = require('req-error')
const file = require('../file')

const [
  accountController,
  userController,
  settingsController,
  usersSearchHandler,
] = catchError(
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
  .route('/settings')
  .patch(settingsController.setSettings, settingsController.updateSettings)

module.exports = router
