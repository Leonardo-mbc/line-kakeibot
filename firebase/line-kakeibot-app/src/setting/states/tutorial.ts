import { atom } from 'recoil';

export const showTutorialState = atom({
  key: 'atom:showTutorialState',
  default: false,
});

export const tutorialPageState = atom({
  key: 'atom:tutorialPageState',
  default: 0,
});
