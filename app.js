const express = require('express');
const morgan = require('morgan');

const AppError = require('./utils/appError');
const tourRouter = require('./routes/tourRoutes');
const userRouter = require('./routes/userRoutes');
const globalErrorHandler = require('./controllers/errorController');

const app = express();

// 1. MiDDLEWARE
if (process.env.NODE_ENV === 'development') app.use(morgan('dev'));
app.use(express.json());
app.use(express.static(`${__dirname}/public`));

app.use((req, res, next) => {
  req.requestTime = new Date().toISOString();
  next();
});

// 2. ROUTE HANDLERS --> move to Controllers folders

// 3. ROUTES
// 3a. CREATE multiple ROUTERS --> move to Routes folder
// 3b. MOUNT multiple ROUTERS:
app.use('/api/v1/tours', tourRouter);
app.use('/api/v1/tours/users', userRouter);

// Error Handling
app.all('*', (req, res, next) => {
  next(new AppError(`Can't find ${req.originalUrl} on this server`));
});

// Global Error Handler
app.use(globalErrorHandler);

// 4. SERVER --> move to server.js

module.exports = app;
