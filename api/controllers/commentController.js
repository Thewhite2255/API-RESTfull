const Comment = require('../models/Comment')
const errorHandler = require('../utils/errorHandler')

const addComment = async (req, res, next) => {
  try {
    const { content } = req.body
    const comment = await Comment.create({
      content,
      author: req.user.id,
      post: req.params.id,
    })
    res.status(201).json({ success: true, comment: comment })
  } catch (error) {
    next(error)
  }
}

const getComments = async (req, res, next) => {
  try {
    const { q, sort, page = 1, limit = 10 } = req.query
    const skip = (page - 1) * limit
    const sortDirection = sort === 'asc' ? 1 : -1

    const comments = await Comment.find(
      q && {
        $or: [
          { content: { $regex: q, $options: 'i' } },
          { author: { $regex: q, $options: 'i' } },
        ],
      }
    )
      .sort({ createdAt: sortDirection })
      .populate('author', ['username', 'email'])
      .skip(skip)
      .limit(parseInt(limit))

    const totalComments = await Comment.countDocuments()

    const now = new Date()

    const oneMonthAgo = new Date(
      now.getFullYear(),
      now.getMonth() - 1,
      now.getDate()
    )

    const lastMonthComment = await Comment.countDocuments({
      createdAt: { $gte: oneMonthAgo },
    })

    const commentsWithoutPassword = comments.map((comment) => {
      const { password, ...rest } = comment._doc

      return rest
    })

    res.status(200).json({
      success: true,
      lastMonthComment,
      totalComments,
      totalPages: Math.ceil(totalComments / limit),
      currentPage: parseInt(page),
      comments: commentsWithoutPassword,
    })
  } catch (error) {
    next(error)
  }
}

const getCommentsForPost = async (req, res, next) => {
  try {
    const comments = await Comment.find({ comment: req.params.id })
      .sort({ createdAt: -1 })
      .populate('author', ['username', 'email'])
    res.status(200).json({ success: true, comments: comments })
  } catch (error) {
    next(error)
  }
}

const updateComment = async (req, res, next) => {
  try {
    let comment = await Comment.findById(req.params.id)

    if (!comment) {
      return next(errorHandler(404, 'Comment not found'))
    }

    if (comment.author.toString() !== req.comment.id) {
      return next(errorHandler(403, 'Not authorized'))
    }

    const { content } = req.body

    comment = await Comment.findByIdAndUpdate(
      req.params.id,
      { content },
      { new: true }
    )

    res.status(200).json({ success: true, comment: comment })
  } catch (error) {
    next(error)
  }
}

const deleteComment = async (req, res, next) => {
  try {
    let comment = await Comment.findById(req.params.id)

    if (!comment) {
      return next(errorHandler(404, 'Comment not found'))
    }

    if (comment.author.toString() !== req.comment.id) {
      return next(errorHandler(403, 'Not authorized'))
    }

    await Comment.findByIdAndDelete(req.params.id)

    res
      .status(200)
      .json({ success: true, message: 'Comment deleted successfully' })
  } catch (error) {
    next(error)
  }
}

const likeComment = async (req, res, next) => {
  try {
    let comment = await Comment.findById(req.params.id)

    if (!comment) {
      return next(errorHandler(404, 'Comment not found'))
    }

    let userIndex = comment.likes.indexOf(req.user.id)

    console.log(userIndex)

    if (userIndex === -1) {
      comment.numberOfLikes++
      comment.likes.push(req.user.id)
    } else {
      comment.numberOfLikes--
      comment.likes.splice(userIndex, 1)
    }

    await comment.save()

    res.status(200).json({
      success: true,
      message: 'Comment liked successfully',
      comment: comment,
    })
  } catch (error) {
    next(error)
  }
}

module.exports = {
  addComment,
  getComments,
  getCommentsForPost,
  updateComment,
  deleteComment,
  likeComment,
}
