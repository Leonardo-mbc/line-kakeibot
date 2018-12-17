const uuidv4 = require('uuid/v4');
const moment = require('moment-timezone');
const { partialPaymentsRef } = require('../utilities/firebase-app');

module.exports = {
  makePayment: async function() {
    try {
      const paymentId = uuidv4();
      const nowTime = moment().tz('Asia/Tokyo');
      await partialPaymentsRef.child(paymentId).set({
        boughtAt: nowTime.format('YYYY-MM-DD HH:mm:ss'),
        imageUrl: '',
        place: '',
        price: '',
        who: ''
      });

      return { paymentId, datetime: nowTime.format() };
    } catch (error) {
      throw {
        message: error,
        status: 500
      };
    }
  }
};
