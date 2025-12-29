import React, { useState } from "react";
import clsx from "clsx";
import dayjs from "dayjs";
import { v4 as uuid } from "uuid";
import * as styles from "./style.css";
import { useRecoilValue, useSetRecoilState } from "recoil";
import { receiptsState, sessionIdState } from "../../states/receipts";
import {
  currentTargetState,
  selectedGroupIdState,
  selectedPaymentState,
} from "../../states/current";
import { userIdState } from "../../../common/states/users";
import { isShowLoaderState } from "../../../common/states/loader";
import { hideAllMenuSelector } from "../../states/menu";
import { changeBoughtAt } from "../../api/receipts";

export function ChangeDateModal() {
  const userId = useRecoilValue(userIdState);
  const { receipts, groups } = useRecoilValue(receiptsState);
  const selectedGroupId = useRecoilValue(selectedGroupIdState);
  const currentTarget = useRecoilValue(currentTargetState);
  const selectedPaymentId = useRecoilValue(selectedPaymentState);
  const setSessionId = useSetRecoilState(sessionIdState);
  const setIsShowLoader = useSetRecoilState(isShowLoaderState);
  const hideAllMenu = useSetRecoilState(hideAllMenuSelector);

  const item = receipts[selectedGroupId]?.[selectedPaymentId];
  const currentDate = item ? dayjs(item.boughtAt).format("YYYY-MM-DD") : "";
  const currentTime = item ? dayjs(item.boughtAt).format("HH:mm:ss") : "";

  const [selectedDate, setSelectedDate] = useState(currentDate);
  const [showMonthWarning, setShowMonthWarning] = useState(false);

  // グループの作成日と終了日を取得
  const group = groups[selectedGroupId];
  const minDate = "2020-01-01"; // グループ作成日の代わり（実装により調整）
  const maxDate = dayjs().format("YYYY-MM-DD");
  const endDate = group?.enddate
    ? dayjs(group.enddate).format("YYYY-MM-DD")
    : maxDate;
  const actualMaxDate = endDate < maxDate ? endDate : maxDate;

  function handleDateChange(e: React.ChangeEvent<HTMLInputElement>) {
    const newDate = e.target.value;
    setSelectedDate(newDate);

    // 月が変わる場合は警告を表示
    const oldMonth = dayjs(currentDate).format("YYYY-MM");
    const newMonth = dayjs(newDate).format("YYYY-MM");
    setShowMonthWarning(oldMonth !== newMonth);
  }

  function handleContainerClick() {
    hideAllMenu(null);
  }

  function stopPropagation(e: React.MouseEvent) {
    e.stopPropagation();
  }

  async function handleSave() {
    if (!selectedDate || selectedDate === currentDate) {
      hideAllMenu(null);
      return;
    }

    setIsShowLoader(true);
    hideAllMenu(null);

    try {
      const newBoughtAt = `${selectedDate} ${currentTime}`;
      await changeBoughtAt({
        userId,
        groupId: selectedGroupId,
        paymentId: selectedPaymentId,
        currentMonth: currentTarget,
        newBoughtAt,
      });

      // データを再取得
      setSessionId(uuid());
    } catch (error) {
      console.error("Failed to change date:", error);
      alert("日付の変更に失敗しました");
    } finally {
      setIsShowLoader(false);
    }
  }

  if (!item) {
    return null;
  }

  return (
    <div className={styles.container} onClick={handleContainerClick}>
      <div className={styles.modal} onClick={stopPropagation}>
        <div className={styles.title}>日付を変更</div>
        <div className={styles.content}>
          <div className={styles.currentDate}>
            現在: {dayjs(item.boughtAt).format("YYYY年MM月DD日")}
          </div>

          <div className={styles.inputContainer}>
            <label htmlFor="date-input">新しい日付</label>
            <input
              id="date-input"
              type="date"
              value={selectedDate}
              min={minDate}
              max={actualMaxDate}
              onChange={handleDateChange}
            />
          </div>

          <div className={styles.notice}>※時刻は変更できません</div>

          {showMonthWarning && (
            <div className={styles.warning}>
              ⚠️{" "}
              {`${dayjs(currentDate).format("M月")}から${dayjs(
                selectedDate
              ).format("M月")}に移動します`}
            </div>
          )}
        </div>

        <div className={styles.buttons}>
          <button
            className={clsx(styles.button, styles.cancel)}
            onClick={handleContainerClick}
          >
            キャンセル
          </button>
          <button
            className={clsx(styles.button, styles.save)}
            onClick={handleSave}
            disabled={!selectedDate || selectedDate === currentDate}
          >
            保存
          </button>
        </div>
      </div>
    </div>
  );
}
