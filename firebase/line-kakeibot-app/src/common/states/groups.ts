import { selector } from 'recoil';
import { getReceiptsData } from '../../accounts/api/receipts';
import { currentTargetState } from '../../accounts/states/current';

export interface Group {
  enddate: string;
  name: string;
  users: string[];
}

export interface Groups {
  [key: string]: Group;
}

export const availableGroupsIds = selector({
  key: 'selector/availableGroupsIds',
  get: async ({ get }) => {
    const currentTarget = get(currentTargetState);
    const { groups } = get(getReceiptsData);

    const currentDate = new Date(currentTarget).getTime();
    return Object.keys(groups).filter(
      (groupId) =>
        !groups[groupId].enddate || currentDate <= new Date(groups[groupId].enddate).getTime()
    );
  },
});
