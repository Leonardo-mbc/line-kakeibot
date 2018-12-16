const { usersRef } = require('../utilities/firebase-app');

module.exports = {
  getUserName: async (userId) => {
    try {
      const userNameNode = await usersRef.child(`${userId}/name`).once('value');
      const userNameValue = userNameNode.val();

      return userNameValue;
    } catch (error) {
      throw {
        message: error,
        status: 500
      };
    }
  }
};
