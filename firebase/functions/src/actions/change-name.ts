import { usersRef } from "../utilities/firebase-app";

interface ChangeNameParam {
  name: string;
  userId: string;
}

export async function changeName({ name, userId }: ChangeNameParam) {
  try {
    const userNode = await usersRef.child(userId).once("value");
    const userValue = userNode.val() || {};
    await usersRef.child(userId).set({
      ...userValue,
      name
    });

    return name;
  } catch ({ status, message }) {
    throw {
      message,
      status
    };
  }
}
