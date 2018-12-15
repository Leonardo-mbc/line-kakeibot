import * as fetch from "node-fetch";
import { LINE_AUTH } from "../constants/endpoints";
import { CLIENT_ID, CLIENT_SECRET } from "../constants/secrets";

const redirectUri = encodeURIComponent(
  "https://line-kakeibot.firebaseapp.com/setting/"
);

export async function postAuth(code: string) {
  try {
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
