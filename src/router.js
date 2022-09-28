const express = require('express')
const router = express.Router()
const accountRoute = require('./routes/account-route')
const taskRoute = require('./routes/task-route')
const userRoute = require('./routes/user-route')

router.use('/account', accountRoute)
router.use('/tasks', taskRoute)
router.use('/user', userRoute)

module.exports = router
