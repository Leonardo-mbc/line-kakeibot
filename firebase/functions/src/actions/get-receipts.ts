import { paymentsRef, groupsRef, usersRef } from "../utilities/firebase-app";
import { getGroups } from "./get-groups";

export async function getReceiptsValue({ userId, monthDir }) {
  try {
    const groups = await getGroups({ userId });

    const appearUserIds = [];
    const receipts = {};
    await Promise.all(
      Object.keys(groups).map(async groupId => {
        const groupNode = await groupsRef
          .child(`${groupId}/name`)
          .once("value");
        const groupName = groupNode.val();

        const receiptsNode = await paymentsRef
          .child(`${groupId}/${monthDir}`)
          .once("value");
        const receiptValue = receiptsNode.val();
        if (receiptValue) {
          const receiptArray = Object.keys(receiptValue).map(key => {
            appearUserIds.push(receiptValue[key].who);
            return receiptValue[key];
          });
          receipts[groupId] = receiptArray;
        } else {
          receipts[groupId] = [];
        }
      })
    );

    const users = {};
    await Promise.all(
      appearUserIds
        .filter((x, i, self) => self.indexOf(x) === i)
        .map(async user_id => {
          const userNameNode = await usersRef
            .child(`${user_id}/name`)
            .once("value");
          const name = userNameNode.val();
          users[user_id] = name;
        })
    );

    return { receipts, users, groups };
  } catch (error) {
    throw {
      message: error,
      status: 500
    };
  }
}
