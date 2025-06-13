const mongoose = require('mongoose');

const robotSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  description: {
    type: String,
    required: true
  },
  price: {
    type: Number,
    required: true
  },
  image: {
    type: String,
    required: true
  },
  specifications: {
    type: Object,
    required: true
  },
  category: {
    type: String,
    required: true
  }
});

const Robot = mongoose.model('Robot', robotSchema);
module.exports = Robot;