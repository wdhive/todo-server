const express = require('express')
const router = express.Router()
const [
  accountController,
  taskController,
  categoryController,
  participantController,
  taskSearchHandler,
] = ReqError.catch(
  require('../controller/account/account-controller'),
  require('../controller/tasks/task-controller'),
  require('../controller/tasks/category-controller'),
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
  .all(taskController.setTaskFromActiveUsers)
  .patch(taskController.updateTask, taskController.saveAndSendTask)
  .delete(taskController.deleteTask)

router.post('/:taskId/category', categoryController.addCategory)
router.delete('/:taskId/category/:categoryId', categoryController.removeCategory)

// Task Participant
router.use('/:taskId/*', taskController.setTaskFromInactiveUsers)
router.post(
  '/:taskId/invitation-accept',
  participantController.acceptUser,
  taskController.saveAndSendTask
)

router.use(taskController.onlyForOwner)
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
