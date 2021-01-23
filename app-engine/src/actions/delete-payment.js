const { partialPaymentsRef } = require('../utilities/firebase-app');

module.exports = {
  deletePayment: async ({ paymentId }) => {
    try {
      await partialPaymentsRef.child(`${paymentId}`).remove();
      return;
    } catch (error) {
      console.error('%%%% Error in deletePayment', error);
      throw {
        message: error,
        status: 500,
      };
    }
  },
};
