const express = require('express')
const router = express.Router()
const [accountController, crudTaskController] = ReqError.catch(
  require('../controller/account/account-controller'),
  require('../controller/tasks/crud-task-controller')
)

router.use(accountController.checkAuthMiddleware)

router
  .route('/')
  .get(crudTaskController.getAllTask)
  .post(crudTaskController.createTask)

router
  .route('/:taskId')
  .patch(
    crudTaskController.setTaskParticipantsMiddleWare,
    crudTaskController.updateTask
  )
  .delete(
    crudTaskController.setTaskParticipantsMiddleWare,
    crudTaskController.deleteTask
  )

module.exports = router
