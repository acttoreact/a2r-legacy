interface Settings {
  defaultPort: number;
  dev: boolean;
  socketPath: string;
}

const settings: Settings = {
  defaultPort: 9230,
  dev: process.env.NODE_ENV === 'development',
  socketPath: '/ws',
};

export default settings;
