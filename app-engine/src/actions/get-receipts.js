const moment = require('moment-timezone');
const { paymentsRef, groupsRef } = require('../utilities/firebase-app');
const { getGruops } = require('./get-groups');

module.exports = {
  getReceipts: async ({ userId, datetime }) => {
    try {
      const monthDir = moment(datetime).format('YYYY-MM');
      const groups = await getGruops(userId);

      const receipts = await Promise.all(
        Object.keys(groups).map(async (groupId) => {
          const groupNode = await groupsRef.child(`${groupId}/name`).once('value');
          const groupName = groupNode.val();

          const receiptsNode = await paymentsRef.child(`${groupId}/${monthDir}`).once('value');
          const receiptValue = receiptsNode.val();
          if (receiptValue) {
            const receiptArray = Object.keys(receiptValue).map((key) => receiptValue[key]);
            return { groupName, groupId, receipts: receiptArray };
          } else {
            return { groupName, groupId, receipts: [] };
          }
        })
      );

      return receipts;
    } catch (error) {
      throw {
        message: error,
        status: 500
      };
    }
  }
};
