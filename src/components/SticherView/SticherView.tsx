import { useEffect, useState } from "react";
import useSticherStore from "../../store/sticherStore";
import { fetchFileData } from "../../utils/uploadOperations";

import SticherHeader from "./SticherHeader";
import { SticherHeaderIdTypes } from "./utils";

const SticherView = () => {
  const fileId = new URLSearchParams(window.location.search).get("fileId");
  const fetchFileId = fileId ? fileId : "";

  const response = useSticherStore((state) => state.response);
  const slideData = useSticherStore((state) => state.slideData);
  const loading = useSticherStore((state) => state.loading);
  const setLoading = useSticherStore((state) => state.setLoading);
  const setActiveScreen = useSticherStore((state) => state.setActiveScreen);
  const setResponse = useSticherStore((state) => state.setResponse);
  const setSlideData = useSticherStore((state) => state.setSlideData);

  const [activeHeaderOption, setActiveHeaderOption] =
    useState<SticherHeaderIdTypes | null>(null);

  useEffect(() => {
    if (!response && !loading && slideData.length === 0) {
      if (fetchFileId) {
        fetchFileData(
          fetchFileId,
          setLoading,
          setActiveScreen,
          setResponse,
          setSlideData
        );
      } else {
        setActiveScreen("upload");
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [response, slideData, loading, fetchFileId]);

  const onHeaderOptionClick = (option: SticherHeaderIdTypes) => {
    setActiveHeaderOption((prev) => (prev === option ? null : option));
  };

  return (
    <main className="p-4 sticherView relative h-screen overflow-hidden">
      <aside className="h-full bg-white boxShadow rounded-xl"></aside>
      <section>
        <SticherHeader
          activeHeaderOption={activeHeaderOption}
          onHeaderOptionClick={onHeaderOptionClick}
        />
        <section className="bg-white boxShadow"></section>
      </section>
    </main>
  );
};

export default SticherView;
