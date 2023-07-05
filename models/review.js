const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const ReviewSechema = new Schema({
  rating: number,
  body: string
});

module.exports = mongoose.model('Review', ReviewSechema);
