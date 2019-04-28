import { usersRef, groupsRef } from '../utilities/firebase-app';

interface OutGroupParam {
  groupId: string;
  userId: string;
}

export async function outGroupAction({ groupId, userId }: OutGroupParam): Promise<void> {
  try {
    const groupUsersNode = await groupsRef.child(`${groupId}/users`).once('value');
    const users: string[] = groupUsersNode.val() || [];
    await groupsRef.child(`${groupId}/users`).set([...users.filter((value) => value !== userId)]);

    const userGroupsNode = await usersRef.child(`${userId}/groups`).once('value');
    const groups: string[] = userGroupsNode.val() || [];
    await usersRef.child(`${userId}/groups`).set([...groups.filter((value) => value !== groupId)]);
  } catch ({ status, message }) {
    throw {
      message,
      status
    };
  }
}
