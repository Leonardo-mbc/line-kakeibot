const moment = require('moment-timezone');
const { paymentsRef } = require('../utilities/firebase-app');

module.exports = {
  getPayment: async ({ datetime, paymentId }) => {
    try {
      const monthDir = moment(datetime).format('YYYY-MM');
      const payment = await paymentsRef.child(`${monthDir}/${paymentId}`).once('value');
      return payment.val();
    } catch (error) {
      throw {
        message: error,
        status: 500
      };
    }
  }
};
