import { Settings as A2RSettings } from './model/settings';
import frameworkSettings from './config/settings';
import { APIModule } from './model/api';
import { getAPI } from './services/api/apiServer';

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

export const getModule = (methodName: string): APIModule => {
  const api = getAPI();
  return api[methodName];
}

export { MethodCall, SocketMessage } from './model/sockets';
