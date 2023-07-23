const express = require('express');
const router = express.Router();
const catchAsync = require('../helpers/catchAsync');
const {reviewValidation} = require('../helpers/schemaValidation');
const Review = require('../models/review');
const Campground = require('../models/campground');

router.post('/:id/reviews', reviewValidation ,catchAsync(async(req, res) => {
  const campground = await Campground.findById(req.params.id);
  const review = new Review(req.body.review);
  campground.reviews.push(review);
  await review.save();
  await campground.save();
  req.flash('success', 'review created succesfully!');
  res.redirect(`/campgrounds/${campground._id}`)
}))

router.delete('/:id/reviews/:reviewId', catchAsync(async (req, res) => {
  const { id, reviewId } = req.params;
  await Campground.findByIdAndUpdate(id, {$pull: {reviews: reviewId}});
  await Review.findByIdAndDelete(reviewId);
  req.flash('success', 'review deleted succesfully!');
  res.redirect(`/campgrounds/${id}`);
}))

module.exports = router;
