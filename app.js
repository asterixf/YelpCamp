const express = require('express');
const app = express();
const port = 3000;
const path = require('path');
const mongoose = require('mongoose');
const ejsMate = require('ejs-mate');
const session = require('express-session');
const ExpressError = require('./helpers/expressError');
const methodOverride = require('method-override');
const flash = require('connect-flash');
const campgroundRoutes = require('./routes/campgrounds');
const reviewRoutes = require('./routes/reviews');
const userRoutes = require('./routes/users');
const passport = require('passport');
const localSatrategy = require('passport-local');
const User = require('./models/user');


//test db connection
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
app.use(express.static(path.join(__dirname,'public')));

const sessionConfig = {
  secret: 'deveEnvSecret',
  resave: false,
  saveUninitialized: true,
  cookie: {
    httpOnly: true,
    expires: Date.now() + 1000 * 60 * 60 * 24 * 7,
    maxAge:1000 * 60 * 60 * 24 * 7
  }
}
app.use(session(sessionConfig))
app.use(flash());

app.use(passport.initialize());
app.use(passport.session());

passport.use(new localSatrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use((req, res, next) => {
  res.locals.currentUser = req.user;
  res.locals.success = req.flash('success');
  res.locals.error = req.flash('error');
  next();
})

app.use('/campgrounds', campgroundRoutes);
app.use('/campgrounds', reviewRoutes);
app.use('/', userRoutes);

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
