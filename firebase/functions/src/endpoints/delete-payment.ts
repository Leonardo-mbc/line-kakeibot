import * as functions from "firebase-functions";
import { deletePaymentAction } from "../actions/delete-payment-action";

export const deletePayment = functions.https.onRequest(
  async (request, response) => {
    try {
      const { userId, groupId, currentMonth, paymentId } = request.query;
      const deleted = await deletePaymentAction({
        userId,
        groupId,
        currentMonth,
        paymentId
      });

      response
        .header("Access-Control-Allow-Origin", "*")
        .status(200)
        .send({ deleted });
    } catch ({ status, message }) {
      console.error("error - deletePayment", message);
      response
        .header("Access-Control-Allow-Origin", "*")
        .status(status)
        .send({ message });
    }
  }
);
