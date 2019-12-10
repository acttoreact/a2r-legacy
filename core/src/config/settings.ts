export interface FrameworkSettings {
  defaultDevLogLevel: string;
  defaultLogLevel: string;
  defaultPort: number;
  socketPath: string;
  minNodeVersion: string;
  taskConcurrency: number;
};

const settings: FrameworkSettings = {
  defaultDevLogLevel: 'verbose',
  defaultLogLevel: 'info',
  defaultPort: 9230,
  socketPath: '/ws',
  minNodeVersion: '10.10',
  taskConcurrency: 4,
};

export default settings;
