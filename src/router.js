const express = require('express')
const router = express.Router()
const accountRoute = require('./routes/account-route')
const taskRoute = require('./routes/task-route')

router.use('/account', accountRoute)
router.use('/tasks', taskRoute)

module.exports = router
