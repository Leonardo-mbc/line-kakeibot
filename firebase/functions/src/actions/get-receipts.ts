import { paymentsRef, usersRef } from '../utilities/firebase-app';
import { getGroups } from './get-groups';

export async function getReceiptsByMonth({ userId, monthDir }) {
  try {
    const groups = await getGroups({ userId });

    const receipts = {};
    const appearUserIds = [];
    await Promise.all(
      Object.keys(groups).map(async (groupId) => {
        const receiptsNode = await paymentsRef.child(`${groupId}/${monthDir}`).once('value');
        const receiptValue = receiptsNode.val();
        if (receiptValue) {
          receipts[groupId] = receiptValue;
        } else {
          receipts[groupId] = {};
        }

        if (groups[groupId].users) {
          appearUserIds.push(...groups[groupId].users);
        }
      })
    );

    const users = {};
    await Promise.all(
      appearUserIds
        .filter((x, i, self) => self.indexOf(x) === i)
        .map(async (user_id) => {
          const userNameNode = await usersRef.child(`${user_id}/name`).once('value');
          const name = userNameNode.val();
          users[user_id] = name;
        })
    );

    return { receipts, users, groups };
  } catch (error) {
    throw {
      message: error,
      status: 500,
    };
  }
}

export async function getReceiptsByGroupId({ userId, groupId, from }) {
  try {
    const groups = await getGroups({ userId });

    let receipts = {};
    const appearUserIds = [];

    let receiptValue = {};
    if (from) {
      await Promise.all(
        from.map(async (month) => {
          const receiptsNode = await paymentsRef.child(`${groupId}/${month}`).once('value');
          receiptValue[month] = receiptsNode.val();
        })
      );
    } else {
      const receiptsNode = await paymentsRef.child(groupId).once('value');
      receiptValue = receiptsNode.val();
    }

    if (receiptValue) {
      for (const month in receiptValue) {
        receipts = { ...receipts, ...receiptValue[month] };
      }
    }

    if (groups[groupId].users) {
      appearUserIds.push(...groups[groupId].users);
    }

    const users = {};
    await Promise.all(
      appearUserIds
        .filter((x, i, self) => self.indexOf(x) === i)
        .map(async (user_id) => {
          const userNameNode = await usersRef.child(`${user_id}/name`).once('value');
          const name = userNameNode.val();
          users[user_id] = name;
        })
    );

    return { receipts, users, group: groups[groupId] };
  } catch (error) {
    throw {
      message: error,
      status: 500,
    };
  }
}
