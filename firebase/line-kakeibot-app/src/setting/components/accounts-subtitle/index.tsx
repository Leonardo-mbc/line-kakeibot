import React from 'react';
import { useSetRecoilState } from 'recoil';
import { showTutorialState, tutorialPageState } from '../../states/tutorial';
import { HelpLink } from '../../../common/components/block/help-link';

export function AccountsSubtitle() {
  const setShowTutorial = useSetRecoilState(showTutorialState);
  const setPage = useSetRecoilState(tutorialPageState);

  function handleClick() {
    setPage(4);
    setShowTutorial(true);
  }

  return <HelpLink title="家計簿って？" onClick={handleClick} />;
}
