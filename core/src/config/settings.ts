export interface FrameworkSettings {
  defaultDevLogLevel: string;
  defaultLogLevel: string;
  defaultPort: number;
  socketPath: string;
};

const settings: FrameworkSettings = {
  defaultDevLogLevel: 'verbose',
  defaultLogLevel: 'info',
  defaultPort: 9230,
  socketPath: '/ws',
};

export default settings;
