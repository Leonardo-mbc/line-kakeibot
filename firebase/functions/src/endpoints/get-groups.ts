import * as functions from "firebase-functions";
import { getGroups as getGroupsAction } from "../actions/get-groups";

export const getGroups = functions.https.onRequest(
  async (request, response) => {
    try {
      const { userId } = request.query;
      const gruops = await getGroupsAction({ userId });
      response
        .header("Access-Control-Allow-Origin", "*")
        .status(200)
        .send(gruops);
    } catch ({ status, message }) {
      console.error("error - getGroups", message);
      response
        .header("Access-Control-Allow-Origin", "*")
        .status(status)
        .send({ message });
    }
  }
);
