import React from "react";
import liff from "@line/liff";
import { useRecoilValue } from "recoil";
import * as styles from "./style.css";
import { userIdState } from "../../../common/states/users";

export function InquiryBlock() {
  const userId = useRecoilValue(userIdState);

  function openForm() {
    liff.openWindow({
      url: `https://docs.google.com/forms/d/e/1FAIpQLSeBu603ocQR4f08xhl1wQ0fRmNke813FvODiKs4hiuefO0K5w/viewform?usp=pp_url&entry.1546140386=${userId}`,
    });
  }

  return (
    <div className={styles.inquiryBlock} onClick={openForm}>
      <span>改善要望・お問い合わせはこちら</span>
    </div>
  );
}
