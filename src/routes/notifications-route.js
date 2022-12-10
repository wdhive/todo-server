const router = require('express').Router()
const notificationController = require('../controller/notification-controller')

router
  .get('/', notificationController.getAll)
  .delete('/', notificationController.clearAll)

router.delete('/:id', notificationController.clearOne)

module.exports = router
