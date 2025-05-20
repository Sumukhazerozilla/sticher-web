export interface IPoint {
  x: number;
  y: number;
  originalX: number;
  originalY: number;
  time: number;
  button: number;
  relativeTime: number;
  domBounds: {
    x: number;
    y: number;
    width: number;
    height: number;
  };
}

export interface IMetadata {
  points: IPoint[];
  lastRecording: {
    startTime: number;
    endTime: number;
    screenSize: {
      width: number;
      height: number;
    };
    customRegion: null | string;
    totalPausedTime: number;
    videoFormats: string[];
  };

  keyboardEvents: IKeyBoardEvent[];
}

export interface IKeyBoardEvent {
  highPrecisionTime: number;
  key: string;
  relativeTime: number;
  screenshot: string;
  time: number;
  type: string;
  vKey: number;
  x: number;
  y: number;
}

export interface IResponse {
  fileId: string;
  metadata: IMetadata;
  images: string[];
  filename: string;
  processedAt: string;
  audio?: string;
}

export interface ISlideData {
  id: string;
  timeStamp: number;
  image: string;
  text: string;
}
