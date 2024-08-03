const mongoose = require('mongoose')

const CommentSchema = new mongoose.Schema(
  {
    content: { type: String, required: true },
    author: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    post: { type: mongoose.Schema.Types.ObjectId, ref: 'Post' },
    likes: [{ type: String }],
    numberOfLikes: { type: Number, default: 0 },
  },
  { timestamps: true }
)

module.exports = mongoose.model('Comment', CommentSchema)
