/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextPageContext } from 'next';
import { Settings as A2RSettings } from './model/settings';
import frameworkSettings from './config/settings';
import { APIModule } from './model/api';
import { getAPI } from './services/api/apiServer';
import { setGlobalProvider } from './services/data/globalProps';
import { setGetData } from './services/data/getData';
import { AppData } from './model/data';

export { A2RSession } from './model/session';
export { GetData, AppData, A2RGlobalProps, A2RPageProps } from './model/data';
export { default as getSessionId } from './services/data/getSessionId';
export { default as getDataByServer } from './services/data/getDataByServer';
export { MethodCall, SocketMessage, DataProviderCall } from './model/sockets';
export {
  default as A2RApp,
  SessionProvider,
  PagePropsProvider,
} from './pages/_app';

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

export const registerGlobal = <GlobalPropsType>(
  globalProvider: () => GlobalPropsType | Promise<GlobalPropsType>,
): void => {
  setGlobalProvider<GlobalPropsType>(globalProvider);
};

export const registerGetData = (
  getData: (ctx: NextPageContext) => Promise<AppData>,
): void => {
  setGetData(getData);
};

export const getModule = (methodName: string): APIModule => {
  const api = getAPI();
  return api[methodName];
};
