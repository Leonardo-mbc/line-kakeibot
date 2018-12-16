import * as functions from 'firebase-functions';
import { outGroupAction } from '../actions/out-group';
import { getGroups } from '../actions/get-groups';

export const outGroup = functions.https.onRequest(async (request, response) => {
  if (request.method === 'OPTIONS') {
    response
      .header('Access-Control-Allow-Origin', '*')
      .header('Access-Control-Allow-Headers', 'content-type')
      .sendStatus(204);
  } else {
    try {
      const { userId, groupId } = request.body;

      await outGroupAction({ groupId, userId });
      const groups = await getGroups({ userId });

      response
        .header('Access-Control-Allow-Origin', '*')
        .header('Access-Control-Allow-Headers', 'content-type')
        .status(200)
        .send({ groups });
    } catch ({ status, message }) {
      console.error('error - outGroup', message);
      response
        .header('Access-Control-Allow-Origin', '*')
        .status(status)
        .send({ message });
    }
  }
});
