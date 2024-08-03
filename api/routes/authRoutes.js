const express = require('express')
const {
  register,
  login,
  logout,
  googleCallBack,
  googleOauth,
} = require('../controllers/authController')

const router = express.Router()

router.post('/register', register)
router.post('/login', login)
router.post('/logout', logout)
router.post('/google/callback', googleCallBack)
router.get('/google/', googleOauth)

module.exports = router
