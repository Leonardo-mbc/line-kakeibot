import React, { useEffect, Suspense } from "react";
import liff from "@line/liff";
import { createRoot } from "react-dom/client";
import {
  RecoilRoot,
  useRecoilValue,
  useRecoilValueLoadable,
  useRecoilState,
} from "recoil";
import { Loader } from "../common/components/loader";
import { GroupSwitcher } from "./components/group-switcher";
import { MonthSwitcher } from "./components/month-switcher";
import { UsersList } from "./components/users-list";
import { SplitButton } from "./components/split-button";
import { DetailsList } from "./components/details-list";
import { userIdState } from "../common/states/users";
import { FullScreenMenu } from "./components/full-screen-menu";
import { DeleteConfirm } from "./components/delete-confirm";
import { MoveAccountConfirm } from "./components/move-account-confirm";
import { AddExcludedPriceModal } from "./components/add-excluded-price-modal";
import { FixedWrapper } from "./components/fixed-wrapper";
import {
  isShowAddExcludedPriceModalState,
  isDirectShowAddExcludedPriceModalState,
  isShowDeleteConfirmState,
  isShowMoveConfirmState,
  isShowSplitViewState,
} from "./states/menu";
import { SplitView } from "./components/split-view";
import { isShowLoaderState } from "../common/states/loader";
import { receiptsState } from "./states/receipts";
import { getEnvs } from "../common/utilities/get-envs";
import "./root.css";

const envs = getEnvs();
liff.init({ liffId: envs.liffId });

function App() {
  const [userId, setUserId] = useRecoilState(userIdState);
  const { state } = useRecoilValueLoadable(receiptsState);
  const isShowMoveConfirm = useRecoilValue(isShowMoveConfirmState);
  const isShowDeleteConfirm = useRecoilValue(isShowDeleteConfirmState);
  const isShowAddExcludedPriceModal = useRecoilValue(
    isShowAddExcludedPriceModalState
  );
  const isDirectShowAddExcludedPriceModal = useRecoilValue(
    isDirectShowAddExcludedPriceModalState
  );
  const isShowSplitView = useRecoilValue(isShowSplitViewState);
  const [isShowLoader, setIsShowLoader] = useRecoilState(isShowLoaderState);

  useEffect(() => {
    liff.ready.then(() => {
      if (!liff.isLoggedIn()) {
        liff.login();
      } else {
        const context = liff.getContext();
        const userId = context?.userId || "";

        setUserId(userId);
      }
    });
  }, []);

  useEffect(() => {
    if (userId && state === "hasValue") {
      setIsShowLoader(false);
    } else {
      setIsShowLoader(true);
    }
  }, [userId, state]);

  return (
    <React.Fragment>
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
            {isShowAddExcludedPriceModal && <AddExcludedPriceModal />}
          </React.Fragment>
        </FullScreenMenu>
        {isDirectShowAddExcludedPriceModal && (
          <FixedWrapper>
            <AddExcludedPriceModal />
          </FixedWrapper>
        )}
        <Suspense fallback={<div>loading</div>}>
          <SplitView isShow={isShowSplitView} />
        </Suspense>
      </Suspense>
      <Loader isShow={isShowLoader} />
    </React.Fragment>
  );
}

const root = createRoot(document.getElementById("app")!);
root.render(
  <RecoilRoot>
    <App />
  </RecoilRoot>
);
