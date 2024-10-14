import React from "react";
import liff from "@line/liff";
import { useRecoilValue } from "recoil";
import * as styles from "./style.css";
import { priceState } from "../../states/input-form";

export function SubmitButton() {
  const price = useRecoilValue(priceState);

  function submit() {
    liff
      .sendMessages([
        {
          type: "text",
          text: `${price}`,
        },
      ])
      .then(function () {
        liff.closeWindow();
      })
      .catch(function (error) {
        window.alert(
          "メッセージの送信に失敗しました、トーク画面で開いていますか？: " +
            error
        );
      });
  }
  return (
    <button className={styles.submit} onClick={submit}>
      決定
    </button>
  );
}
