const router = require('express').Router()
const { catchError } = require('req-error')

const extraController = catchError(
  require('../controller/extra-things-controller')
)

router.get('/users-count', extraController.usersCount)

module.exports = router
