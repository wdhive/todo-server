const express = require('express')
const router = express.Router()
const accountRoute = require('./routes/account-route')
const taskRoute = require('./routes/task-route')
const userRoute = require('./routes/user-route')
const extraRoute = require('./routes/extra-things-route')

router.use('/account', accountRoute)
router.use('/tasks', taskRoute)
router.use('/user', userRoute)
router.use('/extra', extraRoute)

module.exports = router
