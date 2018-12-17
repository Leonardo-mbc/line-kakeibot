const moment = require('moment-timezone');
const { partialPaymentsRef, paymentsRef } = require('../utilities/firebase-app');
const { deletePayment } = require('./delete-payment');

module.exports = {
  movePayment: async ({ groupId, paymentId, datetime }) => {
    try {
      const monthDir = moment(datetime).format('YYYY-MM');

      const tempPaymentNode = await partialPaymentsRef.child(paymentId).once('value');
      const tempPaymentValue = tempPaymentNode.val();

      await paymentsRef.child(`${groupId}/${monthDir}/${paymentId}`).set(tempPaymentValue);
      await deletePayment({ paymentId });
      return tempPaymentValue;
    } catch (error) {
      throw {
        message: error,
        status: 500
      };
    }
  }
};
