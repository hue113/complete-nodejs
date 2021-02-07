const express = require('express');
const viewsController = require('../controllers/viewsController');
const authController = require('../controllers/authController');

const viewRouter = express.Router();

// viewRouter.use(authController.isLoggedIn);

viewRouter.get('/', authController.isLoggedIn, viewsController.getOverview);
viewRouter.get('/tour/:slug', authController.protect, viewsController.getTour);
viewRouter.get('/login', authController.isLoggedIn, viewsController.getLoginForm);
viewRouter.get('/me', authController.protect, viewsController.getAccount);

viewRouter.post('/submit-user-data', authController.protect, viewsController.updateUserData);

module.exports = viewRouter;
