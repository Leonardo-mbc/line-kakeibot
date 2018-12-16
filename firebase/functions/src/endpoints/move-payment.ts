import * as functions from "firebase-functions";
import { movePaymentAction } from "../actions/move-payment-action";

export const movePayment = functions.https.onRequest(
  async (request, response) => {
    try {
      const {
        currentGroupId,
        targetGroupId,
        currentMonth,
        paymentId
      } = request.query;
      await movePaymentAction({
        currentGroupId,
        targetGroupId,
        currentMonth,
        paymentId
      });

      response.header("Access-Control-Allow-Origin", "*").sendStatus(200);
    } catch ({ status, message }) {
      console.error("error - movePayment", message);
      response
        .header("Access-Control-Allow-Origin", "*")
        .status(status)
        .send({ message });
    }
  }
);
