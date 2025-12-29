import dayjs from "dayjs";
import React from "react";
import { useRecoilState, useRecoilValue } from "recoil";
import { 
  currentMonthLabel, 
  currentTargetState,
  currentMonthRangeLabel 
} from "../../states/current";
import * as styles from "./style.css";

export function MonthSwitcher() {
  const [currentTarget, setCurrentTarget] = useRecoilState(currentTargetState);
  const monthLabel = useRecoilValue(currentMonthLabel);
  const monthRangeLabel = useRecoilValue(currentMonthRangeLabel);

  function changeMonth(direction: 1 | -1) {
    setCurrentTarget(
      dayjs(currentTarget).add(direction, "month").format("YYYY-MM")
    );
  }

  return (
    <div className={styles.container}>
      <span onClick={() => changeMonth(-1)}>◀</span>
      <div className={styles.labelContainer}>
        <span className={styles.current}>{monthLabel}</span>
        {monthRangeLabel && (
          <span className={styles.range}>{monthRangeLabel}</span>
        )}
      </div>
      <span onClick={() => changeMonth(1)}>▶</span>
    </div>
  );
}
