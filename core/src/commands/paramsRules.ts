import setting from '../config/settings';

const rules = [
  {
    name: 'init',
    alias: 'i',
    type: Boolean,
  },
  {
    name: 'port',
    alias: 'p',
    type: Number,
    defaultValue: setting.defaultPort,
  }
];

/*
const rules = {
  init: {
    type: Boolean,
    value: false
  },
  port: {
    type: Number,
    short: 'p',
    value(port?: number): number {
      let newPort: number;

      if (!port) {
        newPort = setting.defaultPort;
      } else {
        newPort = port;
      }

      if (newPort < 8000) {
        out.warn(
          `${colors.red.bold(
            '--port'
          )}: port < 8000 which is dangerous and it is set to ${colors.cyan.bold(
            newPort.toString()
          )}`
        );  
        if (newPort < 1000) {
          out.error(
            `${colors.red.bold(
              '--port'
            )}: port < 100 is forbidden and it is set to ${colors.cyan.bold(
              newPort.toString()
            )} the port will be set to the default value ${colors.cyan.green(
              setting.defaultPort.toString()
            )}`
          );
          return setting.defaultPort;
        }
      }
      return newPort;
    }
  },
};
*/
export default rules;
