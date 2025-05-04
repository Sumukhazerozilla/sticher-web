export interface FileMetadata {
  fileId: string;
  metadata: {
    points: {
      x: number;
      y: number;
      time: number;
      button: number;
      relativeTime: number;
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
