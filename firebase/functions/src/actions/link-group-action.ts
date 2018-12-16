import { usersRef, groupsRef } from "../utilities/firebase-app";

interface LinkGroupParam {
  groupId: string;
  userId: string;
}

export async function linkGroupAction({ groupId, userId }: LinkGroupParam) {
  try {
    const groupUsersRef = groupsRef.child(`${groupId}/users`);
    const groupUsersNode = await groupUsersRef.once("value");
    const groupUsersValue = groupUsersNode.val() || [];
    if (groupUsersValue.indexOf(userId) < 0) {
      await groupUsersRef.set([...groupUsersValue, userId]);
    }

    const userGroupsRef = usersRef.child(`${userId}/groups`);
    const userGroupsNode = await userGroupsRef.once("value");
    const userGroupsValue = userGroupsNode.val() || [];
    if (userGroupsValue.indexOf(groupId) < 0) {
      await userGroupsRef.set([...userGroupsValue, groupId]);
    }

    const groupNode = await groupsRef.child(`${groupId}/name`).once("value");
    const name = groupNode.val();

    return { name };
  } catch ({ status, message }) {
    throw {
      message,
      status
    };
  }
}
