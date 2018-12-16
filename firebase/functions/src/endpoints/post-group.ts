import * as functions from "firebase-functions";
import { makeGroup } from "../actions/make-group";
import { getGroups } from "../actions/get-groups";

export const postGroup = functions.https.onRequest(
  async (request, response) => {
    if (request.method === "OPTIONS") {
      response
        .header("Access-Control-Allow-Origin", "*")
        .header("Access-Control-Allow-Headers", "content-type")
        .sendStatus(204);
    } else {
      try {
        const { userId, name } = request.body;

        await makeGroup({ name, userId });
        const groups = await getGroups({ userId });

        response
          .header("Access-Control-Allow-Origin", "*")
          .header("Access-Control-Allow-Headers", "content-type")
          .status(200)
          .send({ groups });
      } catch ({ status, message }) {
        console.error("error - postGroup", message);
        response
          .header("Access-Control-Allow-Origin", "*")
          .status(status)
          .send({ message });
      }
    }
  }
);
