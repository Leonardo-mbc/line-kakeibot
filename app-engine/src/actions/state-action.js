const { stateRef } = require('../utilities/firebase-app');

module.exports = {
  getState: async function (userId) {
    try {
      const state = await stateRef.child(userId).once('value');
      return state.val();
    } catch (error) {
      console.error('%%%% Error in getState', error);
      throw {
        message: error,
        status: 500,
      };
    }
  },
  setState: async function (userId, newState) {
    try {
      await stateRef.child(userId).set(newState);
    } catch (error) {
      console.error('%%%% Error in setState', error);
      throw {
        message: error,
        status: 500,
      };
    }
    return;
  },
};
