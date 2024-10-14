import { onRequest } from "firebase-functions/v2/https";
import { editPaymentPartial } from "../actions/edit-payment-partial";

export const editPayment = onRequest(async (request, response) => {
  if (request.method === "OPTIONS") {
    response
      .header("Access-Control-Allow-Origin", "*")
      .header("Access-Control-Allow-Headers", "content-type")
      .sendStatus(204);
  } else {
    try {
      const { userId, groupId, currentMonth, paymentId } = request.query;
      const paymentPartial = request.body;

      if (
        typeof userId === "string" &&
        typeof groupId === "string" &&
        typeof currentMonth === "string" &&
        typeof paymentId === "string"
      ) {
        await editPaymentPartial({
          userId,
          groupId,
          currentMonth,
          paymentId,
          paymentPartial,
        });
      }

      response
        .header("Access-Control-Allow-Origin", "*")
        .header("Access-Control-Allow-Headers", "content-type")
        .sendStatus(200);
    } catch ({ status, message }) {
      console.error("error - editPayment", message);
      response
        .header("Access-Control-Allow-Origin", "*")
        .header("Access-Control-Allow-Headers", "content-type")
        .status(status)
        .send({ message });
    }
  }
});
