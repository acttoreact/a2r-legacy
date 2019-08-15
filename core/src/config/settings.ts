export interface FrameworkSettings {
  defaultPort: number;
  socketPath: string;
};

const settings: FrameworkSettings = {
  defaultPort: 9230,
  socketPath: '/ws',
};

export default settings;
