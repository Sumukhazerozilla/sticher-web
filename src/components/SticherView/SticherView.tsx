import { useState, useRef, useEffect } from "react";
import { BASE_URL } from "../constants";
import { FileMetadata } from "../types";
import Tooltip from "./Tooltip";

interface SticherViewProps {
  fileMetaData: FileMetadata;
  onUpdateTooltips?: (tooltips: { id: number; text: string }[]) => void;
}

const SticherView: React.FC<SticherViewProps> = ({
  fileMetaData,
  onUpdateTooltips,
}) => {
  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const [tooltips, setTooltips] = useState<{ id: number; text: string }[]>(
    fileMetaData.metadata.points.map((_, index) => ({
      id: index,
      text: `Note ${index + 1}`,
    }))
  );
  const [imageSize, setImageSize] = useState<{
    width: number;
    height: number;
  } | null>(null);
  const imageRef = useRef<HTMLImageElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  const LARGE_IMAGE_URL = `${BASE_URL}${fileMetaData.images[activeImageIndex]}`;
  const currentPoint = fileMetaData.metadata.points[activeImageIndex];

  useEffect(() => {
    // Update image size when it loads
    const handleImageLoad = () => {
      if (imageRef.current) {
        setImageSize({
          width: imageRef.current.naturalWidth,
          height: imageRef.current.naturalHeight,
        });
      }
    };

    const img = imageRef.current;
    if (img) {
      if (img.complete) {
        handleImageLoad();
      } else {
        img.addEventListener("load", handleImageLoad);
        return () => img.removeEventListener("load", handleImageLoad);
      }
    }
  }, [activeImageIndex]);

  useEffect(() => {
    if (onUpdateTooltips) {
      onUpdateTooltips(tooltips);
    }
  }, [tooltips, onUpdateTooltips]);

  const handleTooltipUpdate = (id: number, text: string) => {
    const updatedTooltips = tooltips.map((tooltip) =>
      tooltip.id === id ? { ...tooltip, text } : tooltip
    );
    setTooltips(updatedTooltips);
  };

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
    if (!imageRef.current || !currentPoint || !imageSize) return null;

    // Get the current image display dimensions
    const imgDisplayRect = imageRef.current.getBoundingClientRect();

    // Calculate ratio between natural image size and display size
    const displayRatioWidth = imgDisplayRect.width / imageSize.width;
    const displayRatioHeight = imgDisplayRect.height / imageSize.height;

    // Try to get coordinates from the filename first (most accurate)
    const filename = fileMetaData.images[activeImageIndex];
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

    // Fallback to using the point data directly
    const x = currentPoint.x * displayRatioWidth;
    const y = currentPoint.y * displayRatioHeight;

    console.log("Using direct point coordinates:", {
      original: { x: currentPoint.x, y: currentPoint.y },
      adjusted: { x, y },
      displayRatio: { width: displayRatioWidth, height: displayRatioHeight },
    });

    return { x, y };
  };

  return (
    <div
      className="grid gap-10 h-[90vh] overflow-hidden mt-2"
      style={{ gridTemplateColumns: "300px 1fr" }}
    >
      <div className="h-full overflow-y-auto pb-5">
        {fileMetaData.images.length ? (
          <div className="flex flex-col gap-2">
            {fileMetaData.images.map((image, index) => (
              <div
                key={index}
                className={`relative cursor-pointer ${
                  activeImageIndex === index ? "ring-2 ring-indigo-500" : ""
                }`}
                onClick={() => setActiveImageIndex(index)}
              >
                <img
                  src={`${BASE_URL}${image}`}
                  alt={`Image ${index + 1}`}
                  className="w-full object-cover aspect-auto"
                />
                <div className="absolute top-2 left-2 bg-indigo-500 text-white text-xs px-2 py-1 rounded-full">
                  {index + 1}
                </div>
              </div>
            ))}
          </div>
        ) : null}
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
            })()}
        </div>
      </div>
    </div>
  );
};

export default SticherView;
