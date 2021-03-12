(function(){function r(e,n,t){function o(i,f){if(!n[i]){if(!e[i]){var c="function"==typeof require&&require;if(!f&&c)return c(i,!0);if(u)return u(i,!0);var a=new Error("Cannot find module '"+i+"'");throw a.code="MODULE_NOT_FOUND",a}var p=n[i]={exports:{}};e[i][0].call(p.exports,function(r){var n=e[i][1][r];return o(n||r)},p,p.exports,r,e,n,t)}return n[i].exports}for(var u="function"==typeof require&&require,i=0;i<t.length;i++)o(t[i]);return o}return r})()({1:[function(require,module,exports){
/* eslint-disable */
const hideAlert = () => {
  const el = document.querySelector('.alert');
  if (el) el.parentElement.removeChild(el);
};

// type is 'success' or 'error'
module.exports.showAlert = (type, msg) => {
  hideAlert();
  const markup = `<div class="alert alert--${type}">${msg}</div>`;
  document.querySelector('body').insertAdjacentHTML('afterbegin', markup);
  window.setTimeout(hideAlert, 5000);
};

},{}],2:[function(require,module,exports){
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

},{"./login.js":3,"./stripe.js":4,"./update":5}],3:[function(require,module,exports){
/* eslint-disable */
const { showAlert } = require('./alerts');

module.exports.login = async (email, password) => {
  console.log('login', email, password);
  try {
    const res = await axios({
      method: 'POST',
      url: 'http://localhost:3000/api/v1/users/login',
      data: {
        email,
        password,
      },
    });

    if (res.data.status === 'success') {
      showAlert('success', 'Logged in successfully!');
      // location.assign('/');
      window.setTimeout(() => {
        location.assign('/');
      }, 1000);
    }
  } catch (err) {
    showAlert('error', err.response.data.message);
    // console.log(err.response.data);
  }
};

module.exports.logout = async () => {
  try {
    const res = await axios({
      method: 'GET',
      url: 'http://localhost:3000/api/v1/users/logout',
    });
    if (res.data.status === 'success') {
      location.reload();
      location.assign('/login');
    }
  } catch (err) {
    // console.log(err);
    showAlert('error', 'Error logging out! Try again.');
  }
};

},{"./alerts":1}],4:[function(require,module,exports){
/* eslint-disable */
// import axios from 'axios';
// const { showAlert } = require('./alerts.js');
const { showAlert } = require('./alerts');

const stripe = Stripe(
  'pk.eyJ1IjoiaHVlcHQ5MiIsImEiOiJja2tzejZuMDgwY3Q4Mndxb3ZhcndvbjdyIn0.95arHl19VG6HRTnTF25L5g',
);

module.exports.bookTour = async (tourId) => {
  try {
    // 1) Get checkout session from API
    const session = await axios(`/api/v1/bookings/checkout-session/${tourId}`);
    // console.log(session);

    // 2) Create checkout form + chanre credit card
    await stripe.redirectToCheckout({
      sessionId: session.data.session.id,
    });
  } catch (err) {
    console.log(err);
    showAlert('error', err);
  }
};

},{"./alerts":1}],5:[function(require,module,exports){
/* eslint-disable */

const { showAlert } = require('./alerts');

module.exports.updateSettings = async (data, type) => {
  try {
    const url =
      type === 'password'
        ? 'http://localhost:3000/api/v1/users/updateMyPassword'
        : 'http://localhost:3000/api/v1/users/updateMe';
    const res = await axios({
      method: 'PATCH',
      url,
      data,
    });
    console.log('res', res);
    if (res.data.status === 'success') {
      showAlert('success', `${type.toUpperCase()} updated successfully!`);
    }
  } catch (err) {
    // console.log(err.response);
    showAlert('error', err.response.data.message);
  }
};

},{"./alerts":1}]},{},[2]);
