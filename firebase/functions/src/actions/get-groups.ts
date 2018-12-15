import { usersRef, groupsRef } from "../utilities/firebase-app";
import { database } from "firebase-admin";

interface GetGroupsParams {
  userId: string;
}

export async function getGroups({ userId }: GetGroupsParams) {
  try {
    const groupIdsNode = await usersRef.child(`${userId}/groups`).once("value");
    const groupIdsValue = groupIdsNode.val() || [];

    const groupInfoNodes = await Promise.all(
      groupIdsValue.map(groupId => {
        return groupsRef.child(groupId).once("value");
      })
    );

    const groupInfo = {};
    groupInfoNodes.map((node: database.DataSnapshot) => {
      groupInfo[node.key] = node.val();
    });

    return groupInfo;
  } catch ({ status, message }) {
    throw {
      message,
      status
    };
  }
}
