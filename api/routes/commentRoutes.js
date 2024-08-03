const express = require('express')
const authenticateToken = require('../middlewares/authMiddleware')
const router = express.Router()
const {
  addComment,
  getCommentsForPost,
  updateComment,
  deleteComment,
  getComments,
  likeComment,
} = require('../controllers/commentController')
const authorizeRole = require('../middlewares/roleMiddleware')

router.route('/').get(authenticateToken, authorizeRole('admin'), getComments)

router
  .route('/posts/:id')
  .get(authenticateToken, getCommentsForPost)
  .post(authenticateToken, addComment)

router
  .route('/:id')
  .put(authenticateToken, updateComment)
  .delete(authenticateToken, deleteComment)

router.route('/like/:id').post(authenticateToken, likeComment)

module.exports = router
