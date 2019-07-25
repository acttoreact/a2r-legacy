#!/usr/bin/env node
import next from 'next';
import colors from 'colors';
import args from 'command-line-args';
import commandLineUsage from 'command-line-usage';
import out from '../util/out';
import rules from './paramsRules';
import commandLineInfo from './commandLineInfo';
import setting from '../config/settings';


const options = args(rules);

out.setLevel(options.frameworkLogLevel);

const valid = !options.help;

if (options.help) {
  // eslint-disable-next-line no-console
  console.log(commandLineUsage(commandLineInfo));
} else {
  if (options.port < 1000) {
    out.error(
      `${colors.red.bold('--port')}: port < 100 is forbidden and it is set to ${colors.cyan.bold(
        options.port.toString()
      )} the port will be set to the default value ${colors.cyan.green(
        setting.defaultPort.toString()
      )}`
    );
    options.port = setting.defaultPort;
  } else if (options.port < 8000) {
    out.warn(
      `${colors.red.bold(
        '--port'
      )}: port < 8000 which is dangerous and it is set to ${colors.cyan.bold(
        options.port.toString()
      )}`
    );
  } else if (Number.isNaN(options.port)) {
    out.error(
      `${colors.red.bold('--port')}: port must be a number and it is set to ${colors.cyan.bold(
        setting.defaultPort.toString()
      )}`
    );
    options.port = setting.defaultPort;
  }

  if (valid) {
    if (options.init) {
      out.info(
        colors.yellow.bold(`>>> Initializing project for ${colors.yellow.magenta('A2R')} Framework`)
      );
      next({dev: options.dev});
    } else {
      out.info(
        colors.bgBlue.bold(
          `>>> Starting ${colors.yellow.magenta('A2R')} Framework on port ${colors.yellow.bold(
            options.port.toString()
          )}`
        )
      );
    }
  }
}
