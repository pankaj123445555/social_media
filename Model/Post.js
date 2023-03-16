const mongoose = require('mongoose');
const {user} = require('./User');

const postSchema = new mongoose.Schema({
    title: String,
    description: String,
     user :  { type: [mongoose.Schema.Types.ObjectId], ref: 'User' },
    likes: [String],
    comments: [{
      author: String,
      text: String,
    }],
    createdAt: {
        type: Date,
        default: Date.now
      }
  });
 
const Post = mongoose.model('Post',postSchema);
module.exports = {Post};
  