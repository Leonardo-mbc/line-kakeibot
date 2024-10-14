import React from "react";
import * as styles from "./style.css";

interface Props {
  title: string;
  subTitle?: React.ReactNode | string;
  children: React.ReactNode | string;
}

export function Block({ title, subTitle, children }: Props) {
  return (
    <div className={styles.block}>
      <span className={styles.blockTitle}>
        {title}
        {subTitle}
      </span>
      <div className={styles.blockBody}>{children}</div>
    </div>
  );
}
