const Post = require('../models/Post')
const errorHandler = require('../utils/errorHandler')

const getPosts = async (req, res, next) => {
  try {
    const { q, sort, page = 1, limit = 10 } = req.query
    const skip = (page - 1) * limit
    const sortDirection = sort === 'asc' ? 1 : -1

    const posts = await Post.find(
      q && {
        $or: [
          { title: { $regex: q, $options: 'i' } },
          { content: { $regex: q, $options: 'i' } },
        ],
      }
    )
      .sort({ createdAt: sortDirection })
      .populate('author', 'username')
      .skip(skip)
      .limit(parseInt(limit))

    const totalPosts = await Post.countDocuments()

    const now = new Date()

    const oneMonthAgo = new Date(
      now.getFullYear(),
      now.getMonth() - 1,
      now.getDate()
    )

    const lastMonthPost = await Post.countDocuments({
      createdAt: { $gte: oneMonthAgo },
    })

    res.status(200).json({
      success: true,
      lastMonthPost,
      totalPosts,
      totalPages: Math.ceil(totalPosts / limit),
      currentPage: parseInt(page),
      posts: posts,
    })
  } catch (error) {
    next(error)
  }
}

const getPost = async (req, res, next) => {
  try {
    const post = await Post.findById(req.params.id).populate(
      'author',
      'username'
    )
    if (!post) {
      return next(errorHandler(404, 'Post not found'))
    }
    res.status(200).json({ success: true, post: post })
  } catch (error) {
    next(error)
  }
}

const createPost = async (req, res, next) => {
  try {
    const { title, content, picture } = req.body

    const slug = title
      .split(' ')
      .join('-')
      .toLowerCase()
      .replace(/[^a-zA-Z0-9-]/g, '-')

    const post = await Post.create({
      title,
      content,
      slug: slug,
      picture,
      author: req.user.id,
    })

    res.status(201).json({ success: true, post: post })
  } catch (error) {
    next(error)
  }
}

const updatePost = async (req, res, next) => {
  try {
    let post = await Post.findById(req.params.id)

    if (!post) {
      return next(errorHandler(404, 'Post not found'))
    }

    if (post.author.toString() !== req.user.id) {
      return next(errorHandler(403, 'Not authorized'))
    }

    const { title, content, picture } = req.body
    const slug = title
      .split(' ')
      .join('-')
      .toLowerCase()
      .replace(/[^a-zA-Z0-9-]/g, '-')

    post = await Post.findByIdAndUpdate(
      req.params.id,
      { title, content, picture },
      { new: true }
    )

    res.status(200).json({ success: true, post: post })
  } catch (error) {
    next(error)
  }
}

const approvePost = async (req, res, next) => {
  try {
    const post = await Post.findById(req.params.id)
    if (!post) {
      return next(errorHandler(404, 'Post not found'))
    }
    post.isApproved = true
    await post.save()
    res.status(200).json({ success: true, post: post })
  } catch (error) {
    next(errorHandler(500, error.message))
  }
}

const deletePost = async (req, res, next) => {
  try {
    let post = await Post.findById(req.params.id)

    if (!post) {
      return next(errorHandler(404, 'Post not found'))
    }

    if (post.author.toString() !== req.user.id) {
      return next(errorHandler(403, 'Not authorized'))
    }

    await Post.findByIdAndDelete(req.params.id)

    res
      .status(200)
      .json({ success: true, message: 'Post deleted successfully' })
  } catch (error) {
    next(error)
  }
}

module.exports = {
  getPosts,
  getPost,
  createPost,
  updatePost,
  deletePost,
  approvePost,
}
