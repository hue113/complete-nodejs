/* eslint-disable */
// import axios from 'axios';
const { login, logout } = require('./login.js');
const { updateSettings } = require('./update');
const { bookTour } = require('./stripe.js');
// import '@babel/polyfill';
console.log('Hello from index.js');

//======= MAP =======

//======= ALERT =======

//======= LOG IN ========
const loginForm = document.querySelector('.form--login');
if (loginForm)
  loginForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
    login(email, password);
  });

//======= LOG OUT ========
const logOutBtn = document.querySelector('.nav__el--logout');
if (logOutBtn) logOutBtn.addEventListener('click', logout);

//======= UPDATE =======
const userDataForm = document.querySelector('.form-user-data');
if (userDataForm) {
  userDataForm.addEventListener('submit', (e) => {
    e.preventDefault();

    const form = new FormData();
    form.append('name', document.getElementById('name').value);
    form.append('email', document.getElementById('email').value);
    form.append('photo', document.getElementById('photo').files[0]);
    console.log(form);
    updateSettings(form, 'data');
  });
}

const userPasswordForm = document.querySelector('.form-user-password');
if (userPasswordForm) {
  userPasswordForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    document.querySelector('.btn--save-password').textContent = 'Updating...';

    const passwordCurrent = document.getElementById('password-current').value;
    const password = document.getElementById('password').value;
    const passwordConfirm = document.getElementById('password-confirm').value;
    await updateSettings({ passwordCurrent, password, passwordConfirm }, 'password');

    document.querySelector('.btn--save-password').textContent = 'Save password';
    document.getElementById('password-current').value = '';
    document.getElementById('password').value = '';
    document.getElementById('password-confirm').value = '';
  });
}

//======= STRIPE =======
// const Stripe = require('stripe');
// const stripe = Stripe(
//   'pk_test_51HzlQ4FD0x4Cf1q082I8zPeNMLHJAnc0Z9omFu6GVpvNlBvMpqIizld3SBGcUKyKTpNhYRqZxNhmzY3pxEMXf5Qa00hQiaolC5',
// );

// const bookTour = async (tourId) => {
//   console.log('inside bookTour', tourId);
//   try {
//     // 1) Get checkout session from API
//     const session = await axios(`http://localhost:3000/api/v1/bookings/checkout-session/${tourId}`);
//     console.log(session);

//     // 2) Create checkout form + charge credit card
//     await stripe.redirectToCheckout({
//       sessionId: session.data.session.id,
//     });
//   } catch (err) {
//     console.log(err);
//     showAlert('error', err);
//   }
// };

const bookBtn = document.getElementById('book-tour');
if (bookBtn)
  bookBtn.addEventListener('click', (e) => {
    e.target.textContent = 'Processing...';
    const { tourId } = e.target.dataset;
    bookTour(tourId);
  });
