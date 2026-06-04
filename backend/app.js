var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
const session = require('express-session');
const MongoStore = require('connect-mongo');
const passport = require('passport');
const mongoose = require('mongoose');
require('dotenv').config();
require('./config/passport');
const cors = require('cors');
// your protected OpenAI proxy route
// Ensure JWT_SECRET is set
if (!process.env.JWT_SECRET) {
  console.error('❌ JWT_SECRET environment variable is required');
  process.exit(1);
}

// Ensure SESSION_SECRET is set for OAuth flow
if (!process.env.SESSION_SECRET && !process.env.JWT_SECRET) {
  console.error('❌ SESSION_SECRET or JWT_SECRET environment variable is required');
  process.exit(1);
}

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/user');
var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

// --- CORS (must be first) ---
const allowedOrigins = [
  ...new Set([
    'https://careerbeacon.guidopia.com',
    
    ...(process.env.CORS_ORIGINS || process.env.ALLOWED_ORIGINS || '')
      .split(',')
      .map((s) => s.trim())
      .filter(Boolean),
  ]),
];

app.use(
  cors({
    origin: allowedOrigins,
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS', 'PATCH'],
    allowedHeaders: [
      'Content-Type',
      'Authorization',
      'X-Requested-With',
      'x-admin-key',
      'Accept',
      'Origin',
      'Cache-Control',
      'Pragma',
    ],
  })
);

// Now add other middleware
app.use(logger('dev'));
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

mongoose.connect(process.env.MONGO_URI)
  .then(() => {
    console.log('✅ Connected to MongoDB');
  })
  .catch((err) => {
    console.error('❌ MongoDB connection error:', err);
    process.exit(1); // Stop the server if DB connection fails
  });


// Debug middleware to log request info
// Session configuration for OAuth flow only
app.use(session({
  secret: process.env.SESSION_SECRET || process.env.JWT_SECRET,
  resave: false,
  saveUninitialized: false,
  cookie: {
    // Use secure cookies in production, but allow http for development
    secure: process.env.NODE_ENV === 'production',
    // sameSite: 'lax' is a good default for security. Use 'none' if you need cross-site cookie sharing.
    sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax',
    sameSite: 'none',
    secure: true,
    httpOnly: true,
    maxAge: 10 * 365 * 24 * 60 * 60 * 1000 // 10 years in milliseconds
  },
  name: 'guidopia.sid' // Custom session name
  ,
  store: MongoStore.create({
    mongoUrl: process.env.MONGO_URI,
    collectionName: 'sessions'
  })}));
app.use(passport.initialize());
app.use(passport.session());

app.use((req, res, next) => {
  console.log('📝 Request to:', req.method, req.path);
  console.log('📝 Origin:', req.headers.origin);
  console.log('📝 Authorization header:', req.headers.authorization ? 'Present' : 'Missing');
  console.log('📝 Admin key header:', req.headers['x-admin-key'] ? 'Present' : 'Missing');
  next();
});

// Routes
app.use('/', indexRouter);
app.use('/users', usersRouter);
app.use('/auth', require('./routes/auth'));
const userRoutes = require('./routes/user');
const futuremeRoutes = require('./routes/futureme');
app.use('/api/user', userRoutes);
app.use('/api/futureme', futuremeRoutes);
const onboardingRoutes = require('./routes/onboarding');
app.use('/api/onboarding', onboardingRoutes);
const assessmentRoutes = require('./routes/assessment');
app.use('/api/assessment', assessmentRoutes);
const futureMeStepperRouter = require('./routes/futureMeStepper');
app.use('/api/futureme-stepper', futureMeStepperRouter);
const purchasesRouter = require('./routes/purchases');
app.use('/api/purchases', purchasesRouter);
const adminRouter = require('./routes/admin');
app.use('/api/admin', adminRouter);
const openaiRouter = require('./routes/openai');
app.use('/api/openai', openaiRouter);
const perplexityRouter = require('./routes/perplexity');
app.use('/api/perplexity', perplexityRouter);
const analyticsRouter = require('./routes/analytics');
app.use('/api/analytics', analyticsRouter);




// catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(createError(404));
});

// error handler
app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;