/* eslint-disable */
// import axios from 'axios';
// import { showAlert } from './alerts.js';

console.log('Hello from login.js');
//=======LOG IN========
const login = async (email, password) => {
  // console.log('login', email, password);
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
      location.assign('/');
      // window.setTimeout(() => {
      //   location.assign('/');
      // }, 1000);
    }
  } catch (err) {
    showAlert('error', err.response.data.message);
    console.log(err.response.data);
  }
};

document.querySelector('.form--login').addEventListener('submit', (e) => {
  e.preventDefault();
  const email = document.getElementById('email').value;
  const password = document.getElementById('password').value;
  login(email, password);
});

//=======LOG OUT========
const logout = async () => {
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
    console.log(err.response);
    showAlert('error', 'Error logging out! Try again.');
  }
};
const logOutBtn = document.querySelector('.nav__el--logout');
if (logOutBtn) logOutBtn.addEventListener('click', logout);
// if (logOutBtn)
// logOutBtn.addEventListener('click', (e) => {
//   e.preventDefault();
//   logout();
// });
// document.querySelector('.nav__el--logout').addEventListener('click', (e) => {
//   e.preventDefault();
//   logout();
// });

//=======ALERT=======
const hideAlert = () => {
  const el = document.querySelector('.alert');
  if (el) el.parentElement.removeChild(el);
};

// type is 'success' or 'error'
const showAlert = (type, msg) => {
  hideAlert();
  const markup = `<div class="alert alert--${type}">${msg}</div>`;
  document.querySelector('body').insertAdjacentHTML('afterbegin', markup);
  window.setTimeout(hideAlert, 5000);
};
