import * as functions from "firebase-functions";
import { changeName } from "../actions/change-name";

export const postName = functions.https.onRequest(async (request, response) => {
  if (request.method === "OPTIONS") {
    response
      .header("Access-Control-Allow-Origin", "*")
      .header("Access-Control-Allow-Headers", "content-type")
      .sendStatus(204);
  } else {
    try {
      const { userId, name } = request.body;

      await changeName({ name, userId });

      response
        .header("Access-Control-Allow-Origin", "*")
        .header("Access-Control-Allow-Headers", "content-type")
        .status(200)
        .send({ name });
    } catch ({ status, message }) {
      console.error("error - postName", message);
      response
        .header("Access-Control-Allow-Origin", "*")
        .status(status)
        .send({ message });
    }
  }
});
