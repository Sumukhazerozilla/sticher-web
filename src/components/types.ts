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
}

export interface IResponse {
  fileId: string;
  metadata: IMetadata;
  images: string[];
  filename: string;
  processedAt: string;
}
