import { FrameworkSettings } from '../model';

const settings: FrameworkSettings = {
  defaultDevLogLevel: 'verbose',
  defaultLogLevel: 'info',
  defaultPort: 9230,
  socketPath: '/ws',
  minNodeVersion: '10.10',
  taskConcurrency: 4,
  boilerplatePath: 'template',
  modelPath: 'model',
};

export default settings;
