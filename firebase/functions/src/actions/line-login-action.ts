import * as fetch from "node-fetch";
import { LINE_AUTH } from "../constants/endpoints";
import { CLIENT_ID, CLIENT_SECRET } from "../constants/secrets";

interface PostAuthParams {
  code: string;
  groupId: string;
}

export async function postAuth({ code, groupId }: PostAuthParams) {
  try {
    const redirectUri = encodeURIComponent(
      `https://7441380c.ngrok.io/add-group/?groupId=${groupId}`
    );
    const response = await fetch(LINE_AUTH, {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded"
      },
      body: `grant_type=authorization_code&code=${code}&redirect_uri=${redirectUri}&client_id=${CLIENT_ID}&client_secret=${CLIENT_SECRET}`
    });

    if (response.ok) {
      const json = await response.json();
      return json;
    } else {
      const message = await response.text();
      throw {
        message,
        status: response.status
      };
    }
  } catch ({ status, message }) {
    throw {
      message,
      status
    };
  }
}
