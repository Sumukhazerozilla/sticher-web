import Dropzone from "react-dropzone";
import { palette } from "../../utils/palette";
import { BsFileZipFill as FileIcon } from "react-icons/bs";

interface DropAreaProps {
  handleDrop: (acceptedFiles: File[]) => Promise<void>;
}

const DropArea: React.FC<DropAreaProps> = ({ handleDrop }) => {
  return (
    <>
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
    </>
  );
};

export default DropArea;
