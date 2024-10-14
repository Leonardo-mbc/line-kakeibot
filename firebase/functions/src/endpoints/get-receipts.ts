import { onRequest } from "firebase-functions/v2/https";
import { getReceiptsByMonth } from "../actions/get-receipts";

export const getReceipts = onRequest(async (request, response) => {
  try {
    const { userId, target } = request.query;
    const receipts = await getReceiptsByMonth({ userId, monthDir: target });
    response
      .header("Access-Control-Allow-Origin", "*")
      .status(200)
      .type("application/json")
      .send(receipts);
  } catch ({ status, message }) {
    console.error("error - getReceipts", message);
    response
      .header("Access-Control-Allow-Origin", "*")
      .status(status)
      .send({ message });
  }
});
