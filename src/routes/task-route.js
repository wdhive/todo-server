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

router.patch(
  '/:taskId/complete',
  taskController.setTaskFromActiveUsers,
  taskController.completeTask,
  taskController.saveAndSendTask
)

router.patch(
  '/:taskId/uncomplete',
  taskController.setTaskFromActiveUsers,
  taskController.unCompleteTask,
  taskController.saveAndSendTask
)

router.post('/:taskId/category', categoryController.addCategory)
router.delete(
  '/:taskId/category/:categoryId',
  categoryController.removeCategory
)

// Task Participant CRUD
router.use('/:taskId/*', taskController.setTaskFromInactiveUsers)
router.post(
  '/:taskId/invitation-accept',
  participantController.acceptUser,
  taskController.saveAndSendTask
)

router.use(taskController.onlyForOwner)
router.post('/:taskId/participants', participantController.inviteUser)
router
  .route('/:taskId/participants/:userId')
  .delete(participantController.removeUser, taskController.saveAndSendTask)
  .patch(participantController.changeRole, taskController.saveAndSendTask)

module.exports = router
