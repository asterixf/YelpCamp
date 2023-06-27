const Joi = require('joi')

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
