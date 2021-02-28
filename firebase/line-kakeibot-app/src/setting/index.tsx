import React, { Suspense, useEffect } from 'react';
import liff from '@line/liff';
import { render } from 'react-dom';
import { RecoilRoot, useRecoilState, useRecoilValue, useRecoilValueLoadable } from 'recoil';
import './root.css';
import { TitleLabel } from '../common/components/title-label';
import { HelpNavigation } from './components/help-navigation';
import { Block } from '../common/components/block';
import { AccountList } from './components/account-list';
import { NameBlockInner } from './components/name-block-inner';
import { InquiryBlock } from './components/inquiry-block';
import { Tutorial } from './components/tutorial';
import { SettingMenu } from './components/setting-menu';
import { userIdState } from '../common/states/users';
import { isShowLoaderState } from '../common/states/loader';
import { profileState } from './states/profile';
import { Loader } from '../common/components/loader';
import { AccountsSubtitle } from './components/accounts-subtitle';

liff.init({ liffId: '1629647599-GD7Lq1ny' });

function App() {
  const [userId, setUserId] = useRecoilState(userIdState);
  const [isShowLoader, setIsShowLoader] = useRecoilState(isShowLoaderState);
  const { state } = useRecoilValueLoadable(profileState);

  useEffect(() => {
    liff.ready.then(() => {
      if (!liff.isLoggedIn()) {
        liff.login();
      } else {
        const context = liff.getContext();
        const userId = context?.userId || '';

        setUserId(userId);
      }
    });
  }, []);

  useEffect(() => {
    if (userId && state === 'hasValue') {
      setIsShowLoader(false);
    } else {
      setIsShowLoader(true);
    }
  }, [userId, state]);

  return (
    <React.Fragment>
      <Suspense fallback={null}>
        <TitleLabel>かけいぼっと設定</TitleLabel>
        <HelpNavigation />
        <Block title="あなたの名前">
          <NameBlockInner />
        </Block>
        <Block title="家計簿" subTitle={<AccountsSubtitle />}>
          <AccountList />
        </Block>
        <InquiryBlock />
        <Tutorial />
        <SettingMenu />
      </Suspense>
      <Loader isShow={isShowLoader} />
    </React.Fragment>
  );
}

render(
  <RecoilRoot>
    <App />
  </RecoilRoot>,
  document.getElementById('app')
);
