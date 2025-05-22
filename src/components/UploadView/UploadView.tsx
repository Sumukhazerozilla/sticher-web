import Dropzone from "react-dropzone";
import { BsFileZipFill as FileIcon } from "react-icons/bs";
import { palette } from "../../utils/palette";
import { onFileUpload } from "../../utils/fileUpload";
import useSticherStore from "../../store/sticherStore";
import { toast } from "react-toastify";

const UploadView = () => {
  const setResponse = useSticherStore((state) => state.setResponse);
  const setLoading = useSticherStore((state) => state.setLoading);
  const loading = useSticherStore((state) => state.loading);

  const handleDrop = async (acceptedFiles: File[]) => {
    if (acceptedFiles.length > 0) {
      const file = acceptedFiles[0];
      setLoading(true);
      await onFileUpload(file, setResponse);
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

      <Dropzone
        accept={{
          "application/zip": [".zip"],
          "application/x-zip-compressed": [".zip"],
          "application/x-zip": [".zip"],
          "application/zip-compressed": [".zip"],
        }}
        onDrop={handleDrop}
      >
        {({ getRootProps, getInputProps }) => (
          <div
            {...getRootProps()}
            className={`border-2 border-dashed cursor-pointer rounded-lg p-6 flex flex-col items-center justify-center h-[300px] w-[60vw] bg-white bg-opacity-70 backdrop-filter backdrop-blur-md`}
            style={{ borderColor: palette.primaryLight }}
          >
            <input {...getInputProps()} />
            <FileIcon size={40} color={palette.primary} />
            <p className="font-semibold text-xl text-[#rgba(0, 0, 0, 0.88)]">
              Click or drag file to this area to upload
            </p>
            <p className="text-sm text-[rgba(0, 0, 0, 0.45)]">Zip files only</p>
          </div>
        )}
      </Dropzone>
    </main>
  );
};

export default UploadView;
