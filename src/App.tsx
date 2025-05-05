import { useState } from "react";
import UploadButton from "./components/UploadButton";
import SticherView from "./components/SticherView";
import ImageExporter from "./components/ImageExporter";
import { BASE_URL } from "./components/constants";

function App() {
  const [data] = useState({
    fileId: "de3d6874be717457",
    metadata: {
      points: [
        {
          x: 57.333333333333336,
          y: 330.6666666666667,
          originalX: 86,
          originalY: 496,
          time: 1746422273073,
          button: 1,
          relativeTime: 838,
          domBounds: {
            x: 12,
            y: 211.33334350585938,
            width: 232,
            height: 28,
          },
        },
        {
          x: 63.333333333333336,
          y: 361.3333333333333,
          originalX: 95,
          originalY: 542,
          time: 1746422276127,
          button: 1,
          relativeTime: 3892,
          domBounds: {
            x: 12,
            y: 211.33334350585938,
            width: 232,
            height: 28,
          },
        },
        {
          x: 52,
          y: 396,
          originalX: 78,
          originalY: 594,
          time: 1746422278483,
          button: 1,
          relativeTime: 6248,
          domBounds: {
            x: 12,
            y: 211.33334350585938,
            width: 232,
            height: 28,
          },
        },
        {
          x: 58,
          y: 414,
          originalX: 87,
          originalY: 621,
          time: 1746422280380,
          button: 1,
          relativeTime: 8145,
          domBounds: {
            x: 12,
            y: 211.33334350585938,
            width: 232,
            height: 28,
          },
        },
        {
          x: 1076.6666666666667,
          y: 262,
          originalX: 1615,
          originalY: 393,
          time: 1746422282948,
          button: 1,
          relativeTime: 10713,
          domBounds: {
            x: 12,
            y: 211.33334350585938,
            width: 232,
            height: 28,
          },
        },
        {
          x: 1076,
          y: 220.66666666666666,
          originalX: 1614,
          originalY: 331,
          time: 1746422284673,
          button: 1,
          relativeTime: 12438,
          domBounds: {
            x: 12,
            y: 211.33334350585938,
            width: 232,
            height: 28,
          },
        },
        {
          x: 1082,
          y: 245.33333333333334,
          originalX: 1623,
          originalY: 368,
          time: 1746422286392,
          button: 1,
          relativeTime: 14157,
          domBounds: {
            x: 12,
            y: 211.33334350585938,
            width: 232,
            height: 28,
          },
        },
        {
          x: 1072.6666666666667,
          y: 267.3333333333333,
          originalX: 1609,
          originalY: 401,
          time: 1746422287692,
          button: 1,
          relativeTime: 15457,
          domBounds: {
            x: 12,
            y: 211.33334350585938,
            width: 232,
            height: 28,
          },
        },
        {
          x: 1072.6666666666667,
          y: 289.3333333333333,
          originalX: 1609,
          originalY: 434,
          time: 1746422288866,
          button: 1,
          relativeTime: 16631,
          domBounds: {
            x: 12,
            y: 211.33334350585938,
            width: 232,
            height: 28,
          },
        },
        {
          x: 1066.6666666666667,
          y: 322.6666666666667,
          originalX: 1600,
          originalY: 484,
          time: 1746422290011,
          button: 1,
          relativeTime: 17776,
          domBounds: {
            x: 12,
            y: 211.33334350585938,
            width: 232,
            height: 28,
          },
        },
      ],
      lastRecording: {
        startTime: 1746422272235,
        endTime: 1746422293929,
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
      "/assets/1746422335713-myFolder-2/processed_images/click_1746422273073_57.333333333333336_330.6666666666667.png",
      "/assets/1746422335713-myFolder-2/processed_images/click_1746422276127_63.333333333333336_361.3333333333333.png",
      "/assets/1746422335713-myFolder-2/processed_images/click_1746422278483_52_396.png",
      "/assets/1746422335713-myFolder-2/processed_images/click_1746422280380_58_414.png",
      "/assets/1746422335713-myFolder-2/processed_images/click_1746422282948_1076.6666666666667_262.png",
      "/assets/1746422335713-myFolder-2/processed_images/click_1746422284673_1076_220.66666666666666.png",
      "/assets/1746422335713-myFolder-2/processed_images/click_1746422286392_1082_245.33333333333334.png",
      "/assets/1746422335713-myFolder-2/processed_images/click_1746422287692_1072.6666666666667_267.3333333333333.png",
      "/assets/1746422335713-myFolder-2/processed_images/click_1746422288866_1072.6666666666667_289.3333333333333.png",
      "/assets/1746422335713-myFolder-2/processed_images/click_1746422290011_1066.6666666666667_322.6666666666667.png",
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
