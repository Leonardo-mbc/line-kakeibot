import React, { useState } from "react";
import { useRecoilState, useRecoilValue, useSetRecoilState } from "recoil";
import { userIdState } from "../../../common/states/users";
import {
  FullScreenMenu,
  MenuItem,
  MenuList,
} from "../../../common/components/full-screen-menu";
import {
  ConfirmPanel,
  ConfirmPanelTitle,
  ConfirmPanelButton,
  ConfirmPanelResponses,
} from "../../../common/components/full-screen-menu/confirm-panel";
import {
  selectedGroupIdState,
  showGroupSettingState,
} from "../../states/groups";
import { editGroup, outGroup } from "../../api/group";

import * as styles from "./style.css";
import { profileGroupState, profileState } from "../../states/profile";
import { isShowLoaderState } from "../../../common/states/loader";
import {
  ERROR_CHANGE_NAME,
  ERROR_EDIT_GROUP,
  ERROR_OUT_GROUP,
} from "../../constants/messages";

export function SettingMenu() {
  const userId = useRecoilValue(userIdState);
  const { groups } = useRecoilValue(profileState);
  const setIsShowLoader = useSetRecoilState(isShowLoaderState);
  const [showGroupSetting, setShowGroupSetting] = useRecoilState(
    showGroupSettingState
  );
  const [selectedGroupId, setSelectedGroupId] =
    useRecoilState(selectedGroupIdState);
  const setGroups = useSetRecoilState(profileGroupState);

  const [showChangeNamePopup, setShowChangeNamePopup] = useState(false);
  const [showChangeEnddatePopup, setShowChangeEnddatePopup] = useState(false);
  const [showChangeMonthStartPopup, setShowChangeMonthStartPopup] =
    useState(false);
  const [showLeavePopup, setShowLeavePopup] = useState(false);
  const [groupName, setGroupName] = useState("");
  const [groupEnddate, setGroupEnddate] = useState("");
  const [monthStartDay, setMonthStartDay] = useState(1);

  function handleMenuHide() {
    clearInput();
    closeMenu();
  }

  function openChangeNamePopup() {
    setShowChangeNamePopup(true);
  }

  function openChangeEnddatePopup() {
    setShowChangeEnddatePopup(true);
  }

  function openChangeMonthStartPopup() {
    const currentMonthStartDay = groups[selectedGroupId]?.monthStartDay || 1;
    setMonthStartDay(currentMonthStartDay);
    setShowChangeMonthStartPopup(true);
  }

  function openLeavePopup() {
    setShowLeavePopup(true);
  }

  function handleGroupNameInput(e: React.ChangeEvent<HTMLInputElement>) {
    setGroupName(e.target.value);
  }

  function handleGroupEnddateInput(e: React.ChangeEvent<HTMLInputElement>) {
    setGroupEnddate(e.target.value);
  }

  function handleMonthStartDayChange(e: React.ChangeEvent<HTMLSelectElement>) {
    setMonthStartDay(Number(e.target.value));
  }

  function closeMenu() {
    setShowGroupSetting(false);
    setShowChangeNamePopup(false);
    setShowChangeEnddatePopup(false);
    setShowChangeMonthStartPopup(false);
    setShowLeavePopup(false);
  }

  function clearInput() {
    setSelectedGroupId("");
    setGroupName("");
    setGroupEnddate("");
    setMonthStartDay(1);
  }

  async function changeGroupName() {
    if (groupName) {
      setIsShowLoader(true);
      try {
        const { groups } = await editGroup({
          groupId: selectedGroupId,
          userId,
          group: { name: groupName },
        });
        setGroups(groups);
      } catch (e) {
        window.alert(ERROR_CHANGE_NAME);
      } finally {
        closeMenu();
        setIsShowLoader(false);
      }
    }
  }

  async function changeGroupEnddate(noLimit: boolean = false) {
    if (noLimit || groupEnddate) {
      setIsShowLoader(true);
      try {
        const { groups } = await editGroup({
          groupId: selectedGroupId,
          userId,
          group: { enddate: noLimit ? "" : groupEnddate },
        });
        setGroups(groups);
      } catch (e) {
        window.alert(ERROR_EDIT_GROUP);
      } finally {
        closeMenu();
        setIsShowLoader(false);
      }
    }
  }

  async function changeMonthStartDay() {
    if (monthStartDay) {
      setIsShowLoader(true);
      try {
        const { groups } = await editGroup({
          groupId: selectedGroupId,
          userId,
          group: { monthStartDay },
        });
        setGroups(groups);
      } catch (e) {
        window.alert(ERROR_EDIT_GROUP);
      } finally {
        closeMenu();
        setIsShowLoader(false);
      }
    }
  }

  async function leaveGroup() {
    setIsShowLoader(true);
    try {
      const { groups } = await outGroup({ groupId: selectedGroupId, userId });
      setGroups(groups);
    } catch (e) {
      window.alert(ERROR_OUT_GROUP);
    } finally {
      closeMenu();
      setIsShowLoader(false);
    }
  }

  return (
    <FullScreenMenu isShow={showGroupSetting} onHide={handleMenuHide}>
      <MenuList>
        <MenuItem type="transparent">キャンセル</MenuItem>
        <MenuItem onClick={openChangeNamePopup}>家計簿名を変更</MenuItem>
        <MenuItem onClick={openChangeEnddatePopup}>期限を変更</MenuItem>
        <MenuItem onClick={openChangeMonthStartPopup}>
          月の開始日を変更
        </MenuItem>
        <MenuItem onClick={openLeavePopup} type="warning">
          退出
        </MenuItem>
      </MenuList>

      <ConfirmPanel isShow={showChangeNamePopup}>
        <ConfirmPanelTitle>家計簿名の変更</ConfirmPanelTitle>
        <div className={styles.enddateInputContainer}>
          <div className={styles.enddateInput}>
            <label htmlFor="group-change-name-input">家計簿名</label>
            <input
              id="group-change-name-input"
              type="text"
              name="group-changed-name"
              maxLength={20}
              value={groupName}
              onChange={handleGroupNameInput}
            />
          </div>
          <button
            id="group-change-name-button"
            className={styles.groupChangeButton}
            onClick={changeGroupName}
          >
            変更する
          </button>
        </div>
      </ConfirmPanel>

      <ConfirmPanel isShow={showChangeEnddatePopup}>
        <ConfirmPanelTitle>いつまでにしますか？</ConfirmPanelTitle>
        <div className={styles.enddateInputContainer}>
          <div className={styles.enddateInput}>
            <label htmlFor="group-change-enddate-input">期限</label>
            <input
              id="group-change-enddate-input"
              type="date"
              name="group-changed-enddate"
              value={groupEnddate}
              onChange={handleGroupEnddateInput}
            />
            <button onClick={() => changeGroupEnddate(true)}>期限なし</button>
          </div>
          <button
            className={styles.groupChangeButton}
            onClick={() => changeGroupEnddate()}
          >
            変更する
          </button>
        </div>
      </ConfirmPanel>

      <ConfirmPanel isShow={showChangeMonthStartPopup}>
        <ConfirmPanelTitle>月の開始日を変更</ConfirmPanelTitle>
        <div className={styles.enddateInputContainer}>
          <div className={styles.enddateInput}>
            <label htmlFor="month-start-day-select">開始日</label>
            <select
              id="month-start-day-select"
              value={monthStartDay}
              onChange={handleMonthStartDayChange}
            >
              {Array.from({ length: 28 }, (_, i) => i + 1).map((day) => (
                <option key={day} value={day}>
                  {day}日{day === 1 ? "（通常）" : ""}
                </option>
              ))}
            </select>
          </div>
          <div className={styles.monthStartNotice}>
            ⚠️ この変更は家計簿に参加している
            <br />
            メンバー全員に適用されます
          </div>
          <button
            id="month-start-day-button"
            className={styles.groupChangeButton}
            onClick={changeMonthStartDay}
          >
            変更する
          </button>
        </div>
      </ConfirmPanel>

      <ConfirmPanel isShow={showLeavePopup}>
        <ConfirmPanelTitle>
          本当に
          <span id="out-group-name" className={styles.outGroupName}>
            {groups[selectedGroupId]?.name}
          </span>
          から退出しますか
        </ConfirmPanelTitle>
        <ConfirmPanelResponses>
          <ConfirmPanelButton onClick={leaveGroup}>はい</ConfirmPanelButton>
          <ConfirmPanelButton type="cancel" onClick={closeMenu}>
            キャンセル
          </ConfirmPanelButton>
        </ConfirmPanelResponses>
      </ConfirmPanel>
    </FullScreenMenu>
  );
}
