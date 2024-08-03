const jwt = require('jsonwebtoken')
const errorHandler = require('../utils/errorHandler')

const authenticateToken = (req, res, next) => {
  const token = req.cookies.access_token

  if (!token) {
    return next(errorHandler(401, 'Not authorized, no token'))
  }

  jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
    if (err) {
      return next(errorHandler(403, 'Not authorized, Invalid or expired token'))
    }
    req.user = user
    next()
  })
}

module.exports = authenticateToken
