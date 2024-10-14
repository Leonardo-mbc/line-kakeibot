import { onRequest } from "firebase-functions/v2/https";
import { getProfileAction } from "../actions/get-user-profile-action";

export const getProfile = onRequest(async (request, response) => {
  try {
    const { userId } = request.query as { [key: string]: string };
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
});
