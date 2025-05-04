import { useState } from "react";
import UploadButton from "./components/UploadButton";
import SticherView from "./components/SticherView";
import ImageExporter from "./components/ImageExporter";
import { BASE_URL } from "./components/constants";

function App() {
  const [data] = useState({
    fileId: "6f29a0637158e24a",
    metadata: {
      points: [
        {
          x: 204,
          y: 562,
          time: 1746337367498,
          button: 1,
          relativeTime: 1182,
        },
        {
          x: 194,
          y: 605,
          time: 1746337370566,
          button: 1,
          relativeTime: 4250,
        },
        {
          x: 198,
          y: 658,
          time: 1746337373407,
          button: 1,
          relativeTime: 7091,
        },
        {
          x: 1586,
          y: 737,
          time: 1746337378975,
          button: 1,
          relativeTime: 12659,
        },
        {
          x: 1591,
          y: 775,
          time: 1746337380990,
          button: 1,
          relativeTime: 14674,
        },
        {
          x: 1584,
          y: 799,
          time: 1746337382328,
          button: 1,
          relativeTime: 16012,
        },
      ],
      lastRecording: {
        startTime: 1746337366316,
        endTime: 1746337385280,
        screenSize: {
          width: 1280,
          height: 672,
        },
        customRegion: null,
        totalPausedTime: 0,
        videoFormats: ["webm", "mp4"],
      },
    },
    images: [
      "/assets/1746337462229-expo-docs/processed_images/click_1746337367498_204_562.png",
      "/assets/1746337462229-expo-docs/processed_images/click_1746337370566_194_605.png",
      "/assets/1746337462229-expo-docs/processed_images/click_1746337373407_198_658.png",
      "/assets/1746337462229-expo-docs/processed_images/click_1746337378975_1586_737.png",
      "/assets/1746337462229-expo-docs/processed_images/click_1746337380990_1591_775.png",
      "/assets/1746337462229-expo-docs/processed_images/click_1746337382328_1584_799.png",
    ],
  });

  const [tooltips, setTooltips] = useState<{ id: number; text: string }[]>(
    data.metadata.points.map((_, index) => ({
      id: index,
      text: `Note ${index + 1}`,
    }))
  );

  const handleTooltipsUpdate = (
    updatedTooltips: { id: number; text: string }[]
  ) => {
    setTooltips(updatedTooltips);
  };

  return (
    <main className="pt-2 px-5">
      <div className="flex items-center justify-end gap-2">
        <UploadButton />
        <div>
          <ImageExporter
            fileMetaData={data}
            tooltips={tooltips}
            baseUrl={BASE_URL}
          />
        </div>
      </div>
      <section>
        <SticherView
          fileMetaData={data}
          onUpdateTooltips={handleTooltipsUpdate}
        />
      </section>
    </main>
  );
}

export default App;
