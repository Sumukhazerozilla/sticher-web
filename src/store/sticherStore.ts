import { create } from "zustand";
import { devtools } from "zustand/middleware";
import { IResponse, ISlideData } from "../components/types";

interface SticherStore {
  activeImageIndex: number;
  setActiveImageIndex: (index: number) => void;

  loading: boolean;
  setLoading: (loading: boolean) => void;

  response: IResponse | null;
  setResponse: (response: IResponse | null) => void;

  slideData: ISlideData[];
  setSlideData: (data: ISlideData[]) => void;
  editSlideText: (id: string, text: string) => void;
}

const useSticherStore = create<SticherStore>()(
  devtools(
    (set) => ({
      activeImageIndex: 0,
      setActiveImageIndex: (index) => set({ activeImageIndex: index }),

      loading: true,
      setLoading: (loading) => set({ loading }),

      response: null,
      setResponse: (response) => set({ response }),

      slideData: [],
      setSlideData: (data) => set({ slideData: data }),
      editSlideText: (id, text) =>
        set((state) => ({
          slideData: state.slideData.map((slide) =>
            slide.id === id ? { ...slide, text } : slide
          ),
        })),
    }),
    {
      name: "Sticher Store",
    }
  )
);

export default useSticherStore;
