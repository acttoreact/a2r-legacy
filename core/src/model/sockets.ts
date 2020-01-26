/* eslint-disable @typescript-eslint/no-explicit-any */
import io from 'socket.io';
import { ParsedUrlQuery } from 'querystring';

/**
 * Socket basic call
 */
export interface SocketCall {
  /**
   * Unique ID for socket transmission
   * @type {string}
   * @memberof MethodCall
   */
  id: string;
}

/**
 * Socket method call
 */
export interface MethodCall extends SocketCall {
  /**
   * API Method name corresponding to complete key (like 'users.login')
   * @type {string}
   * @memberof MethodCall
   */
  method: string;
  /**
   * Params for API Method
   * @type {any[]}
   * @memberof MethodCall
   */
  params: any[];
};

/**
 * Socket data provider call
 */
export interface DataProviderCall extends SocketCall {
  /**
   * Page pathname (from Next.js router)
   * @type {string}
   * @memberof DataProviderCall
   */
  pathname: string;
  /**
   * Parsed url query
   * @type {ParsedUrlQuery}
   * @memberof DataProviderCall
   */
  query: ParsedUrlQuery;
}

/**
 * Socket standard response
 */
export interface SocketMessage {
  /**
   * Operation was ok (0) or not (1)
   * @type {number}
   * @memberof SocketMessage
   */
  o: number;
  /**
   * Operation error (if any)
   * @type {string}
   * @memberof SocketMessage
   */
  e?: string;
  /**
   * Operation stack (if error)
   * @type {string}
   * @memberof SocketMessage
   */
  s?: string;
  /**
   * Operation return data
   * @type {any}
   * @memberof SocketMessage
   */
  d: any;
};

export interface A2RSocket extends io.Socket {
  sessionId: string;
};
