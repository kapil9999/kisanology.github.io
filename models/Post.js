const mongoose = require('mongoose');

const postSchema = new mongoose.Schema({
  question: {
    type: String,
    required: true
  },
  answers: [{
        answer: {
            type: String,
            required: true
        },
        user: {
            type: String,
            required: true
        }
    }
  ],
  created_at: {
    type: Date,
    default: Date.now
  }
});


module.exports =  mongoose.model('Post', postSchema);

