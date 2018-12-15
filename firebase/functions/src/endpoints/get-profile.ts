import * as functions from "firebase-functions";
import { getLineProfileAction } from "../actions/get-line-profile-action";
import { getUserProfileAction } from "../actions/get-user-profile-action";
import { User } from "../interfaces/user";

export const getProfile = functions.https.onRequest(
  async (request, response) => {
    if (request.method === "OPTIONS") {
      response
        .header("Access-Control-Allow-Origin", "*")
        .header("Access-Control-Allow-Headers", "origin, authorization")
        .sendStatus(204);
    } else {
      try {
        const lineProfile = await getLineProfileAction(
          request.headers["authorization"]
        );

        const userProfile = await getUserProfileAction(lineProfile.userId);
        const profile: User & { isNeedCoop: boolean } = {
          isNeedCoop: false,
          name: lineProfile.displayName,
          loginId: lineProfile.userId,
          ...userProfile
        };

        response
          .header("Access-Control-Allow-Origin", "*")
          .header("Access-Control-Allow-Headers", "origin, authorization")
          .status(200)
          .send(profile);
      } catch ({ status, message }) {
        console.error("error - getProfile", message);
        response
          .header("Access-Control-Allow-Origin", "*")
          .header("Access-Control-Allow-Headers", "origin, authorization")
          .status(status)
          .send({ message });
      }
    }
  }
);
