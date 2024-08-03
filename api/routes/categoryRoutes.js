const express = require('express')
const router = express.Router()
const authenticateToken = require('../middlewares/authMiddleware')
const authorizeRole = require('../middlewares/roleMiddleware')
const {
  deleteCategory,
  updateCategory,
  addCategory,
  getCategories,
} = require('../controllers/categoryController')

router
  .route('/')
  .get(getCategories)
  .post(authenticateToken, authorizeRole('admin'), addCategory)

router
  .route('/:id')
  .put(authenticateToken, authorizeRole('admin'), updateCategory)
  .delete(authenticateToken, authorizeRole('admin'), deleteCategory)

module.exports = router
