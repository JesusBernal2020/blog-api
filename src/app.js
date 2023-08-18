const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const rateLimit = require('express-rate-limit');
const helmet = require('helmet');
const hpp = require('hpp');
const sanitizater = require('perfect-express-sanitizer');

//invocacion utils
const AppError = require('./utils/appError');
//invocacion controllers
const globalErrorHandler = require('./controllers/error.controller')

//invocacion routes
const userRoutes = require('./routes/user.route');
const authRoutes = require('./routes/auth.route');
const postRotues = require('./routes/post.route');
const commentRoutes = require('./routes/comment.route')

const app = express();
const limiter = rateLimit({
  max: 10000,
  windowMs: 60 * 60 * 1000,
  message: 'Too many request from this IP, please try again in an hour!'
});

app.use(express.json());
app.use(cors());
app.use(helmet());
app.use(hpp());
app.use(sanitizater.clean({
  xss: true,
  noSql: true,
  sql: false /// obligatoriamente debe ir en false
})
);



if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}

app.use('/api/v1/', limiter);
//routes
app.use('/api/v1/users', userRoutes);
app.use('/api/v1/auth', authRoutes);
app.use('/api/v1/posts', postRotues);
app.use('/api/v1/comments', commentRoutes)

//error de enpoints
app.all('*', (req, res, next) => {
    return next(
      new AppError(`Can't find ${req.originalUrl} on this server!`, 404)
    );
});


app.use(globalErrorHandler);

module.exports = app;






















