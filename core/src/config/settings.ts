export interface FrameworkSettings {
  defaultDevLogLevel: string;
  defaultLogLevel: string;
  defaultPort: number;
  socketPath: string;
  minNodeVersion: string;
};

const settings: FrameworkSettings = {
  defaultDevLogLevel: 'verbose',
  defaultLogLevel: 'info',
  defaultPort: 9230,
  socketPath: '/ws',
  minNodeVersion: '10.10',
};

export default settings;
