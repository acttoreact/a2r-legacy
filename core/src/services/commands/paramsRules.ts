import setting from '../../config/settings';

const rules = [
  {
    name: 'init',
    alias: 'i',
    type: Boolean,
  },
  {
    name: 'update',
    alias: 'u',
    type: Boolean,
  },
  {
    name: 'version',
    alias: 'v',
    type: Boolean,
  },
  {
    name: 'patch',
    type: Boolean,
  },
  {
    name: 'help',
    alias: 'h',
    type: Boolean,
  },
  {
    name: 'dev',
    alias: 'd',
    type: Boolean,
  },
  {
    name: 'port',
    alias: 'p',
    type: Number,
    defaultValue: setting.defaultPort,
  },
  {
    name: 'frameworkLogLevel',
    alias: 'f',
    type: String,
    defaultValue: 'info',
  },
];

export default rules;
