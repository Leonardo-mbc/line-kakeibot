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
          Object.keys(receiptValue).map(key => {
            // 全ユーザーを収集
            appearUserIds.push(receiptValue[key].who);
          });
          receipts[groupId] = receiptValue;
        } else {
          receipts[groupId] = {};
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
