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

  const LARGE_IMAGE_URL = `${BASE_URL}${fileMetaData.images[activeImageIndex]}`;
  const currentPoint = fileMetaData.metadata.points[activeImageIndex];

  useEffect(() => {
    if (imageRef.current && imageRef.current.complete) {
      setImageSize({
        width: imageRef.current.naturalWidth,
        height: imageRef.current.naturalHeight,
      });
    }
  }, [activeImageIndex]);

  const handleImageLoad = () => {
    if (imageRef.current) {
      setImageSize({
        width: imageRef.current.naturalWidth,
        height: imageRef.current.naturalHeight,
      });
    }
  };

  const handleTooltipUpdate = (id: number, text: string) => {
    const updatedTooltips = tooltips.map((tooltip) =>
      tooltip.id === id ? { ...tooltip, text } : tooltip
    );
    setTooltips(updatedTooltips);
    if (onUpdateTooltips) {
      onUpdateTooltips(updatedTooltips);
    }
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

      <div className="pt-1 relative">
        <img
          ref={imageRef}
          src={LARGE_IMAGE_URL}
          alt="Selected screenshot"
          className="max-w-full"
          onLoad={handleImageLoad}
        />

        {imageSize && currentPoint && (
          <Tooltip
            x={currentPoint.x}
            y={currentPoint.y}
            text={
              tooltips[activeImageIndex]?.text || `Note ${activeImageIndex + 1}`
            }
            onTextUpdate={(text) => handleTooltipUpdate(activeImageIndex, text)}
            imageWidth={imageSize.width}
            imageHeight={imageSize.height}
          />
        )}
      </div>
    </div>
  );
};

export default SticherView;
