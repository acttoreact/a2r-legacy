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

export default rules;
