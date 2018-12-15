import * as fetch from "node-fetch";
import { LINE_PROFILE } from "../constants/endpoints";

export async function getLineProfileAction(authBearer: string) {
  try {
    const response = await fetch(LINE_PROFILE, {
      headers: {
        Authorization: authBearer
      }
    });

    if (response.ok) {
      const profile = await response.json();
      return profile;
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
