import React from 'react';
import { render } from 'react-dom';
import { RecoilRoot, atom, useRecoilState } from 'recoil';
import '@global-style/global';

render(
  <RecoilRoot>
    <div id="loader" className="loader"></div>
    <div className="container">
      <div className="groups-container">
        <div id="groups" className="groups">
          <span className="group-name selected">○○○</span>
          <span className="group-name">○○○</span>
          <span className="group-name">○○○</span>
          <span className="group-name">○○○</span>
        </div>
      </div>
      <div className="month-container">
        <span id="before-month">◀</span>
        <span id="current-month" className="current">
          00月
        </span>
        <span id="next-month">▶</span>
      </div>
      <div id="users" className="users-container">
        <div className="user">
          <span className="name">○○○</span>
          <span className="price">0,000</span>
        </div>
        <div className="user">
          <span className="name">○○○</span>
          <span className="price">0,000</span>
        </div>
        <div className="user">
          <span className="name">○○○</span>
          <span className="price">0,000</span>
        </div>
      </div>
      <div className="details-container">
        <div className="details-label">
          <span>うちわけ</span>
        </div>
        <div id="details" className="details-table">
          <div className="detail">
            <div className="detail-item">
              <div className="top">
                <span>○○○</span>
                <span>0,000</span>
              </div>
              <div className="bottom">
                <span>○○○</span>
                <span>0000-00-00 00:00:00</span>
              </div>
            </div>
            <img src="images/menu-dot.png" />
          </div>
          <div className="detail">
            <div className="detail-item">
              <div className="top">
                <span>○○○</span>
                <span>0,000</span>
              </div>
              <div className="bottom">
                <span>○○○</span>
                <span>0000-00-00 00:00:00</span>
              </div>
            </div>
            <img src="images/menu-dot.png" />
          </div>
        </div>
      </div>
      <div id="menu-container" className="menu-container hide transparent">
        <div className="menu-list-container">
          <span className="menu-item cancel">キャンセル</span>
          <span id="move-account" className="menu-item">
            別の家計簿に移行
          </span>
          <span id="delete-payment" className="menu-item delete">
            削除
          </span>
        </div>
        <div id="delete-confirm" className="delete-confirm-container hide">
          <div className="delete-confirm">
            <span>本当に削除しますか</span>
            <div className="delete-answers">
              <span id="delete-yes" className="delete-button yes">
                はい
              </span>
              <span className="delete-button cancel">キャンセル</span>
            </div>
          </div>
        </div>
        <div id="account-select" className="account-select-container hide loading">
          <div className="account-list-container">
            <span className="account-list-title">どの家計簿に移動する？</span>
            <div id="account-list" className="account-list"></div>
          </div>
        </div>
      </div>
      <div id="split-view-container" className="split-view-container hide transparent">
        <div className="split-list-container">
          <div id="split-list" className="split-list">
            <div id="split-list-detail" className="split-list-detail"></div>
          </div>
        </div>
      </div>
    </div>
  </RecoilRoot>,
  document.getElementById('app')
);
