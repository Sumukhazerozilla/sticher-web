import axios from 'axios';
import { BASE_URL } from '../components/constants';
import { IResponse, ISlideData } from '../components/types';
import { toast } from 'react-toastify';
import { nanoid } from 'nanoid';
import { ActiveScreenType } from '../types/common';
import { goToUploadScreen } from './common';

export const processResponseFun = async (
  setResponse: (response: IResponse | null) => void,
  response: IResponse,
  setSlideData: (data: ISlideData[]) => void,
  setActiveScreen: (type: ActiveScreenType) => void,
) => {
  setResponse(response);
  const slideData = response?.images?.map((slide, index) => ({
    id: nanoid(),
    timeStamp: response?.metadata?.points[index]?.time,
    image: slide,
    text: 'You clicked here',
  }));
  setSlideData(slideData);

  const fileId = response?.fileId;
  history.pushState({}, '', `?fileId=${fileId}`);
  setActiveScreen('sticher');
  toast.success('File uploaded successfully!');
};

export const onFileUpload = async (file: File) => {
  try {
    const formData = new FormData();
    formData.append('zipFile', file);
    const url = `${BASE_URL}/api/upload`;
    const response = await axios.post(url, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
      timeout: 120000,
      onUploadProgress: () => {
        // const percentCompleted = Math.round(
        //   (progressEvent.loaded * 100) / progressEvent.total!
        // );
      },
    });
    const result = response.data as IResponse;

    return result;
  } catch (error) {
    console.error('Error uploading file:', error);
    toast.error('Error uploading file. Please check the file and try again.');
  }
};

export const fetchFileData = async (
  fileId: string,
  setLoading: (val: boolean) => void,
  setActiveScreen: (type: ActiveScreenType) => void,
  setResponse: (response: IResponse | null) => void,
  setSlideData: (data: ISlideData[]) => void,
) => {
  try {
    setLoading(true);
    const response = await axios.get(`${BASE_URL}/api/files/${fileId}`);
    const result = response.data as IResponse;
    await processResponseFun(setResponse, result, setSlideData, setActiveScreen);

    setLoading(false);
  } catch {
    toast.error('Error fetching file data. Please check the file ID and try again.');
    setLoading(false);
    // Go to upload screen window.location.origin
    goToUploadScreen(setActiveScreen);
  }
};
