const express = require('express')
const { catchError } = require('req-error')

const router = express.Router()
const extraController = catchError(
  require('../controller/extra-things-controller')
)

router.get('/users-count', extraController.usersCount)

module.exports = router
