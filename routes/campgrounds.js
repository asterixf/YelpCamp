const express = require('express');
const router = express.Router();
const catchAsync = require('../helpers/catchAsync');
const {campgroundValidation} = require('../helpers/schemaValidation');
const Campground = require('../models/campground');
const {isLoggedIn} = require('../helpers/isLoggedIn');

router.get('/', catchAsync(async (req, res) => {
  const campgrounds = await Campground.find({});
  res.render('campgrounds/index', {campgrounds})
}))

router.get('/new', isLoggedIn,(req, res) => {
  res.render('campgrounds/new');
})

router.post('/', isLoggedIn, campgroundValidation ,catchAsync(async (req, res, next) => {
  // if (!req.body.campground) throw new ExpressError('Invalid Campground Data', 400);
  const campground = new Campground(req.body.campground);
  await campground.save();
  req.flash('success', 'campgrouns created succesfully!');
  res.redirect(`/campgrounds/${campground._id}`);
}))

router.get('/:id',catchAsync(async (req, res) => {
  const { id } = req.params;
  const campground = await Campground.findById(id).populate('reviews');
  if(!campground){
    req.flash('error','Campground not found!');
    return res.redirect('/campgrounds');
  }
  res.render('campgrounds/show', {campground});
}))

router.get('/:id/edit', isLoggedIn, catchAsync(async (req, res) => {
  const { id } = req.params;
  const campground = await Campground.findById(id);
  if(!campground){
    req.flash('error','Campground not found!');
    return res.redirect('/campgrounds');
  }
  res.render('campgrounds/edit', {campground});
}))

router.put('/:id', isLoggedIn, campgroundValidation ,catchAsync(async (req, res) => {
  const { id } = req.params;
  const campground = await Campground.findByIdAndUpdate(id, {...req.body.campground});
  req.flash('success', 'campground updated!');
  res.redirect(`/campgrounds/${campground._id}`);
}))

router.delete('/:id', catchAsync(async (req, res) => {
  const { id } = req.params;
  await Campground.findByIdAndDelete(id);
  req.flash('success', 'Campground deleted!');
  res.redirect('/campgrounds');
}))

module.exports = router;
