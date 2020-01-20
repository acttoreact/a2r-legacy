export interface Settings {
  /**
   * [DEPRECATED]
   * Additional paths where API should be built. Can be absolute or relative to project path
   * @type {string[]}
   * @memberof Settings
   */
  apiDestinationPaths: string[];
  /**
   * [DEPRECATED]
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
  /**
   * Project name (extracted from package.json)
   * @type {string}
   * @memberof Settings
   */
  projectName: string;
};