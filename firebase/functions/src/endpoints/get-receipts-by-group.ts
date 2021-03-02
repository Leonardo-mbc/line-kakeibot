import * as functions from 'firebase-functions';
import { getReceiptsByGroupId } from '../actions/get-receipts';

export const getReceiptsByGroup = functions.https.onRequest(async (request, response) => {
  try {
    const { userId, groupId } = request.query;
    const { from } = request.body;
    const receipts = await getReceiptsByGroupId({ userId, groupId, from });
    response
      .header('Access-Control-Allow-Origin', '*')
      .header('Access-Control-Allow-Headers', 'content-type')
      .status(200)
      .type('application/json')
      .send(receipts);
  } catch ({ status, message }) {
    console.error('error - getReceiptsByGroup', message);
    response
      .header('Access-Control-Allow-Origin', '*')
      .header('Access-Control-Allow-Headers', 'content-type')
      .status(status)
      .send({ message });
  }
});
