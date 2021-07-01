import { v4 as uuidv4 } from 'uuid';
import { usersRef, groupsRef } from '../utilities/firebase-app';

interface MakeGroupParam {
  name: string;
  userId: string;
  enddate: string;
}

export async function makeGroup({ name, userId, enddate }: MakeGroupParam) {
  try {
    const groupId: string = uuidv4();
    await groupsRef.child(groupId).set({
      name,
      enddate,
      users: [userId],
    });

    const userGroupsNode = await usersRef.child(`${userId}/groups`).once('value');
    const userGroupsValue = userGroupsNode.val() || [];
    await usersRef.child(`${userId}/groups`).set([...userGroupsValue, groupId]);

    return groupId;
  } catch ({ status, message }) {
    throw {
      message,
      status,
    };
  }
}
