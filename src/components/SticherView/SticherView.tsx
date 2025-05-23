import { useEffect, useState } from 'react';
import useSticherStore from '../../store/sticherStore';
import { fetchFileData } from '../../utils/uploadOperations';

import SticherHeader from './SticherViewHeader';
import { SticherHeaderIdTypes } from './utils';
import SticherViewAside from './SticherViewAside';
import SticherViewArea from './SticherViewArea';

const SticherView = () => {
  const fileId = new URLSearchParams(window.location.search).get('fileId');
  const fetchFileId = fileId ? fileId : '';

  const response = useSticherStore((state) => state.response);
  const slideData = useSticherStore((state) => state.slideData);
  const loading = useSticherStore((state) => state.loading);
  const setLoading = useSticherStore((state) => state.setLoading);
  const setActiveScreen = useSticherStore((state) => state.setActiveScreen);
  const setResponse = useSticherStore((state) => state.setResponse);
  const setSlideData = useSticherStore((state) => state.setSlideData);

  const [activeHeaderOption, setActiveHeaderOption] = useState<SticherHeaderIdTypes | null>(null);

  useEffect(() => {
    if (!response && !loading && slideData.length === 0) {
      if (fetchFileId) {
        fetchFileData(fetchFileId, setLoading, setActiveScreen, setResponse, setSlideData);
      } else {
        setActiveScreen('upload');
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [response, slideData, loading, fetchFileId]);

  const onHeaderOptionClick = (option: SticherHeaderIdTypes) => {
    setActiveHeaderOption((prev) => (prev === option ? null : option));
  };

  return (
    <main className="p-4 sticherView relative h-screen overflow-hidden">
      <SticherViewAside />
      <section>
        <SticherHeader activeHeaderOption={activeHeaderOption} onHeaderOptionClick={onHeaderOptionClick} />
        <SticherViewArea activeHeaderOption={activeHeaderOption} />
      </section>
    </main>
  );
};

export default SticherView;
