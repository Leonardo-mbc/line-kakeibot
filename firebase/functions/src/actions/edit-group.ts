import { groupsRef } from '../utilities/firebase-app';

interface EditGroupParam {
  groupId: string;
  enddate: string;
}

export async function editGroupAction({ groupId, enddate }: EditGroupParam) {
  try {
    const groupsRefNode = groupsRef.child(groupId);
    await groupsRefNode.update({
      enddate
    });

    const groupsRefValue = groupsRefNode.once('value');

    return groupsRefValue;
  } catch ({ status, message }) {
    throw {
      message,
      status
    };
  }
}
