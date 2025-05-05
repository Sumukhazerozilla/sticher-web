export interface FileMetadata {
  fileId: string;
  metadata: {
    points: {
      x: number;
      y: number;
      originalX?: number;
      originalY?: number;
      time: number;
      button: number;
      relativeTime: number;
      domBounds?: {
        x: number;
        y: number;
        width: number;
        height: number;
      };
    }[];
    lastRecording: {
      startTime: number;
      endTime: number;
      screenSize: {
        width: number;
        height: number;
      };
      customRegion: null;
      totalPausedTime: number;
      videoFormats: string[];
    };
  };
  images: string[];
}
