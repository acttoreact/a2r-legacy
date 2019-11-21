import { logo } from '../../util/terminalStyles';
import setting from '../../config/settings';

export default [
  {
    header: 'A2R Framework',
    content: 'The isomorphic, reactive {italic framework} that scales.',
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
        description:
          'Initializes the project for the {underline A2R} {underline Framework}',
      },
      {
        name: 'version',
        alias: 'v',
        typeLabel: ' ',
        description: 'Gets the current version of the A2R Framework',
      },
      {
        name: 'update',
        alias: 'u',
        typeLabel: ' ',
        description:
          'Updates the project to the last version of the {underline A2R} {underline Framework}',
      },
      {
        name: 'patch',
        typeLabel: ' ',
        description:
          'Processes all the dependencies and additional files used the by the {underline A2R} {underline Framework}',
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
        description: `Set the port that will be used by the framework ({bold ${
          setting.defaultPort
        }} by default)`,
      },
      {
        name: 'frameworkLogLevel',
        alias: 'f',
        typeLabel: '{underline string}',
        description:
          'Set the log level (error, warning, info or verbose) that will be used by the {underline A2R} {underline Framework} ({bold info} by default)',
      },
    ],
  },
];
