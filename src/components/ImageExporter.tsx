import JSZip from "jszip";
import { saveAs } from "file-saver";
// import { IResponse } from "./types";
// import { demoHtml } from "./templates/demo";
// import { testHtml } from "./templates/test";
import { BASE_URL } from "./constants";
import axios from "axios";
import useSticherStore from "../store/sticherStore";
import { demoHtml, testHtml } from "./templates";

interface ImageExporterProps {
  baseUrl: string;
}

const ImageExporter: React.FC<ImageExporterProps> = ({ baseUrl }) => {
  const slideData = useSticherStore((state) => state.slideData);
  const fileMetaData = useSticherStore((state) => state.response);

  const handleExportBtn = async () => {
    try {
      const zip = new JSZip();

      // First, export the original images to the resources folder
      await exportImagesToZip(zip);

      // Then, create the annotated images
      await addAnnotatedImageToZip(zip);

      // Store the audio file if it exists
      if (fileMetaData?.audio) {
        try {
          console.log(
            "Downloading audio from:",
            `${BASE_URL}${fileMetaData.audio}`
          );
          const audioUrl = `${BASE_URL}${fileMetaData.audio}`;
          const audioResponse = await axios.get(audioUrl, {
            responseType: "arraybuffer",
          });

          // Determine the file extension from the original URL (.webm, .mp3, etc.)
          const originalExt =
            fileMetaData.audio.split(".").pop()?.toLowerCase() || "mp3";

          // Save with the original extension to preserve format
          zip.file(`audio.${originalExt}`, audioResponse.data);

          // If it's webm, also save as mp3 for broader compatibility
          if (originalExt === "webm") {
            zip.file("audio.mp3", audioResponse.data);
          }

          console.log("Audio file added to zip successfully");
        } catch (error) {
          console.error("Error downloading audio:", error);
        }
      }

      // Finally, create the HTML files after all resources are available
      await demoHtml(slideData, fileMetaData, zip);
      await testHtml(slideData, fileMetaData, zip);

      // Generate and save the zip file
      const content = await zip.generateAsync({ type: "blob" });
      saveAs(content, "screen_recording.zip");
    } catch (error) {
      console.error("Error exporting images:", error);
      alert("Failed to export images. Please try again.");
    }
  };

  async function exportImagesToZip(zip: JSZip) {
    // Create a resource folder for images
    const resourceFolder = zip.folder("resources") || zip;
    // Download and add each image to the ZIP
    for (const slide of slideData) {
      try {
        const imageUrl = `${BASE_URL}${slide?.image}`;
        const imageResponse = await axios.get(imageUrl, {
          responseType: "arraybuffer",
        });
        const imageFileName = slide?.image?.split("/").pop() || "image.png";
        resourceFolder.file(imageFileName, imageResponse.data);
      } catch (error) {
        console.error(`Failed to fetch image: ${slide}`, error);
      }
    }
  }

  async function addAnnotatedImageToZip(zip: JSZip) {
    const taggedImageFolder = zip.folder("annotated_images") || zip;

    // For each image in the slide data
    for (let i = 0; i < slideData.length; i++) {
      try {
        // Skip if slide data is missing
        if (!slideData[i]) {
          console.log(`Skipping image ${i + 1}: No slide data available`);
          continue;
        }

        const imageUrl = `${baseUrl}${slideData[i].image}`;
        const tooltipText = slideData[i].text || `Note ${i + 1}`;

        console.log(`Processing image ${i + 1}: ${slideData[i].image}`);

        // Create canvas with image and tooltip
        const canvas = document.createElement("canvas");
        const ctx = canvas.getContext("2d");
        if (!ctx) {
          console.error(`Failed to get canvas context for image ${i + 1}`);
          continue;
        }

        // Load the image
        const img = await loadImage(imageUrl);
        canvas.width = img.width;
        canvas.height = img.height;

        // Draw the image
        ctx.drawImage(img, 0, 0);

        // Extract coordinates using the same priority logic as in SticherView
        const filename = slideData[i].image || "";
        let x, y;

        // First priority: Extract coordinates from filename if available
        const match = filename.match(/click_\d+_([0-9.]+)_([0-9.]+)\.png$/);
        if (match && match.length === 3) {
          x = parseFloat(match[1]);
          y = parseFloat(match[2]);
          console.log(`Using filename coordinates for image ${i + 1}:`, {
            x,
            y,
          });
        }
        // Use center of image as fallback
        else {
          x = img.width / 2;
          y = img.height / 2;
          console.log(`Using default center coordinates for image ${i + 1}:`, {
            x,
            y,
          });
        }

        // Draw the tooltip with the text from the slide data
        drawTooltip(ctx, x, y, tooltipText);

        // Convert canvas to blob and add to zip
        const blob = await new Promise<Blob>((resolve) =>
          canvas.toBlob((blob) => resolve(blob as Blob), "image/png")
        );

        taggedImageFolder.file(`image_${i + 1}.png`, blob);
        console.log(`Successfully added annotated image ${i + 1} to zip`);
      } catch (error) {
        console.error(`Failed to process image ${i + 1}:`, error);
        // Continue with next image instead of stopping the entire process
      }
    }
  }

  // Helper function to load an image
  const loadImage = (src: string): Promise<HTMLImageElement> => {
    return new Promise((resolve, reject) => {
      const img = new Image();
      img.crossOrigin = "anonymous";
      img.onload = () => resolve(img);
      img.onerror = (e) => {
        console.error("Failed to load image:", src, e);
        reject(e);
      };

      // Encode the URL to handle spaces and special characters in filenames
      const encodedSrc = encodeURI(src);
      img.src = encodedSrc;
    });
  };

  // Draw tooltip on canvas (updated positioning)
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

    // Draw rounded rectangle for tooltip (positioned above the point)
    roundRect(
      ctx,
      x - boxWidth / 2,
      y - boxHeight - 10,
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
        y - boxHeight - 10 + padding + (i + 1) * lineHeight - 5
      );
    });

    // Draw arrow
    ctx.fillStyle = "#4f46e5";
    ctx.beginPath();
    ctx.moveTo(x - 10, y - 10);
    ctx.lineTo(x + 10, y - 10);
    ctx.lineTo(x, y + 5);
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
    <button
      onClick={handleExportBtn}
      className="bg-teal-600 hover:bg-teal-700 text-white px-4 py-2 rounded transition-colors"
    >
      Export
    </button>
  );
};

export default ImageExporter;
