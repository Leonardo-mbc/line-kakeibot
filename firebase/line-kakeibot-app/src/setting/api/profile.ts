import { emptyProfileValue, ProfileResponse } from "../states/profile";
import { ERROR_GET_PROFILE } from "../constants/messages";

export async function getProfile(userId: string): Promise<ProfileResponse> {
  try {
    const response = await fetch(
      `https://getprofilev2-hcv64sau7a-uc.a.run.app?userId=${userId}`
    );

    if (response.ok) {
      return response.json();
    } else {
      return emptyProfileValue;
    }
  } catch (e) {
    window.alert(ERROR_GET_PROFILE);
    return emptyProfileValue;
  }
}

interface PostName {
  userId: string;
  name: string;
}

export function postName({
  userId,
  name,
}: PostName): Promise<{ name: string }> {
  return fetch(`https://postnamev2-hcv64sau7a-uc.a.run.app`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      name,
      userId,
    }),
  }).then((response) => {
    if (response.ok) {
      return response.json();
    } else {
      throw {
        message: "fetch error",
        status: response.status,
      };
    }
  });
}
