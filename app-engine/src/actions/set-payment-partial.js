const { partialPaymentsRef } = require('../utilities/firebase-app');

module.exports = {
  setPaymentPartial: async (paymentId, params) => {
    for (const key in params) {
      try {
        await partialPaymentsRef.child(`${paymentId}/${key}`).set(params[key]);
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
