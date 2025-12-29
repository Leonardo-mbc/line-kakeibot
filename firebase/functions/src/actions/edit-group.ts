import { groupsRef } from '../utilities/firebase-app';
import { Group } from '../interfaces/group';

interface EditGroupParam {
  groupId: string;
  group: Partial<Group>;
}

export async function editGroupAction({ groupId, group }: EditGroupParam) {
  try {
    // monthStartDayのバリデーション
    if (group.monthStartDay !== undefined) {
      if (group.monthStartDay < 1 || group.monthStartDay > 28) {
        throw {
          message: 'monthStartDay must be between 1 and 28',
          status: 400,
        };
      }
    }
    
    const groupsRefNode = groupsRef.child(groupId);
    await groupsRefNode.update({
      ...group,
    });

    const groupsRefValue = groupsRefNode.once('value');

    return groupsRefValue;
  } catch ({ status, message }) {
    throw {
      message,
      status,
    };
  }
}
