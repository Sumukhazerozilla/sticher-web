import { useState, useCallback } from "react";
import { useDropzone } from "react-dropzone";

interface UploadModalProps {
  onClose: () => void;
  onFileUpload: (file: File) => Promise<void>;
}

const UploadModal = ({ onClose, onFileUpload }: UploadModalProps) => {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);

  const onDrop = useCallback((acceptedFiles: File[]) => {
    if (acceptedFiles.length > 0) {
      setSelectedFile(acceptedFiles[0]);
    }
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      "application/zip": [".zip"],
    },
    maxFiles: 1,
    multiple: false,
  });

  const handleUpload = async () => {
    if (!selectedFile) {
      alert("Please select a file first");
      return;
    }

    try {
      setIsUploading(true);

      await onFileUpload(selectedFile);
      onClose();
    } catch (error) {
      console.error("Upload failed:", error);
      alert("Upload failed. Please try again.");
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className="fixed inset-0 backdrop:bg-black backdrop-opacity-10 flex justify-center items-center z-[999999999] text-white">
      <div className="bg-gray-800 rounded-lg w-full max-w-lg shadow-xl">
        <div className="flex justify-between items-center p-4 border-b border-gray-700">
          <h2 className="text-xl font-semibold">Upload ZIP File</h2>
          <button
            className="text-gray-400 hover:text-white text-2xl focus:outline-none"
            onClick={onClose}
          >
            &times;
          </button>
        </div>

        <div className="p-5">
          <div
            {...getRootProps({
              className: `border-2 ${
                isDragActive
                  ? "border-indigo-500 bg-indigo-500 bg-opacity-10"
                  : "border-gray-600"
              } ${
                selectedFile
                  ? "border-green-500 bg-green-500 bg-opacity-10"
                  : ""
              } border-dashed rounded-lg p-10 text-center cursor-pointer flex flex-col items-center justify-center min-h-[200px] transition-all`,
            })}
          >
            <input {...getInputProps()} />
            {selectedFile ? (
              <div className="break-all p-3">
                <span>Selected file: {selectedFile.name}</span>
              </div>
            ) : (
              <div className="flex flex-col items-center">
                <span className="text-5xl mb-4">📁</span>
                <p className="text-lg">
                  {isDragActive
                    ? "Drop the ZIP file here"
                    : "Drag and drop your ZIP file here or click to browse"}
                </p>
                <p className="text-sm text-gray-500 mt-2">
                  Only .zip files are allowed
                </p>
              </div>
            )}
          </div>
        </div>

        <div className="flex justify-end gap-3 p-4 border-t border-gray-700">
          <button
            className={`px-4 py-2 rounded transition-colors ${
              !selectedFile || isUploading
                ? "bg-indigo-800 text-gray-400 cursor-not-allowed"
                : "bg-indigo-600 hover:bg-indigo-700 text-white"
            }`}
            onClick={handleUpload}
            disabled={!selectedFile || isUploading}
          >
            {isUploading ? "Uploading..." : "Submit"}
          </button>
          <button
            className="px-4 py-2 bg-transparent border border-gray-600 rounded hover:bg-gray-700 transition-colors"
            onClick={onClose}
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
};

export default UploadModal;
