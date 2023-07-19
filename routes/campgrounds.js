const express = require('express');
const router = express.Router();
const catchAsync = require('../helpers/catchAsync');
const {campgroundValidation} = require('../helpers/schemaValidation');
const Campground = require('../models/campground');

router.get('/', catchAsync(async (req, res) => {
  const campgrounds = await Campground.find({});
  res.render('campgrounds/index', {campgrounds})
}))

router.get('/new', (req, res) => {
  res.render('campgrounds/new');
})

router.post('/', campgroundValidation ,catchAsync(async (req, res, next) => {
  // if (!req.body.campground) throw new ExpressError('Invalid Campground Data', 400);
  const campground = new Campground(req.body.campground);
  await campground.save();
  res.redirect(`/campgrounds/${campground._id}`);
}))

router.get('/:id', catchAsync(async (req, res) => {
  const { id } = req.params;
  const campground = await Campground.findById(id).populate('reviews');
  res.render('campgrounds/show', {campground});
}))

router.get('/:id/edit', catchAsync(async (req, res) => {
  const { id } = req.params;
  const campground = await Campground.findById(id);
  res.render('campgrounds/edit', {campground});
}))

router.put('/:id', campgroundValidation ,catchAsync(async (req, res) => {
  const { id } = req.params;
  const campground = await Campground.findByIdAndUpdate(id, {...req.body.campground});
  res.redirect(`/campgrounds/${campground._id}`);
}))

router.delete('/:id', catchAsync(async (req, res) => {
  const { id } = req.params;
  await Campground.findByIdAndDelete(id);
  res.redirect('/campgrounds');
}))

module.exports = router;
