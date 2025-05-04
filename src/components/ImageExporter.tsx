import { useRef } from "react";
import JSZip from "jszip";
import { saveAs } from "file-saver";
import { FileMetadata } from "./types";

interface ImageExporterProps {
  fileMetaData: FileMetadata;
  tooltips: { id: number; text: string }[];
  baseUrl: string;
}

const ImageExporter: React.FC<ImageExporterProps> = ({
  fileMetaData,
  tooltips,
  baseUrl,
}) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  const exportImages = async () => {
    try {
      const zip = new JSZip();
      const folder = zip.folder("annotated_images") || zip;

      // For each image in the file metadata
      for (let i = 0; i < fileMetaData.images.length; i++) {
        const imageUrl = `${baseUrl}${fileMetaData.images[i]}`;
        const tooltipText = tooltips[i]?.text || `Note ${i + 1}`;
        const point = fileMetaData.metadata.points[i];

        // Create canvas with image and tooltip
        const canvas = document.createElement("canvas");
        const ctx = canvas.getContext("2d");
        if (!ctx) continue;

        // Load the image
        const img = await loadImage(imageUrl);
        canvas.width = img.width;
        canvas.height = img.height;

        // Draw the image
        ctx.drawImage(img, 0, 0);

        // Draw the tooltip
        drawTooltip(ctx, point.x, point.y, tooltipText);

        // Convert canvas to blob and add to zip
        const blob = await new Promise<Blob>((resolve) =>
          canvas.toBlob((blob) => resolve(blob as Blob), "image/png")
        );

        folder.file(`image_${i + 1}.png`, blob);
      }

      // Generate and save the zip file
      const content = await zip.generateAsync({ type: "blob" });
      saveAs(content, "annotated_images.zip");
    } catch (error) {
      console.error("Error exporting images:", error);
      alert("Failed to export images. Please try again.");
    }
  };

  // Helper function to load an image
  const loadImage = (src: string): Promise<HTMLImageElement> => {
    return new Promise((resolve, reject) => {
      const img = new Image();
      img.crossOrigin = "anonymous";
      img.onload = () => resolve(img);
      img.onerror = (e) => reject(e);
      img.src = src;
    });
  };

  // Draw tooltip on canvas
  const drawTooltip = (
    ctx: CanvasRenderingContext2D,
    x: number,
    y: number,
    text: string
  ) => {
    // Draw tooltip box
    ctx.fillStyle = "#4f46e5";
    ctx.strokeStyle = "#ffffff";

    // Calculate text dimensions
    ctx.font = "14px Arial";
    const textLines = text.split("\n");
    const lineHeight = 20;
    const padding = 10;
    const maxLineWidth = Math.max(
      ...textLines.map((line) => ctx.measureText(line).width)
    );
    const boxWidth = maxLineWidth + padding * 2;
    const boxHeight = lineHeight * textLines.length + padding * 2;

    // Draw rounded rectangle for tooltip
    roundRect(
      ctx,
      x - boxWidth / 2,
      y - boxHeight - 20,
      boxWidth,
      boxHeight,
      5
    );

    // Draw text
    ctx.fillStyle = "#ffffff";
    textLines.forEach((line, i) => {
      ctx.fillText(
        line,
        x - boxWidth / 2 + padding,
        y - boxHeight - 20 + padding + (i + 1) * lineHeight - 5
      );
    });

    // Draw arrow
    ctx.fillStyle = "#4f46e5";
    ctx.beginPath();
    ctx.moveTo(x - 10, y - 20);
    ctx.lineTo(x + 10, y - 20);
    ctx.lineTo(x, y - 5);
    ctx.closePath();
    ctx.fill();

    // Draw point
    ctx.fillStyle = "#ef4444";
    ctx.strokeStyle = "#ffffff";
    ctx.beginPath();
    ctx.arc(x, y, 6, 0, Math.PI * 2);
    ctx.fill();
    ctx.lineWidth = 2;
    ctx.stroke();
  };

  // Helper function to draw rounded rectangle
  const roundRect = (
    ctx: CanvasRenderingContext2D,
    x: number,
    y: number,
    width: number,
    height: number,
    radius: number
  ) => {
    ctx.beginPath();
    ctx.moveTo(x + radius, y);
    ctx.arcTo(x + width, y, x + width, y + height, radius);
    ctx.arcTo(x + width, y + height, x, y + height, radius);
    ctx.arcTo(x, y + height, x, y, radius);
    ctx.arcTo(x, y, x + width, y, radius);
    ctx.closePath();
    ctx.fill();
  };

  return (
    <>
      <button
        onClick={exportImages}
        className="bg-teal-600 hover:bg-teal-700 text-white px-4 py-2 rounded transition-colors"
      >
        Export
      </button>
      <canvas ref={canvasRef} style={{ display: "none" }} />
    </>
  );
};

export default ImageExporter;
