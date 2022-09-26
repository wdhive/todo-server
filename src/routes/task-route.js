const express = require('express')
const router = express.Router()
const [accountController, taskController] = ReqError.catch(
  require('../controller/account/account-controller'),
  require('../controller/tasks/task-controller')
)

router.use(accountController.checkAuthMiddleware)

router.route('/').get(taskController.getAllTask).post(taskController.createTask)

router
  .route('/:taskId')
  .all(taskController.setTaskParticipantsMiddleWare)
  .patch(taskController.updateTask)
  .delete(taskController.deleteTask)

router
  .route('/:taskId/category')
  .post(taskController.addCategory)
  .delete(taskController.removeCategory)

module.exports = router
