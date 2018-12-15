const moment = require('moment-timezone');
const { paymentsRef } = require('../utilities/firebase-app');

module.exports = {
  deletePayment: async ({ paymentId, datetime }) => {
    try {
      const monthDir = moment(datetime).format('YYYY-MM');
      await paymentsRef.child(`${monthDir}/${paymentId}`).remove();
      return;
    } catch (error) {
      throw {
        message: error,
        status: 500
      };
    }
  }
};
