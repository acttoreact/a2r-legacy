#!/usr/bin/env node
import colors from 'colors';
import args from 'command-line-args';
import out from '../util/out';
import rules from './paramsRules';
import setting from '../config/settings';

const options = args(rules);

const valid = !!options.help;

if (options.help) {
  out.warn(options.help);
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
  }

  if (valid) {
    if (options.init) {
      out.info(
        colors.bgGreen.bold(`>>> Initializing project for ${colors.yellow.bold('A2R')} Framework.`)
      );
    } else {
      out.info(
        colors.bgGreen.bold(
          `>>> Starting ${colors.yellow.bold('A2R')} Framework on port ${colors.yellow.bold(
            options.port
          )}`
        )
      );
    }
  }
}
