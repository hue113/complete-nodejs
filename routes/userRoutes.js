const express = require('express');
const userController = require('../controllers/userController');
const authController = require('../controllers/authController');

const userRouter = express.Router();

userRouter.post('/signup', authController.signup);
userRouter.post('/login', authController.login);
userRouter.get('/logout', authController.logout);
userRouter.post('/forgotPassword', authController.forgotPassword);
userRouter.patch('/resetPassword/:token', authController.resetPassword);

// Middleware run in sequence --> put authController.protect here
// will require authentication for all middleware below
userRouter.use(authController.protect); // Protect all routes after this middleware

userRouter.patch('/updateMyPassword', authController.protect, authController.updatePassword);
userRouter.get('/me', userController.getMe, userController.getUser);
userRouter.patch(
  '/updateMe',
  userController.uploadUserPhoto,
  userController.resizeUserPhoto,
  userController.updateMe,
);
userRouter.delete('/deleteMe', userController.deleteMe);

// restrict to admin for all middleware below
userRouter.use(authController.restrictTo('admin'));

userRouter.route('/').get(userController.getAllUsers).post(userController.createUser);

userRouter
  .route('/:id')
  .get(userController.getUser)
  .patch(userController.updateUser)
  .delete(userController.deleteUser);

module.exports = userRouter;
