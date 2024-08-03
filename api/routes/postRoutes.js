const express = require('express')
const authenticateToken = require('../middlewares/authMiddleware')
const router = express.Router()
const {
  getPosts,
  getPost,
  createPost,
  updatePost,
  deletePost,
  approvePost,
} = require('../controllers/postController')
const authorizeRole = require('../middlewares/roleMiddleware')

router.route('/').get(getPosts).post(authenticateToken, createPost)

router
  .route('/:id')
  .get(getPost)
  .put(authenticateToken, updatePost)
  .delete(authenticateToken, deletePost)

router.post(
  '/approve/:id',
  authenticateToken,
  authorizeRole('admin'),
  approvePost
)

module.exports = router
