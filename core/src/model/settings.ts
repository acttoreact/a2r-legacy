export interface Settings {
  /**
   * Additional paths where API should be built. Can be absolute or relative to project path
   * @type {string[]}
   * @memberof Settings
   */
  apiDestinationPaths: string[];
  /**
   * Additional paths where Model should be built. Can be absolute or relative to project path
   * @type {string[]}
   * @memberof Settings
   */
  modelDestinationPaths: string[];
  /**
   * App port
   * @type {number}
   * @memberof Settings
   */
  port: number;
};