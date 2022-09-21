const express = require('express')
const router = express.Router()
const [crudTaskController, accountController] = ReqError.wrapper(
  require('../controller/tasks/crud-task-controller'),
  require('../controller/account/account-controller')
)
router.use(accountController.checkUserMiddleware)

module.exports = router
