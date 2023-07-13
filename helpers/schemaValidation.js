const Joi = require('joi')
const ExpressError = require('./expressError.js')

module.exports.campgroundValidation = (req, res, next) => {
  const campgroundSchema = Joi.object({
    campground: Joi.object({
      title: Joi.string().required(),
      location: Joi.string().required(),
      image: Joi.string().required(),
      price: Joi.number().required().min(0),
      description: Joi.string().required()
    }).required()
  })
  const {error} = campgroundSchema.validate(req.body);
  if (error) {
    const mesage = error.details.map(el => el.message).join(',')
    throw new ExpressError(mesage, 400)
  }  else {
    next();
  }
}

module.exports.reviewValidation = (req, res, next) => {
  const reviewSchema = Joi.object( {
    review : Joi.object({
      rating: Joi.number().required().min(1).max(5),
      body: Joi.string().required()
    }).required()
  })
  const {error} = reviewSchema.validate(req.body);
  if (error) {
    const mesage = error.details.map(el => el.message).join(',')
    throw new ExpressError(mesage, 400)
  }  else {
    next();
  }
}
