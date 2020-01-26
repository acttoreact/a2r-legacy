/* eslint-disable @typescript-eslint/no-explicit-any */
import { ParsedUrlQuery } from 'querystring';
import { Session } from './session';

export interface BasicContext {
  session: Session;
  query: ParsedUrlQuery;
}

export interface A2RContext<GlobalData, AppSession extends Session = Session> extends BasicContext {
  globalProps: GlobalData;
  session: AppSession;
}

export interface AppData {
  sessionId: string;
  data: any;
}

export type GetData<PageData, GlobalData, AppSession extends Session = Session> = (
  a2rContext: A2RContext<GlobalData, AppSession>,
) => GlobalData & PageData;

export type GetDataProvider = (
  pathname: string,
) => Promise<(a2rContext: BasicContext) => any | Promise<any>>;
