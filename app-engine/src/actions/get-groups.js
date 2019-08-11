const { groupsRef, usersRef } = require('../utilities/firebase-app');

module.exports = {
  getGroups: async (userId) => {
    try {
      const groupIdsNode = await usersRef.child(`${userId}/groups`).once('value');
      const groupIdsValue = groupIdsNode.val() || [];

      const groupInfoNodes = await Promise.all(
        groupIdsValue.map((groupId) => {
          return groupsRef.child(groupId).once('value');
        })
      );

      const groupInfo = {};
      const currentDate = new Date().getTime();
      groupInfoNodes.map((node) => {
        const value = node.val();
        if (!value.enddate || currentDate <= new Date(value.enddate).getTime()) {
          groupInfo[node.key] = value;
        }
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
