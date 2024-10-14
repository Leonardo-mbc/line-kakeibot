import React, { useState } from "react";
import SubIcon from "../../assets/images/sub.svg";
import * as styles from "./style.css";

export interface SubButtonProps {
  onConfirm: () => void;
}

export function SubButton(props: SubButtonProps) {
  const [isVisibleAlert, setIsVisibleAlert] = useState(false);

  function handleButtonClick(e: React.MouseEvent<HTMLSpanElement, MouseEvent>) {
    e.stopPropagation();

    if (isVisibleAlert) {
      props.onConfirm();
    } else {
      setIsVisibleAlert(true);
    }
  }

  function handleButtonBlur() {
    setIsVisibleAlert(false);
  }

  return (
    <span
      className={styles.subButton}
      onClick={handleButtonClick}
      tabIndex={1}
      onBlur={handleButtonBlur}
    >
      {isVisibleAlert ? <span>本当に？</span> : <img src={SubIcon} />}
    </span>
  );
}
