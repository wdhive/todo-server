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
router.get('/search', taskSearchHandler)

// Task CRUD
router
  .route('/')
  .get(taskController.getAllTask)
  .post(taskController.createTask, taskController.saveAndSendTask)

router
  .route('/:taskId')
  .all(taskController.setTaskActiveParticipants)
  .patch(taskController.updateTask, taskController.saveAndSendTask)
  .delete(taskController.deleteTask)

router.post('/:taskId/category', taskController.addCategory)
router.delete('/:taskId/category/:categoryId', taskController.removeCategory)

// Task Participant
router.use('/:taskId/*', taskController.setTaskAllParticipants)
router.post(
  '/:taskId/invitation-accept',
  participantController.acceptUser,
  taskController.saveAndSendTask
)

router.use(taskController.restrictedToOwner)
router.post(
  '/:taskId/participants',
  participantController.inviteUser,
  taskController.saveAndSendTask
)
router
  .route('/:taskId/participants/:userId')
  .delete(participantController.removeUser, taskController.saveAndSendTask)
  .patch(participantController.changeRole, taskController.saveAndSendTask)

module.exports = router
