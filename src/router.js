const express = require('express')
const router = express.Router()
const accountRoute = require('./routes/account-route')

router.use('/account', accountRoute)

module.exports = router
