import { useEffect, useState } from "react";
import UploadButton from "./components/UploadButton";
import SticherView from "./components/SticherView";
import ImageExporter from "./components/ImageExporter";
import { BASE_URL } from "./components/constants";
import { IResponse } from "./components/types";
import axios from "axios";

function App() {
  const [data, setData] = useState<null | IResponse>(null);

  const [tooltips, setTooltips] = useState<{ id: number; text: string }[]>(
    data?.metadata?.points?.map((_, index) => ({
      id: index,
      text: `Note ${index + 1}`,
    })) || []
  );

  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const fileId = urlParams.get("fileId");
    console.log("File ID from URL:", fileId);
    if (fileId?.length && !data?.fileId?.length) {
      // Fetch the file data using the fileId
      const fetchFileData = async () => {
        try {
          const response = await axios.get(`${BASE_URL}/api/files/${fileId}`);
          const result = response.data as IResponse;
          setData(result);
        } catch (error) {
          console.error("Error fetching file data:", error);
        }
      };
      fetchFileData();
    }
    // if (!data?.fileId?.length) {
    //   // Get the fileId from url params
    // }
  }, [data]);

  const handleTooltipsUpdate = (
    updatedTooltips: { id: number; text: string }[]
  ) => {
    setTooltips(updatedTooltips);
  };

  const onFileUpload = async (file: File) => {
    const formData = new FormData();
    formData.append("zipFile", file);
    try {
      const url = `${BASE_URL}/api/upload`;
      const response = await axios.post(url, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      const result = response.data as IResponse;
      console.log("File uploaded successfully:", result);
      // Append the fileId to the url ?fileId=myFileId using route params
      const fileId = result?.fileId;

      history.pushState({}, "", `?fileId=${fileId}`);

      setData(result);
    } catch (error) {
      console.error("Error uploading file:", error);
      alert("File upload failed. Please try again.");
    }
  };

  return (
    <main className="pt-2 px-5">
      <div className="flex items-center justify-end gap-2">
        <UploadButton onFileUpload={onFileUpload} />
        <div>
          <ImageExporter
            fileMetaData={data}
            tooltips={tooltips}
            baseUrl={BASE_URL}
          />
        </div>
      </div>
      <section>
        {!data?.metadata?.points?.length ? (
          <div className="text-center text-gray-500 mt-4">
            No points found in the metadata.
          </div>
        ) : (
          <SticherView
            fileMetaData={data}
            onUpdateTooltips={handleTooltipsUpdate}
          />
        )}
      </section>
    </main>
  );
}

export default App;
