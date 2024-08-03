const mongoose = require('mongoose')

const PostSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    content: { type: String, required: true },
    slug: { type: String, default: 'how-become-mern-stack-developer' },
    category: { type: String, default: 'uncategorized' },
    author: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    isApproved: { type: Boolean, default: false },
    picture: { type: String, default: '/images/banner_blog.png' },
  },
  { timestamps: true }
)

const Post = mongoose.model('Post', PostSchema)

module.exports = Post
