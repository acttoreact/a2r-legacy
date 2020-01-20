import { ParsedUrlQuery } from 'querystring';
import { Session } from './session';

export interface A2RContext {
  query: ParsedUrlQuery;
  session: Session;
}

export type GetData<T> = (
  a2rContext: A2RContext,
) => T | Promise<T>;

export type DataProvider = <ReturnType>(pathname: string) => Promise<GetData<ReturnType>>;
