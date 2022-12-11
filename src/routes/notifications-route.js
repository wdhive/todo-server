const router = require('express').Router()
const { catchError } = require('req-error')
const [notificationController, accountController, taskController] = catchError(
  require('../controller/notification-controller'),
  require('../controller/account/account-controller'),
  require('../controller/tasks/task-controller')
)

router.use(accountController.checkAuth)

router
  .get('/', notificationController.getAll)
  .delete('/', notificationController.clearAll)

router.delete(
  '/:id',
  notificationController.clearOne,
  taskController.saveAndSendTask
)

module.exports = router
