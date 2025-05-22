import LeftSection from "./LeftSection";
import { useRef } from "react";
import useSticherStore from "../../store/sticherStore";
import { BASE_URL } from "../constants";
import Tooltip from "./Tooltip";

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
  const onEditSlideText = useSticherStore((state) => state.editSlideText);

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
  const extractCoordsFromFilename = (
    filename: string
  ): { x: number; y: number } | null => {
    const match = filename.match(/click_\d+_([0-9.]+)_([0-9.]+)\.png$/);
    if (match && match.length === 3) {
      return {
        x: parseFloat(match[1]),
        y: parseFloat(match[2]),
      };
    }
    return null;
  };

  // Get tooltip position
  const getTooltipPosition = () => {
    if (!imageRef.current) return null;

    // Get the current image display dimensions
    const imgDisplayRect = imageRef.current.getBoundingClientRect();

    // Get natural image dimensions directly from the image element
    const naturalWidth = imageRef.current.naturalWidth;
    const naturalHeight = imageRef.current.naturalHeight;

    // Calculate ratio between natural image size and display size
    const displayRatioWidth = imgDisplayRect.width / naturalWidth;
    const displayRatioHeight = imgDisplayRect.height / naturalHeight;

    // Try to get coordinates from the filename first (most accurate)
    const filename = slideData[activeImageIndex]?.image || "";
    const filenameCoords = extractCoordsFromFilename(filename);

    if (filenameCoords) {
      // Apply display ratio to adjust coordinates based on current image display size
      const adjustedX = filenameCoords.x * displayRatioWidth;
      const adjustedY = filenameCoords.y * displayRatioHeight;

      console.log("Using coordinates from filename:", {
        original: filenameCoords,
        adjusted: { x: adjustedX, y: adjustedY },
        displayRatio: { width: displayRatioWidth, height: displayRatioHeight },
      });

      return { x: adjustedX, y: adjustedY };
    }

    // No fallback since currentPoint is no longer available
    console.log("Could not determine tooltip position");
    return null;
  };

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

          {imageRef.current &&
            (() => {
              const position = getTooltipPosition();
              if (!position) return null;

              return (
                <Tooltip
                  x={position.x}
                  y={position.y}
                  text={`${slideData[activeImageIndex]?.text}`}
                  onTextUpdate={(text) => {
                    const id = slideData[activeImageIndex]?.id;
                    console.log("Text updated:", text, id);
                    onEditSlideText(id, text);
                  }}
                />
              );
            })()}
        </div>
      </div>
    </div>
  );
};

export default SticherView;
