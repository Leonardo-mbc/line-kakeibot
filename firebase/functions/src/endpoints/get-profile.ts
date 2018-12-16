import * as functions from "firebase-functions";
import { getProfileAction } from "../actions/get-user-profile-action";

export const getProfile = functions.https.onRequest(
  async (request, response) => {
    try {
      const { userId } = request.query;
      const profile = await getProfileAction(userId);
      response
        .header("Access-Control-Allow-Origin", "*")
        .status(200)
        .send(profile);
    } catch ({ status, message }) {
      console.error("error - getProfile", message);
      response
        .header("Access-Control-Allow-Origin", "*")
        .status(status)
        .send({ message });
    }
  }
);
