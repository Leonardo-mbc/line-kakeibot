const moment = require('moment-timezone');
const { paymentsRef } = require('../utilities/firebase-app');

module.exports = {
  setPaymentPartial: async (paymentId, datetime, params) => {
    for (const key in params) {
      try {
        const monthDir = moment(datetime).format('YYYY-MM');
        await paymentsRef.child(`${monthDir}/${paymentId}/${key}`).set(params[key]);
      } catch (error) {
        throw {
          message: error,
          status: 500
        };
      }
    }
    return;
  }
};
