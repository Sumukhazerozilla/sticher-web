import { useEffect } from "react";
import UploadButton from "./components/UploadButton";
import SticherView from "./components/SticherView";
// import ImageExporter from "./components/ImageExporter";
import { BASE_URL } from "./components/constants";
import { IResponse, ISlideData } from "./components/types";
import axios from "axios";
import useSticherStore from "./store/sticherStore";
import { nanoid } from "nanoid";

function App() {
  const setSlideData = useSticherStore((state) => state.setSlideData);
  const loading = useSticherStore((state) => state.loading);
  const setLoading = useSticherStore((state) => state.setLoading);
  const data = useSticherStore((state) => state.response);
  const setData = useSticherStore((state) => state.setResponse);

  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const fileId = urlParams.get("fileId");
    if (fileId?.length && !data?.fileId?.length) {
      fetchFileData(fileId);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [data]);

  useEffect(() => {
    if (data) {
      const slideData: ISlideData[] = data?.images?.map((slide, index) => ({
        id: nanoid(),
        timeStamp: data?.metadata?.points[index]?.time,
        image: slide,
        text: "You clicked here",
      }));

      setSlideData(slideData);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [data]);

  // Fetch the file data using the fileId
  const fetchFileData = async (fileId: string) => {
    try {
      setLoading(true);
      const response = await axios.get(`${BASE_URL}/api/files/${fileId}`);
      const result = response.data as IResponse;
      setData(result);
      setLoading(false);
    } catch (error) {
      setLoading(false);
      console.error("Error fetching file data:", error);
      alert(
        "Error fetching file data. Please check the file ID and try again."
      );
    }
  };

  const onFileUpload = async (file: File) => {
    try {
      console.log("File to upload:", file);
      const formData = new FormData();
      formData.append("zipFile", file);
      const url = `${BASE_URL}/api/upload`;
      console.log("Uploading to URL:", url);
      const response = await axios.post(url, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
        timeout: 120000, // 2 minute timeout for large files
        onUploadProgress: (progressEvent) => {
          // Optional: track upload progress
          const percentCompleted = Math.round(
            (progressEvent.loaded * 100) / progressEvent.total!
          );
          console.log(`Upload progress: ${percentCompleted}%`);
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
    }
  };

  return (
    <main className="pt-2 px-5">
      {loading ? (
        <div className="flex items-center justify-center h-screen">
          <div className="loader"></div>
        </div>
      ) : (
        <>
          <div className="flex items-center justify-end gap-2">
            <UploadButton onFileUpload={onFileUpload} />
            <div>
              {/* {data && (
                <ImageExporter
                  fileMetaData={data}
                  tooltips={tooltips}
                  baseUrl={BASE_URL}
                />
              )} */}
            </div>
          </div>
          <section>
            {!data?.metadata?.points?.length &&
            !data?.metadata?.keyboardEvents?.length ? (
              <div className="text-center text-gray-500 mt-4">
                No points found in the metadata.
              </div>
            ) : (
              <SticherView />
            )}
          </section>
        </>
      )}
    </main>
  );
}

export default App;
