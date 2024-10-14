import React, { useEffect } from "react";
import clsx from "clsx";
import * as styles from "./style.css";

import logoImg from "../../assets/images/logo.png";
import tuImg01 from "../../assets/images/01-photo.png";
import tuImg02 from "../../assets/images/02-send.png";
import tuImg03 from "../../assets/images/03-answer.png";
import tuImg04 from "../../assets/images/04-group.png";
import { useRecoilValue, useRecoilState } from "recoil";
import { profileState } from "../../states/profile";
import { showTutorialState, tutorialPageState } from "../../states/tutorial";

const MAX_PAGE = 5;

export function Tutorial() {
  const { showFirstTimeTutorial } = useRecoilValue(profileState);
  const [showTutorial, setShowTutorial] = useRecoilState(showTutorialState);
  const [page, setPage] = useRecoilState(tutorialPageState);

  const pagerStyle = {
    transform: `translate3d(-${page * 100}%, 0px, 0px)`,
  };

  function movePage(dir: 1 | -1) {
    setPage(page + dir);
  }

  function closeTutorial() {
    setShowTutorial(false);
  }

  useEffect(() => {
    if (showFirstTimeTutorial) {
      setShowTutorial(true);
    }
  }, [showFirstTimeTutorial]);

  return (
    <div
      className={clsx(styles.tutorialContainer, {
        [styles.hide]: !showTutorial,
      })}
    >
      <div className={styles.tutorialPager} style={pagerStyle}>
        <div className={styles.tutorialPage}>
          <img src={logoImg} height="100px" />
          <span className={styles.title}>かけいぼっと</span>
          <p className={styles.bold}>ようこそ！</p>
          <p>
            ここでは使い方を紹介します！
            <br />
            次ページへのボタンを押してください
          </p>
        </div>
        <div className={styles.tutorialPage}>
          <span className={styles.tutorialText}>
            まずはレシートの写真を撮ります
          </span>
          <img src={tuImg01} height="200px" />
          <span className={styles.tutorialDetails}>
            レシートである必要はありませんが
            <br />
            あとで見返す時に便利なのでオススメです
          </span>
        </div>
        <div className={styles.tutorialPage}>
          <span className={styles.tutorialText}>
            かけいぼっとが入ってるルームで
            <br />
            写真／画像を送ります
          </span>
          <img src={tuImg02} height="200px" />
          <span className={styles.tutorialDetails}>
            家族や友達と一緒に家計簿をつけている場合は
            <br />
            ルームを作ってかけいぼっとを使うと便利です
          </span>
        </div>
        <div className={styles.tutorialPage}>
          <span className={styles.tutorialText}>
            かけいぼっとの質問に答えると
            <br />
            家計簿に記録されていきます
          </span>
          <img src={tuImg03} height="200px" />
          <span className={styles.tutorialDetails}>
            登録が終わると、集計結果を送ってきます
          </span>
          <span className={styles.tutorialText}>操作はこれだけです！</span>
        </div>
        <div className={styles.tutorialPage}>
          <span className={styles.tutorialText}>
            まずは新しい家計簿を作ってください
          </span>
          <img src={tuImg04} height="200px" />
          <span className={styles.tutorialDetails}>
            登録は家計簿ごとに行えます
            <br />
            よく決済をともにする人を家計簿に招待しましょう
            <br />
            招待は家計簿を作成した後、設定から行えます
          </span>
        </div>
        <div className={styles.tutorialPage}>
          <img src={logoImg} height="100px" />
          <span className={styles.title}>かけいぼっと</span>
          <p className={styles.bold}>さあ、始めましょう！</p>
          <span className={styles.tutorialDetails}>
            使い方説明は設定からいつでも見れます
          </span>
        </div>
      </div>
      <span className={styles.tutorialSkip} onClick={closeTutorial}>
        とじる
      </span>
      <span
        className={clsx(styles.nextPage, { [styles.hide]: page === MAX_PAGE })}
        onClick={() => movePage(1)}
      >
        次のページへ ▶
      </span>
      <span
        className={clsx(styles.letsStart, { [styles.hide]: page !== MAX_PAGE })}
        onClick={closeTutorial}
      >
        はじめる
      </span>
      <span
        className={clsx(styles.beforePage, { [styles.hide]: page === 0 })}
        onClick={() => movePage(-1)}
      >
        ◀ 前のページへ
      </span>
    </div>
  );
}
