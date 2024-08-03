const Category = require('../models/Category')
const errorHandler = require('../utils/errorHandler')

const getCategories = async (req, res, next) => {
  try {
    const categories = await Category.find().sort({ createdAt: -1 })
    res.status(200).json({ success: true, categories: categories })
  } catch (error) {
    next(error)
  }
}

const addCategory = async (req, res, next) => {
  try {
    const { name } = req.body
    const category = await Category.create({ name })
    res.status(201).json({ success: true, category: category })
  } catch (error) {
    next(error)
  }
}

const updateCategory = async (req, res, next) => {
  try {
    const { name } = req.body
    const category = await Category.findByIdAndUpdate(
      req.params.id,
      { name },
      { new: true }
    )
    if (!category) {
      return next(errorHandler(404, 'Category not found'))
    }
    res.status(200).json(category)
  } catch (error) {
    next(error)
  }
}

const deleteCategory = async (req, res, next) => {
  try {
    const category = await Category.findByIdAndDelete(req.params.id)
    if (!category) {
      return next(errorHandler(404, 'Category not found'))
    }
    res.status(200).json({ message: 'Category deleted successfully' })
  } catch (error) {
    next(error)
  }
}

module.exports = {
  getCategories,
  addCategory,
  updateCategory,
  deleteCategory,
}
