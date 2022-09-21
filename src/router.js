const express = require('express')
const router = express.Router()
const accountRoute = require('./routes/account-route')
const tasksRoute = require('./routes/tasks-route')

router.use('/account', accountRoute)
router.use('/tasks', tasksRoute)

module.exports = router
