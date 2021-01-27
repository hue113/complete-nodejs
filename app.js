const express = require('express');
const morgan = require('morgan');

const tourRouter = require('./routes/tourRoutes');
const userRouter = require('./routes/userRoutes');

const app = express();

// 1. MiDDLEWARE
app.use(morgan('dev'));
app.use(express.json());
app.use(express.static(`${__dirname}/public`));

// convention naming: next; but you can name anything you want
app.use((req, res, next) => {
  console.log('Hello from the middleware 👋');
  next();
});

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

// 4. SERVER --> move to server.js

module.exports = app;
