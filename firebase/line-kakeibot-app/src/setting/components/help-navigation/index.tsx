import React from "react";
import { useSetRecoilState } from "recoil";
import { showTutorialState, tutorialPageState } from "../../states/tutorial";
import * as styles from "./style.css";

export function HelpNavigation() {
  const setShowTutorial = useSetRecoilState(showTutorialState);
  const setPage = useSetRecoilState(tutorialPageState);

  function showTutorial() {
    setPage(0);
    setShowTutorial(true);
  }
  return (
    <span className={styles.help} onClick={showTutorial}>
      ヘルプ
    </span>
  );
}
