import Dropzone from "react-dropzone";
import { BsFileZipFill as FileIcon } from "react-icons/bs";

const UploadView = () => {
  return (
    <main className="h-screen overflow-hidden flex items-center justify-center">
      <Dropzone
        accept={{
          "application/zip": [".zip"],
          "application/x-zip-compressed": [".zip"],
          "application/x-zip": [".zip"],
          "application/zip-compressed": [".zip"],
        }}
        onDrop={(acceptedFiles) => console.log(acceptedFiles)}
      >
        {({ getRootProps, getInputProps }) => (
          <div
            {...getRootProps()}
            className="border-2 border-dashed cursor-pointer border-gray-400 rounded-lg p-6 flex flex-col items-center justify-center h-[300px] w-[60vw]"
          >
            <input {...getInputProps()} />
            <FileIcon size={40} />
            <p className="font-semibold text-xl text-gray-800">
              Click or drag file to this area to upload
            </p>
            <p className="text-sm text-gray-400 font-medium">Zip files only</p>
          </div>
        )}
      </Dropzone>
    </main>
  );
};

export default UploadView;
