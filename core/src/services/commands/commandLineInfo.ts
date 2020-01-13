import colors from 'colors';

import { logo, framework } from '../../util/terminalStyles';
import settings from '../../config/settings';

export default [
  {
    header: framework,
    content: `The isomorphic, reactive ${colors.italic('framework')} that scales.`,
  },
  {
    content: logo,
    raw: true,
  },
  {
    header: 'Options',
    optionList: [
      {
        name: 'init',
        alias: 'i',
        typeLabel: ' ',
        description: `Initializes the project for ${framework}`,
      },
      {
        name: 'version',
        alias: 'v',
        typeLabel: ' ',
        description: `Gets the current version of ${framework}`,
      },
      {
        name: 'update',
        alias: 'u',
        typeLabel: ' ',
        description: `Updates the project to the last version of ${framework} and runs "patch" command`,
      },
      {
        name: 'updateHard',
        typeLabel: ' ',
        description: `Runs "update" command and "patch", but overwriting any core files.`,
      },
      {
        name: 'patch',
        typeLabel: ' ',
        description: `Updates all dependencies to match framework current packages versions and writes missing core files used by ${framework}`,
      },
      {
        name: 'patchHard',
        typeLabel: ' ',
        description: `Updates all dependencies to match framework current packages versions and overwrites every core file used by ${framework}`,
      },
      {
        name: 'help',
        alias: 'h',
        typeLabel: ' ',
        description: 'Print this usage guide',
      },
      {
        name: 'dev',
        alias: 'd',
        typeLabel: ' ',
        description: 'Runs in development mode',
      },
      {
        name: 'port',
        alias: 'p',
        typeLabel: '{underline number}',
        description: `Set the port that will be used by ${framework} (${colors.bold(
          settings.defaultPort.toString(),
        )} by default)`,
      },
      {
        name: 'frameworkLogLevel',
        alias: 'f',
        typeLabel: '{underline string}',
        description: `Set the log level (error, warning, info or verbose) that will be used by ${framework} (${colors.bold(
          settings.defaultLogLevel,
        )})`,
      },
    ],
  },
];
