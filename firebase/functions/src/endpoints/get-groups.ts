import { onRequest } from "firebase-functions/v2/https";
import { getGroups as getGroupsAction } from "../actions/get-groups";

export const getGroups = onRequest(async (request, response) => {
  try {
    const { userId } = request.query as { [key: string]: string };
    const gruops = await getGroupsAction({ userId });
    response
      .header("Access-Control-Allow-Origin", "*")
      .status(200)
      .send(gruops);
  } catch ({ status, message }) {
    console.error("error - getGroups", message);
    response
      .header("Access-Control-Allow-Origin", "*")
      .status(status)
      .send({ message });
  }
});
