import React, { useEffect } from "react";
import clsx from "clsx";
import * as styles from "./style.css";
import { availableGroupsIds } from "../../states/groups";
import { selectedGroupIdState } from "../../states/current";
import { useRecoilState, useRecoilValue } from "recoil";
import { receiptsState } from "../../states/receipts";

export function GroupSwitcher() {
  const { groups } = useRecoilValue(receiptsState);
  const [selectedGroupId, setSelectedGroupId] =
    useRecoilState(selectedGroupIdState);
  const availableGroupIds = useRecoilValue(availableGroupsIds);

  useEffect(() => {
    if (availableGroupIds.length && !selectedGroupId) {
      setSelectedGroupId(availableGroupIds[0]);
    }
  }, [availableGroupIds]);

  function changeGroupId(groupId: string) {
    setSelectedGroupId(groupId);
  }

  return (
    <div className={styles.container}>
      <div className={styles.groups}>
        {availableGroupIds.length ? (
          availableGroupIds.map((groupId, key) => {
            return (
              <span
                key={key}
                className={clsx(styles.groupName, {
                  [styles.selected]: selectedGroupId === groupId,
                })}
                onClick={() => changeGroupId(groupId)}
              >
                {groups[groupId].name}
              </span>
            );
          })
        ) : (
          <span className={styles.noData}>データなし</span>
        )}
      </div>
    </div>
  );
}
