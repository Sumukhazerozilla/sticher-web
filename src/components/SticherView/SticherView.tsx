import LeftSection from "./LeftSection";
import { useRef } from "react";
import useSticherStore from "../../store/sticherStore";
import { BASE_URL } from "../constants";

// interface SticherViewProps {
// fileMetaData: IResponse;
// loading: boolean;
// onUpdateTooltips?: (tooltips: { id: number; text: string }[]) => void;
// fetchFileData: (fileId: string) => Promise<void>;
// setLoading: React.Dispatch<React.SetStateAction<boolean>>;
// }

// fileMetaData,
// onUpdateTooltips,
// fetchFileData,
// loading,
// setLoading,
const SticherView: React.FC = () => {
  // const [activeImageIndex, setActiveImageIndex] = useState(0);
  // const [tooltips, setTooltips] = useState<{ id: number; text: string }[]>(
  //   fileMetaData.metadata.points.map((_, index) => ({
  //     id: index,
  //     text: `Note ${index + 1}`,
  //   }))
  // );
  // const [imageSize, setImageSize] = useState<{
  //   width: number;
  //   height: number;
  // } | null>(null);
  const imageRef = useRef<HTMLImageElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const activeImageIndex = useSticherStore((state) => state.activeImageIndex);
  const slideData = useSticherStore((state) => state.slideData);

  const LARGE_IMAGE_URL = `${BASE_URL}${slideData[activeImageIndex]?.image}`;
  // const currentPoint = fileMetaData.metadata.points[activeImageIndex];

  // useEffect(() => {
  //   // Update image size when it loads
  //   const handleImageLoad = () => {
  //     if (imageRef.current) {
  //       setImageSize({
  //         width: imageRef.current.naturalWidth,
  //         height: imageRef.current.naturalHeight,
  //       });
  //     }
  //   };

  //   const img = imageRef.current;
  //   if (img) {
  //     if (img.complete) {
  //       handleImageLoad();
  //     } else {
  //       img.addEventListener("load", handleImageLoad);
  //       return () => img.removeEventListener("load", handleImageLoad);
  //     }
  //   }
  // }, [activeImageIndex]);

  // useEffect(() => {
  //   if (onUpdateTooltips) {
  //     onUpdateTooltips(tooltips);
  //   }
  // }, [tooltips, onUpdateTooltips]);

  // const handleTooltipUpdate = (id: number, text: string) => {
  //   const updatedTooltips = tooltips.map((tooltip) =>
  //     tooltip.id === id ? { ...tooltip, text } : tooltip
  //   );
  //   setTooltips(updatedTooltips);
  // };

  // Extract coordinates from filename
  // const extractCoordsFromFilename = (
  //   filename: string
  // ): { x: number; y: number } | null => {
  //   const match = filename.match(/click_\d+_([0-9.]+)_([0-9.]+)\.png$/);
  //   if (match && match.length === 3) {
  //     return {
  //       x: parseFloat(match[1]),
  //       y: parseFloat(match[2]),
  //     };
  //   }
  //   return null;
  // };

  // Get tooltip position
  // const getTooltipPosition = () => {
  //   if (!imageRef.current || !currentPoint || !imageSize) return null;

  //   // Get the current image display dimensions
  //   const imgDisplayRect = imageRef.current.getBoundingClientRect();

  //   // Calculate ratio between natural image size and display size
  //   const displayRatioWidth = imgDisplayRect.width / imageSize.width;
  //   const displayRatioHeight = imgDisplayRect.height / imageSize.height;

  //   // Try to get coordinates from the filename first (most accurate)
  //   const filename = fileMetaData.images[activeImageIndex];
  //   const filenameCoords = extractCoordsFromFilename(filename);

  //   if (filenameCoords) {
  //     // Apply display ratio to adjust coordinates based on current image display size
  //     const adjustedX = filenameCoords.x * displayRatioWidth;
  //     const adjustedY = filenameCoords.y * displayRatioHeight;

  //     console.log("Using coordinates from filename:", {
  //       original: filenameCoords,
  //       adjusted: { x: adjustedX, y: adjustedY },
  //       displayRatio: { width: displayRatioWidth, height: displayRatioHeight },
  //     });

  //     return { x: adjustedX, y: adjustedY };
  //   }

  //   // Fallback to using the point data directly
  //   const x = currentPoint.x * displayRatioWidth;
  //   const y = currentPoint.y * displayRatioHeight;

  //   console.log("Using direct point coordinates:", {
  //     original: { x: currentPoint.x, y: currentPoint.y },
  //     adjusted: { x, y },
  //     displayRatio: { width: displayRatioWidth, height: displayRatioHeight },
  //   });

  //   return { x, y };
  // };

  return (
    <div
      className="grid gap-10 h-[90vh] overflow-hidden mt-2"
      style={{ gridTemplateColumns: "300px 1fr" }}
    >
      <div className="h-full overflow-y-auto pb-5">
        <LeftSection />
      </div>

      <div ref={containerRef} className="pt-1 relative overflow-auto">
        <div className="relative inline-block">
          <img
            ref={imageRef}
            src={LARGE_IMAGE_URL}
            alt="Selected screenshot"
            className="max-w-full"
          />
          {/* 
          {imageRef.current &&
            currentPoint &&
            imageSize &&
            (() => {
              const position = getTooltipPosition();
              if (!position) return null;

              return (
                <Tooltip
                  x={position.x}
                  y={position.y}
                  text={
                    tooltips[activeImageIndex]?.text ||
                    `Note ${activeImageIndex + 1}`
                  }
                  onTextUpdate={(text) =>
                    handleTooltipUpdate(activeImageIndex, text)
                  }
                />
              );
            })()} */}
        </div>
      </div>
    </div>
  );
};

export default SticherView;
