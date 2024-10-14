import { LINE_PROFILE } from "../constants/endpoints";

interface LineProfileResponse {
  userId: string;
  displayName: string;
  pictureUrl: string;
  statusMessage: string;
}

export async function getLineProfileAction(authToken: string) {
  try {
    const response = await fetch(LINE_PROFILE, {
      headers: {
        Authorization: `Bearer ${authToken}`,
      },
    });

    if (response.ok) {
      const profile = (await response.json()) as LineProfileResponse;
      return profile;
    } else {
      const message = await response.text();
      throw {
        message,
        status: response.status,
      };
    }
  } catch ({ status, message }) {
    throw {
      message,
      status,
    };
  }
}
