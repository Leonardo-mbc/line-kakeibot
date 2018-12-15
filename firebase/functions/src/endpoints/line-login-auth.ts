import * as functions from "firebase-functions";
import { postAuth } from "../actions/line-login-actions";

export const lineLoginAuth = functions.https.onRequest(
  async (request, response) => {
    try {
      const data = await postAuth(request.query.code);
      response
        .header("Access-Control-Allow-Origin", "*")
        .status(200)
        .send(data);
    } catch ({ status, message }) {
      console.error("error - lineLoginAuth", message);
      response
        .header("Access-Control-Allow-Origin", "*")
        .status(status)
        .send({ message });
    }
  }
);
