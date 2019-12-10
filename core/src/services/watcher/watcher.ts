export interface WatcherEventInfo {
  path: string;
  handler: () => Promise<void>;
  onError?: (er: Error) => void;
}