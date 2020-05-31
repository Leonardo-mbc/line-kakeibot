import * as functions from 'firebase-functions';
import { kakeibotBucket } from '../utilities/firebase-app';

export const postPicture = functions.https.onRequest(async (request, response) => {
  try {
    const buffer = request.body;
    const { filepath } = request.query as { [key: string]: string };
    const contentType = request.headers['content-type'];
    const file = kakeibotBucket.file(filepath);

    file
      .createWriteStream({
        metadata: {
          contentType,
        },
      })
      .on('finish', async () => {
        await file.makePublic();
        response.sendStatus(200);
      })
      .on('error', (error) => {
        response.status(500).send({ message: error });
      })
      .end(buffer);
  } catch ({ status, message }) {
    console.error('error - postPicture', message);
    response.status(status).send({ message });
  }
});
