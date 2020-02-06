/* eslint-disable @typescript-eslint/no-explicit-any */
import { ParsedUrlQuery } from 'querystring';
import { A2RSession } from './session';

export interface BasicContext {
  session: A2RSession;
  query: ParsedUrlQuery;
}

export interface A2RContext<GlobalData, AppSession extends A2RSession = A2RSession>
  extends BasicContext {
  globalProps: GlobalData;
  session: AppSession;
}

export interface AppData {
  sessionId: string;
  data: any;
}

export type GetData<PageData, GlobalData, AppSession extends A2RSession = A2RSession> = (
  a2rContext: A2RContext<GlobalData, AppSession>,
) => Promise<PageData> | PageData;

export type GetDataProvider = (
  pathname: string,
) => Promise<(a2rContext: BasicContext) => any | Promise<any>>;

export interface A2RGlobalProps {}
export interface A2RPageProps {}
