import { onRequest } from "firebase-functions/v2/https";
import { editGroupAction } from "../actions/edit-group";
import { getGroups } from "../actions/get-groups";

export const editGroup = onRequest(async (request, response) => {
  if (request.method === "OPTIONS") {
    response
      .header("Access-Control-Allow-Origin", "*")
      .header("Access-Control-Allow-Headers", "content-type")
      .sendStatus(204);
  } else {
    try {
      const { userId, groupId, group } = request.body;

      await editGroupAction({ groupId, group });
      const groups = await getGroups({ userId });

      response
        .header("Access-Control-Allow-Origin", "*")
        .header("Access-Control-Allow-Headers", "content-type")
        .status(200)
        .send({ groups });
    } catch ({ status, message }) {
      console.error("error - editGroup", message);
      response
        .header("Access-Control-Allow-Origin", "*")
        .status(status)
        .send({ message });
    }
  }
});
