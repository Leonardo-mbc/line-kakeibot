import { Group } from '../../common/interfaces/group';
import { Groups } from '../../common/states/groups';
import { ENDPOINT } from '../../common/constants/endpoints';

interface PostGroup {
  userId: string;
  name: string;
  enddate: string;
}

export function postGroup({ userId, name, enddate }: PostGroup): Promise<{ groups: Groups }> {
  return fetch(`${ENDPOINT}/postGroup`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      name,
      enddate,
      userId,
    }),
  })
    .then((response) => {
      if (response.ok) {
        return response.json();
      } else {
        throw {
          message: 'fetch error',
          status: response.status,
        };
      }
    })
    .catch((e) => {
      throw {
        message: 'fetch error',
      };
    });
}

interface EditGroup {
  userId: string;
  groupId: string;
  group: Partial<Group>;
}

export function editGroup({ userId, groupId, group }: EditGroup): Promise<{ groups: Groups }> {
  return fetch(`${ENDPOINT}/editGroup`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      groupId,
      group,
      userId,
    }),
  })
    .then((response) => {
      if (response.ok) {
        return response.json();
      } else {
        throw {
          message: 'fetch error',
          status: response.status,
        };
      }
    })
    .catch((e) => {
      throw {
        message: 'fetch error',
      };
    });
}

interface OutGroup {
  userId: string;
  groupId: string;
}

export function outGroup({ userId, groupId }: OutGroup): Promise<{ groups: Groups }> {
  return fetch(`${ENDPOINT}/outGroup`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      groupId,
      userId,
    }),
  })
    .then((response) => {
      if (response.ok) {
        return response.json();
      } else {
        throw {
          message: 'fetch error',
          status: response.status,
        };
      }
    })
    .catch((e) => {
      throw {
        message: 'fetch error',
      };
    });
}
