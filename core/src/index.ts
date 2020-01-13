import { Settings as A2RSettings } from './model/settings';
import frameworkSettings from './config/settings';

export type Settings = Partial<A2RSettings>;

let settings: Settings = {
  port: frameworkSettings.defaultPort,
};

export const getSettings = <SettingsType = Settings>(): Readonly<A2RSettings & SettingsType> =>
  settings as Readonly<A2RSettings & SettingsType>;

export const applySettings = <SettingsType>(
  newSettings: SettingsType,
): Readonly<A2RSettings & SettingsType> => {
  settings = {
    ...settings,
    ...newSettings,
  };
  return settings as Readonly<A2RSettings & SettingsType>;
};

export { MethodCall, SocketMessage } from './model/sockets';
