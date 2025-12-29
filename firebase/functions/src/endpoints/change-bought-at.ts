import { onRequest } from "firebase-functions/v2/https";
import { changeBoughtAt as changeBoughtAtAction } from "../actions/change-bought-at";

export const changeBoughtAt = onRequest(async (request, response) => {
  if (request.method === "OPTIONS") {
    response
      .header("Access-Control-Allow-Origin", "*")
      .header("Access-Control-Allow-Headers", "content-type")
      .sendStatus(204);
  } else {
    try {
      const { userId, groupId, paymentId, currentMonth, newBoughtAt } =
        request.body;

      if (!userId || !groupId || !paymentId || !currentMonth || !newBoughtAt) {
        throw {
          message: "Missing required parameters",
          status: 400,
        };
      }

      const result = await changeBoughtAtAction({
        userId,
        groupId,
        paymentId,
        currentMonth,
        newBoughtAt,
      });

      response
        .header("Access-Control-Allow-Origin", "*")
        .header("Access-Control-Allow-Headers", "content-type")
        .status(200)
        .send(result);
    } catch (error: any) {
      const { status = 500, message = "Internal server error" } = error;
      console.error("error - changeBoughtAt", message);
      response
        .header("Access-Control-Allow-Origin", "*")
        .header("Access-Control-Allow-Headers", "content-type")
        .status(status)
        .send({ message });
    }
  }
});

