import React, { useEffect, Suspense } from 'react';
import liff from '@line/liff';
import { render } from 'react-dom';
import { RecoilRoot, useRecoilValue, useRecoilValueLoadable, useRecoilState } from 'recoil';
import { Loader } from '../common/components/loader';
import { GroupSwitcher } from './components/group-switcher';
import { MonthSwitcher } from './components/month-switcher';
import { UsersList } from './components/users-list';
import { SplitButton } from './components/split-button';
import { DetailsList } from './components/details-list';
import { userIdState } from './states/users';
import { FullScreenMenu } from './components/full-screen-menu';
import { DeleteConfirm } from './components/delete-confirm';
import { MoveAccountConfirm } from './components/move-account-confirm';
import {
  isShowDeleteConfirmState,
  isShowMoveConfirmState,
  isShowSplitViewState,
} from './states/menu';
import { SplitView } from './components/split-view';
import { isShowLoaderState } from './states/loader';
import { getReceiptsData } from './api/receipts';
import './root.css';

liff.init({ liffId: '1629647599-egprkJMb' });

function App() {
  const [userId, setUserId] = useRecoilState(userIdState);
  const { state } = useRecoilValueLoadable(getReceiptsData);
  const isShowMoveConfirm = useRecoilValue(isShowMoveConfirmState);
  const isShowDeleteConfirm = useRecoilValue(isShowDeleteConfirmState);
  const isShowSplitView = useRecoilValue(isShowSplitViewState);
  const [isShowLoader, setIsShowLoader] = useRecoilState(isShowLoaderState);

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
      {userId && state === 'hasValue' && (
        <Suspense fallback={null}>
          <GroupSwitcher />
          <MonthSwitcher />
          <UsersList>
            <SplitButton />
          </UsersList>
          <DetailsList />
          <FullScreenMenu>
            <React.Fragment>
              {isShowDeleteConfirm && <DeleteConfirm />}
              {isShowMoveConfirm && <MoveAccountConfirm />}
            </React.Fragment>
          </FullScreenMenu>

          <SplitView isShow={isShowSplitView} />
        </Suspense>
      )}
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
