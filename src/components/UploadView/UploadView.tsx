import { onFileUpload, processResponseFun } from "../../utils/uploadOperations";
import useSticherStore from "../../store/sticherStore";
import { toast } from "react-toastify";
import DropArea from "./DropArea";

const UploadView = () => {
  const setResponse = useSticherStore((state) => state.setResponse);
  const setSlideData = useSticherStore((state) => state.setSlideData);
  const setLoading = useSticherStore((state) => state.setLoading);
  const setActiveScreen = useSticherStore((state) => state.setActiveScreen);
  const loading = useSticherStore((state) => state.loading);

  const handleDrop = async (acceptedFiles: File[]) => {
    if (acceptedFiles.length > 0) {
      const file = acceptedFiles[0];
      setLoading(true);
      const response = await onFileUpload(file);
      if (response) {
        processResponseFun(
          setResponse,
          response,
          setSlideData,
          setActiveScreen
        );
      }

      setLoading(false);
    } else {
      setLoading(false);
      toast.error("No file selected. Please select a zip file.");
    }
  };

  return (
    <main className="h-screen overflow-hidden flex items-center justify-center relative ">
      {loading && (
        <div className="fixed inset-0 flex items-center justify-center bg-[rgba(0,0,0,0.3)] backdrop-blur-xs backdrop-filter z-10">
          <div className="loader"></div>
        </div>
      )}

      <DropArea handleDrop={handleDrop} />
    </main>
  );
};

export default UploadView;
