import { useState } from "react";
import UploadModal from "./UploadModal";

interface UploadButtonProps {
  onFileUpload: (file: File) => Promise<void>;
}

const UploadButton: React.FC<UploadButtonProps> = ({ onFileUpload }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const openModal = () => setIsModalOpen(true);
  const closeModal = () => setIsModalOpen(false);

  return (
    <div>
      <button
        className="bg-indigo-600 text-white cursor-pointer px-4 py-2 rounded hover:bg-indigo-700 transition-colors"
        onClick={openModal}
      >
        Upload
      </button>
      {isModalOpen && (
        <UploadModal onClose={closeModal} onFileUpload={onFileUpload} />
      )}
    </div>
  );
};

export default UploadButton;
