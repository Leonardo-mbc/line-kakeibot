import { groupsRef } from '../utilities/firebase-app';
import { Group } from '../interfaces/group';

interface EditGroupParam {
  groupId: string;
  group: Partial<Group>;
}

export async function editGroupAction({ groupId, group }: EditGroupParam) {
  try {
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
