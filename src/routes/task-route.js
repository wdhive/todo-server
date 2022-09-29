const express = require('express')
const router = express.Router()
const [
  accountController,
  taskController,
  participantController,
  taskSearchHandler,
] = ReqError.catch(
  require('../controller/account/account-controller'),
  require('../controller/tasks/task-controller'),
  require('../controller/tasks/participant-controller'),
  require('../controller/tasks/tasks-search-handler')
)

router.use(accountController.checkAuth)

router.route('/').get(taskController.getAllTask).post(taskController.createTask)

router.get('/search', taskSearchHandler)

router
  .route('/:taskId')
  .all(taskController.setTaskParticipants)
  .patch(taskController.updateTask)
  .delete(taskController.deleteTask)

router.post('/:taskId/category', taskController.addCategory)
router.delete('/:taskId/category/:categoryId', taskController.removeCategory)

router
  .route('/:taskId/participants')
  .all(taskController.setTaskParticipants, taskController.restrictedToOwner)
  .post(participantController.inviteUser)

router
  .route('/:taskId/participants/:userId')
  .all(taskController.setTaskParticipants, taskController.restrictedToOwner)
  .delete(participantController.removeUser)
  .patch(participantController.changeRole)

router
  .route('/:taskId/participant-accept')
  .post(taskController.setTaskParticipants, participantController.acceptUser)

module.exports = router
