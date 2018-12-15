import * as functions from "firebase-functions";
import { writesTempSetting } from "../actions/writes-temp-setting";

export const postTempSetting = functions.https.onRequest(
  async (request, response) => {
    try {
      const { loginId } = request.query;
      const { tempSetting } = request.body;
      await writesTempSetting(loginId, tempSetting);
      response.sendStatus(200);
    } catch ({ status, message }) {
      console.error("error - postTempSetting", message);
      response
        .header("Access-Control-Allow-Origin", "*")
        .status(status)
        .send({ message });
    }
  }
);
