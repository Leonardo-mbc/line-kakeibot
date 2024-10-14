import dayjs from "dayjs";
import React from "react";
import { useRecoilState, useRecoilValue } from "recoil";
import { currentMonthLabel, currentTargetState } from "../../states/current";
import * as styles from "./style.css";

export function MonthSwitcher() {
  const [currentTarget, setCurrentTarget] = useRecoilState(currentTargetState);
  const monthLabel = useRecoilValue(currentMonthLabel);

  function changeMonth(direction: 1 | -1) {
    setCurrentTarget(
      dayjs(currentTarget).add(direction, "month").format("YYYY-MM")
    );
  }

  return (
    <div className={styles.container}>
      <span onClick={() => changeMonth(-1)}>◀</span>
      <span className={styles.current}>{monthLabel}</span>
      <span onClick={() => changeMonth(1)}>▶</span>
    </div>
  );
}
