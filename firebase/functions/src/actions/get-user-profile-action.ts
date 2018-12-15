import { usersRef } from "../utilities/firebase-app";
import { getGroups } from "./get-groups";

export async function getUserProfileAction(userId: string) {
  try {
    const userNode = await usersRef.child(userId).once("value");
    const userValue = userNode.val() || {};
    const groups = await getGroups({ userId });
    return {
      ...userValue,
      groups
    };
  } catch ({ status, message }) {
    throw {
      message,
      status
    };
  }
}
