import { selector } from 'recoil';
import { receiptsState } from './receipts';
import { currentTargetState } from './current';

export const availableGroupsIds = selector({
  key: 'selector/availableGroupsIds',
  get: async ({ get }) => {
    const currentTarget = get(currentTargetState);
    const { groups } = get(receiptsState);

    const currentDate = new Date(currentTarget).getTime();
    return Object.keys(groups).filter(
      (groupId) =>
        !groups[groupId].enddate || currentDate <= new Date(groups[groupId].enddate).getTime()
    );
  },
});
