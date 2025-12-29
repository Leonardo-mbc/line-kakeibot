import { v4 as uuidv4 } from 'uuid';
import { usersRef, groupsRef } from '../utilities/firebase-app';

interface MakeGroupParam {
  name: string;
  userId: string;
  enddate: string;
  monthStartDay?: number;
}

export async function makeGroup({ name, userId, enddate, monthStartDay }: MakeGroupParam) {
  try {
    const groupId: string = uuidv4();
    
    // monthStartDayのバリデーション
    const validMonthStartDay = monthStartDay && monthStartDay >= 1 && monthStartDay <= 28 
      ? monthStartDay 
      : 1;
    
    await groupsRef.child(groupId).set({
      name,
      enddate,
      users: [userId],
      monthStartDay: validMonthStartDay,
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
