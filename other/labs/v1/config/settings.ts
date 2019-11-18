import path from 'path';

interface Settings {
  defaultPort: number;
  dev: boolean;
  socketPath: string;
  appPath: string;
}

const settings: Settings = {
  defaultPort: 9230,
  dev: process.env.NODE_ENV === 'development',
  socketPath: '/ws',
  appPath: path.resolve(__dirname, '../'),
};

export default settings;
