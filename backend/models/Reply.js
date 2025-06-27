const mongoose = require('mongoose');

const ReplySchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'UserAuth', required: true },
  userFullName: { type: String, required: true },
  comment: { type: mongoose.Schema.Types.ObjectId, ref: 'Comment', required: true },
  text: { type: String, required: true, maxlength: 500 },
  likes: { type: Number, default: 0 }
}, { timestamps: true });

module.exports = mongoose.model('Reply', ReplySchema);