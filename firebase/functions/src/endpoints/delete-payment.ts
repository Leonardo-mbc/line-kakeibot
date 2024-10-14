import { onRequest } from "firebase-functions/v2/https";
import { deletePaymentAction } from "../actions/delete-payment-action";

export const deletePayment = onRequest(async (request, response) => {
  try {
    const { userId, groupId, currentMonth, paymentId } = request.query as {
      [key: string]: string;
    };
    const deleted = await deletePaymentAction({
      userId,
      groupId,
      currentMonth,
      paymentId,
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
});
