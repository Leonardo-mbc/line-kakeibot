import liff from '@line/liff';
import { v4 as uuid } from 'uuid';
import { atom, selector } from 'recoil';
import { Groups } from '../../common/states/groups';
import { userIdState } from '../../common/states/users';
import { getProfile, postName } from '../api/profile';

export const emptyProfileValue: Profile = { groups: {}, name: '', showFirstTimeTutorial: false };

export interface ProfileResponse {
  groups: Groups;
  name: string;
}

export interface Profile extends ProfileResponse {
  showFirstTimeTutorial: boolean;
}

let currentSessionId: string = '';
let currentProfileResponse: ProfileResponse = emptyProfileValue;

export const profileState = selector<Profile>({
  key: 'api/profileState',
  get: async ({ get }) => {
    const userId = get(userIdState);
    const name = get(profileNameState);
    const groups: Groups = get(profileGroupState);
    const sessionId = get(sessionIdState);

    if (userId) {
      if (currentSessionId !== sessionId) {
        currentProfileResponse = await getProfile(userId);
        currentSessionId = sessionId;
      } else {
        currentProfileResponse = {
          ...currentProfileResponse,
          ...(name ? { name } : null),
          groups,
        };
      }

      if (currentProfileResponse.name) {
        return {
          ...currentProfileResponse,
          showFirstTimeTutorial: false,
        };
      } else {
        const liffProfile = await liff.getProfile();

        await postName({
          name: liffProfile.displayName,
          userId,
        });

        return {
          ...currentProfileResponse,
          name: liffProfile.displayName,
          showFirstTimeTutorial: true,
        };
      }
    } else {
      return emptyProfileValue;
    }
  },
});

export const sessionIdState = atom({
  key: 'atom:sessionId',
  default: uuid(),
});

export const profileNameState = atom({
  key: 'atom:profileNameState',
  default: '',
});

export const profileGroupState = atom({
  key: 'atom:profileGroupState',
  default: {},
});
