const { groupsRef, usersRef } = require('../utilities/firebase-app');

module.exports = {
  getGruops: async (userId) => {
    try {
      const groupIdsNode = await usersRef.child(`${userId}/groups`).once('value');
      const groupIdsValue = groupIdsNode.val() || [];

      const groupInfoNodes = await Promise.all(
        groupIdsValue.map((groupId) => {
          return groupsRef.child(groupId).once('value');
        })
      );

      const groupInfo = {};
      groupInfoNodes.map((node) => {
        groupInfo[node.key] = node.val();
      });

      return groupInfo;
    } catch (error) {
      throw {
        message: error,
        status: 500
      };
    }
  }
};
