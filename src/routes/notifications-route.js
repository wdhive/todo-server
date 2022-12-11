const router = require('express').Router()
const { catchError } = require('req-error')
const [notificationController, accountController] = catchError(
  require('../controller/notification-controller'),
  require('../controller/account/account-controller')
)

router.use(accountController.checkAuth)

router
  .get('/', notificationController.getAll)
  .delete('/', notificationController.clearAll)

router.delete('/:id', notificationController.clearOne)

module.exports = router
