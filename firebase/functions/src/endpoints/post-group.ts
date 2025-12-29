import { onRequest } from "firebase-functions/v2/https";
import { makeGroup } from "../actions/make-group";
import { getGroups } from "../actions/get-groups";

export const postGroup = onRequest(async (request, response) => {
  if (request.method === "OPTIONS") {
    response
      .header("Access-Control-Allow-Origin", "*")
      .header("Access-Control-Allow-Headers", "content-type")
      .sendStatus(204);
  } else {
    try {
      const { userId, name, enddate, monthStartDay } = request.body;

      await makeGroup({ name, userId, enddate, monthStartDay });
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
});
