const express = require('express');
const app = express();
const port = 3000;
const path = require('path');
const mongoose = require('mongoose');
const ejsMate = require('ejs-mate');
const {campgroundValidation, reviewValidation} = require('./helpers/schemaValidation');
const catchAsync = require('./helpers/catchAsync');
const ExpressError = require('./helpers/expressError');
const methodOverride = require('method-override');
const Campground = require('./models/campground');
const Review = require('./models/review');
const campgrounds = require('./routes/campgrounds');
const reviews = require('./routes/reviews');


//test
mongoose.connect('mongodb://127.0.0.1:27017/yelp-camp', {
  useNewUrlParser: true,
  useUnifiedTopology: true
});

const db = mongoose.connection;
db.on("error", console.error.bind(console, "connection error:"));
db.once("open", () => {
    console.log("Database connected");
});

app.engine('ejs', ejsMate);
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

app.use(express.urlencoded({ extended: true }));
app.use(methodOverride('_method'));

app.use('/campgrounds', campgrounds);
app.use('/campgrounds', reviews);

app.get('/', (req, res) => {
  res.render('home')
})

app.all('*', (req, res, next) => {
  next(new ExpressError('Page not found', 404));
})

app.use((err, req, res, next) => {
  const {statusCode = 500} = err;
  if(!err.message) err.message = 'Something went wrong'
  res.status(statusCode).render('error', {err});
});

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
});
