const express = require('express')
const router = express.Router()
const authenticateToken = require('../middlewares/authMiddleware')
const {
  getProfile,
  updateProfile,
  getUsers,
  promoteUser,
  deleteUser,
} = require('../controllers/userController')
const authorizeRole = require('../middlewares/roleMiddleware')

router.route('/').get(authenticateToken, authorizeRole('admin'), getUsers)

router
  .route('/:id')
  .delete(authenticateToken, authorizeRole('admin'), deleteUser)

router
  .route('/profile')
  .get(authenticateToken, getProfile)
  .put(authenticateToken, updateProfile)

router.post(
  '/promote/:id',
  authenticateToken,
  authorizeRole('admin'),
  promoteUser
)

module.exports = router
