const moment = require('moment-timezone');
const { paymentsRef } = require('../utilities/firebase-app');

module.exports = {
  getReceipts: async (datetime) => {
    try {
      const monthDir = moment(datetime).format('YYYY-MM');
      const receiptsNode = await paymentsRef.child(monthDir).once('value');
      const receiptValue = receiptsNode.val();
      if (receiptValue) {
        const receiptArray = Object.keys(receiptValue).map((key) => receiptValue[key]);
        return receiptArray;
      } else {
        return [];
      }
    } catch (error) {
      throw {
        message: error,
        status: 500
      };
    }
  }
};
