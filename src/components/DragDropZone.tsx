import { useState, useRef } from "react";

interface DragDropZoneProps {
  onFileSelect: (file: File) => void;
}

const DragDropZone = ({ onFileSelect }: DragDropZoneProps) => {
  const [isDragging, setIsDragging] = useState(false);
  const [fileName, setFileName] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleDragEnter = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
  };

  const validateFile = (file: File) => {
    return file.type === "application/zip" || file.name.endsWith(".zip");
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);

    const file = e.dataTransfer.files[0];
    if (file && validateFile(file)) {
      setFileName(file.name);
      onFileSelect(file);
    } else {
      alert("Only .zip files are allowed");
    }
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const file = e.target.files[0];
      if (validateFile(file)) {
        setFileName(file.name);
        onFileSelect(file);
      } else {
        alert("Only .zip files are allowed");
      }
    }
  };

  const openFileSelector = () => {
    fileInputRef.current?.click();
  };

  return (
    <div
      className={`drag-drop-zone ${isDragging ? "dragging" : ""} ${
        fileName ? "has-file" : ""
      }`}
      onDragEnter={handleDragEnter}
      onDragLeave={handleDragLeave}
      onDragOver={handleDragOver}
      onDrop={handleDrop}
      onClick={openFileSelector}
    >
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileSelect}
        accept=".zip"
        style={{ display: "none" }}
      />

      {fileName ? (
        <div className="selected-file">
          <span>Selected file: {fileName}</span>
        </div>
      ) : (
        <div className="upload-instructions">
          <span className="upload-icon">📁</span>
          <p>Drag and drop your ZIP file here or click to browse</p>
          <p className="file-type-info">Only .zip files are allowed</p>
        </div>
      )}
    </div>
  );
};

export default DragDropZone;
