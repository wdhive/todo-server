const express = require('express')
const router = express.Router()
const extraController = ReqError.catch(
  require('../controller/extra-things-controller')
)

router.get('/users-count', extraController.usersCount)

module.exports = router
