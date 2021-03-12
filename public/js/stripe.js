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
