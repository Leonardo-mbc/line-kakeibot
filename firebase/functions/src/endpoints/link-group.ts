import { onRequest } from "firebase-functions/v2/https";
import { postAuth } from "../actions/line-login-action";
import { getLineProfileAction } from "../actions/get-line-profile-action";
import { linkGroupAction } from "../actions/link-group-action";

export const linkGroup = onRequest(async (request, response) => {
  try {
    const { code, groupId } = request.query as { [key: string]: string };
    const auth = await postAuth({ code, groupId });
    const lineProfile = await getLineProfileAction(auth.access_token);
    const { name } = await linkGroupAction({
      userId: lineProfile.userId,
      groupId,
    });

    response
      .header("Access-Control-Allow-Origin", "*")
      .status(200)
      .send({ name });
  } catch ({ status, message }) {
    console.error("error - lineLoginAuth", message);
    response
      .header("Access-Control-Allow-Origin", "*")
      .status(status)
      .send({ message });
  }
});
