import axios from "axios";
import { BASE_URL } from "../components/constants";
import { IResponse } from "../components/types";
import { toast } from "react-toastify";

export const onFileUpload = async (
  file: File,
  setResponse: (response: IResponse | null) => void
) => {
  try {
    const formData = new FormData();
    formData.append("zipFile", file);
    const url = `${BASE_URL}/api/upload`;
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
    const fileId = result?.fileId;

    history.pushState({}, "", `?fileId=${fileId}`);

    setResponse(result);
  } catch (error) {
    console.error("Error uploading file:", error);
    toast.error("Error uploading file. Please check the file and try again.");
  }
};
