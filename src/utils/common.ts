import { ActiveScreenType } from '../types/common';

export const goToUploadScreen = (setActiveScreen: (type: ActiveScreenType) => void) => {
  window.history.pushState({}, '', `${window.location.origin}/`);
  setActiveScreen('upload');
};
