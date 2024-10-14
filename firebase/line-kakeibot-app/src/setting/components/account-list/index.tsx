import clsx from "clsx";
import React, { useState } from "react";
import liff from "@line/liff";
import { useRecoilState, useRecoilValue, useSetRecoilState } from "recoil";
import { ERROR_POST_GROUP } from "../../constants/messages";
import { userIdState } from "../../../common/states/users";
import { postGroup } from "../../api/group";
import { profileGroupState, profileState } from "../../states/profile";
import * as styles from "./style.css";
import {
  selectedGroupIdState,
  showGroupSettingState,
} from "../../states/groups";

export function AccountList() {
  const { groups } = useRecoilValue(profileState);
  const setGroups = useSetRecoilState(profileGroupState);
  const userId = useRecoilValue(userIdState);
  const [selectedGroupId, setSelectedGroupId] =
    useRecoilState(selectedGroupIdState);
  const setShowGroupSetting = useSetRecoilState(showGroupSettingState);
  const [showArchives, setShowArchives] = useState(false);
  const [showGroupAdd, setShowGroupAdd] = useState(false);
  const [showEnddateInput, setShowEnddateInput] = useState(false);
  const [groupName, setGroupName] = useState("");
  const [groupEnddate, setGroupEnddate] = useState("");
  const [isGroupAdding, setIsGroupAdding] = useState(false);

  function toggleArchives() {
    setShowArchives(!showArchives);
  }

  function showGroupAddPanel() {
    setShowGroupAdd(true);
  }

  function showEnddatePanel() {
    setShowEnddateInput(true);
  }

  function handleGroupNameChange(e: React.ChangeEvent<HTMLInputElement>) {
    setGroupName(e.target.value);
  }

  function handleGroupEnddateChange(e: React.ChangeEvent<HTMLInputElement>) {
    setGroupEnddate(e.target.value);
  }

  function clearInput() {
    setGroupName("");
    setGroupEnddate("");
    setShowEnddateInput(false);
    setShowGroupAdd(false);
    setIsGroupAdding(false);
  }

  async function submit() {
    if (!isGroupAdding && groupName) {
      try {
        setIsGroupAdding(true);
        const { groups } = await postGroup({
          userId,
          name: groupName,
          enddate: groupEnddate,
        });
        setGroups(groups);
        clearInput();
      } catch (e) {
        window.alert(ERROR_POST_GROUP);
      }
    }
  }

  function clickInvite({ name, groupId }: { name: string; groupId: string }) {
    liff.openWindow({
      url: `https://line-kakeibot.appspot.com/invite-group?groupId=${groupId}&name=${encodeURIComponent(
        name
      )}`,
    });
  }

  function openSetting(gruopId: string) {
    setSelectedGroupId(gruopId);
    setShowGroupSetting(true);
  }

  const currentDate = new Date().getTime();
  const groupItems =
    Object.keys(groups).length !== 0 &&
    Object.keys(groups).map((key) => {
      const datetime = new Date(groups[key].enddate);
      const limitDatetime = datetime.setDate(datetime.getDate() + 1);

      return {
        active: !groups[key].enddate || currentDate < limitDatetime,
        element: (
          <div
            className={clsx(styles.groupItem, {
              [styles.selected]: selectedGroupId === key,
            })}
            key={key}
          >
            <div className={styles.groupNamedate}>
              <span className={styles.groupName}>{groups[key].name}</span>
              <span className={styles.groupEnddate}>{`期限：${
                groups[key].enddate || "なし"
              }`}</span>
            </div>
            <div className={styles.groupButtons}>
              <button
                className={clsx(styles.groupButton, styles.invite)}
                onClick={() =>
                  clickInvite({ name: groups[key].name, groupId: key })
                }
              >
                招待
              </button>
              <button
                className={styles.groupSetting}
                onClick={() => openSetting(key)}
              />
            </div>
          </div>
        ),
      };
    });

  return (
    <React.Fragment>
      {groupItems ? (
        <React.Fragment>
          <div className={styles.groupList}>
            {groupItems
              .filter((item) => item.active)
              .map((item) => item.element)}
          </div>
          <div
            className={clsx(
              styles.showArchives,
              { [styles.open]: showArchives },
              {
                [styles.hide]:
                  groupItems.filter((item) => !item.active).length === 0,
              }
            )}
            onClick={toggleArchives}
          >
            <span />
          </div>
          <div
            className={clsx(styles.groupList, styles.archived, {
              [styles.hide]: !showArchives,
            })}
          >
            {groupItems
              .filter((item) => !item.active)
              .map((item) => item.element)}
          </div>
        </React.Fragment>
      ) : (
        <div className={styles.groupList}>
          <span className={styles.noGroupsText}>家計簿がありません</span>
        </div>
      )}
      <div
        className={clsx(styles.groupAddContainer, {
          [styles.hide]: !showGroupAdd,
        })}
      >
        <div className={styles.groupAddInput}>
          <div className={styles.groupAddInputName}>
            <label htmlFor="group-name">
              家計簿名<span>(20文字まで)</span>
            </label>
            <input
              type="text"
              id="group-name"
              value={groupName}
              onChange={handleGroupNameChange}
              maxLength={20}
            />
          </div>
          <div className={styles.groupAddEnddate}>
            <label htmlFor="group-enddate-input">期限</label>
            <input
              className={clsx({ [styles.hide]: !showEnddateInput })}
              type="date"
              id="group-enddate-input"
              value={groupEnddate}
              onChange={handleGroupEnddateChange}
            />
            <button
              className={clsx({ [styles.hide]: showEnddateInput })}
              onClick={showEnddatePanel}
            >
              設ける
            </button>
          </div>
        </div>
        <span className={styles.groupAddNotice}>
          期限は一時的な用途に便利です（飲み会・旅行など）
        </span>
        <button
          className={clsx(styles.groupAddButton, {
            [styles.loading]: isGroupAdding,
          })}
          onClick={submit}
        >
          作成する
        </button>
      </div>
      <button
        className={clsx(styles.addButton, { [styles.hide]: showGroupAdd })}
        onClick={showGroupAddPanel}
      >
        ＋追加
      </button>
    </React.Fragment>
  );
}
