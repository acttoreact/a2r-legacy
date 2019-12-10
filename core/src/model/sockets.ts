/* eslint-disable @typescript-eslint/no-explicit-any */

/**
 * Method call information
 */
export interface MethodCall {
  /**
   * API Method name corresponding to complete key (like 'users.login')
   * @type {string}
   * @memberof MethodCall
   */
  method: string;
  /**
   * Unique ID for socket transmission
   * @type {string}
   * @memberof MethodCall
   */
  id: string;
  /**
   * Params for API Method
   * @type {any[]}
   * @memberof MethodCall
   */
  params: any[];
};

/**
 * Socket standard message
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
}