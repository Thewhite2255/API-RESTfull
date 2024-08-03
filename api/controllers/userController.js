const User = require('../models/User')
const bcrypt = require('bcryptjs')
const errorHandler = require('../utils/errorHandler')

const getUsers = async (req, res, next) => {
  try {
    const { q, sort, page = 1, limit = 10 } = req.query
    const skip = (page - 1) * limit
    const sortDirection = sort === 'asc' ? 1 : -1
    let filter

    const users = await User.find(
      q && {
        $or: [
          { email: { $regex: q, $options: 'i' } },
          { username: { $regex: q, $options: 'i' } },
        ],
      }
    )
      .sort({ createdAt: sortDirection })
      .skip(skip)
      .limit(parseInt(limit))

    const totalUsers = await User.countDocuments()

    const now = new Date()

    const oneMonthAgo = new Date(
      now.getFullYear(),
      now.getMonth() - 1,
      now.getDate()
    )

    const lastMonthUser = await User.countDocuments({
      createdAt: { $gte: oneMonthAgo },
    })

    const usersWithoutPassword = users.map((user) => {
      const { password, ...rest } = user._doc

      return rest
    })

    res.status(200).json({
      success: true,
      lastMonthUser,
      totalUsers,
      totalPages: Math.ceil(totalUsers / limit),
      currentPage: parseInt(page),
      users: usersWithoutPassword,
    })
  } catch (error) {
    next(error)
  }
}

const getUser = async (req, res, next) => {
  try {
    const user = await User.findById(req.params.id)
    if (!user) {
      return next(errorHandler(404, 'User not found'))
    }
    res.status(200).json({
      success: true,
      user: user,
    })
  } catch (error) {
    next(error)
  }
}

const getProfile = async (req, res, next) => {
  try {
    const user = await User.findById(req.user.id)
    if (!user) {
      return next(errorHandler(404, 'User not found'))
    }
    res.status(200).json({
      success: true,
      user: user,
    })
  } catch (error) {
    next(error)
  }
}

const updateProfile = async (req, res, next) => {
  try {
    const { username, name, email, password, confirmPassword } = req.body
    let hashedPassword

    if (password) {
      if (confirmPassword !== password) {
        return next(errorHandler(400, 'Password not match'))
      } else {
        const salt = await bcrypt.genSalt(10)
        hashedPassword = await bcrypt.hash(password, salt)
      }
    }

    const user = await User.findByIdAndUpdate(
      req.user.id,
      { username, name, email, password: hashedPassword },
      { new: true }
    )
    if (!user) {
      return next(errorHandler(404, 'User not found'))
    }
    res.status(200).json({
      success: true,
      user: user,
    })
  } catch (error) {
    next(error)
  }
}

const promoteUser = async (req, res, next) => {
  try {
    const user = await User.findById(req.params.id)
    if (!user) {
      return next(errorHandler(404, 'User not found'))
    }
    user.role = 'admin'
    await user.save()
    res.status(200).json({
      success: true,
      user: user,
    })
  } catch (error) {
    next(errorHandler(500, error.message))
  }
}

const deleteUser = async (req, res, next) => {
  try {
    let user = await User.findById(req.params.id)

    if (!user) {
      return next(errorHandler(404, 'User not found'))
    }

    await User.findByIdAndDelete(req.params.id)

    res
      .status(200)
      .json({ success: true, message: 'User deleted successfully' })
  } catch (error) {
    next(error)
  }
}

module.exports = {
  getUsers,
  getUser,
  getProfile,
  updateProfile,
  deleteUser,
  promoteUser,
}
