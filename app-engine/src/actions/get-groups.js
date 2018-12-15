const { groupsRef } = require('../utilities/firebase-app');

module.exports = {
  getGruops: async () => {
    try {
      const groups = await groupsRef.once('value');
      return groups.val();
    } catch (error) {
      throw {
        message: error,
        status: 500
      };
    }
  }
};
