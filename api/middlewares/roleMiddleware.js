const User = require('../models/User')
const authenticateToken = require('./authMiddleware')
const errorHandler = require('../utils/errorHandler')

const authorizeRole = (role) => {
  return async (req, res, next) => {
    const user = await User.findById(req.user.id)
    if (user.role === role) {
      return next()
    }
    return next(
      errorHandler(403, 'Forbidden: You do not have the required role')
    )
  }
}

module.exports = authorizeRole
