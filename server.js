const dotenv = require('dotenv');
const mongoose = require('mongoose');
const app = require('./app');

// Handle Uncaught Exception
process.on('uncaughtException', (err) => {
  console.log(err.name, err.message);
  console.log('UNCAUGHT REJECTION, SHUTTING DOWN ...');
  process.exit(1);
});

dotenv.config({ path: './config.env' });

// 1. connect mongoose to Database
mongoose
  .connect(process.env.DATABASE_ATLAS, {
    useNewUrlParser: true,
    useCreateIndex: true,
    useFindAndModify: false,
    useUnifiedTopology: true,
  })
  .then(console.log('DB connection successful!'))
  .catch((err) => {
    console.error('Database connection error: ', err);
  });

const port = process.env.PORT || 3000;
const server = app.listen(port, () => {
  console.log(`App running on port ${port}...`);
});

// Handle Unhandled Rejections error
process.on('unhandledRejection', (err) => {
  console.log(err.name, err.message);
  console.log('UNHANDLED REJECTION, SHUTTING DOWN ...');
  server.close(() => {
    process.exit(1); // 0= success; 1=uncaught exception
  });
});

//
process.on('SIGTERM', () => {
  console.log('👋 SIGTERM RECEIVED. Shutting down gracefully');
  server.close(() => {
    console.log('💥 Process terminated!');
  });
});
