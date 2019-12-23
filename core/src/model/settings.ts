export interface A2RSettings {
  /**
   * Additional paths where API should be built. Can be absolute or relative to project path
   * @type {string[]}
   * @memberof A2RSettings
   */
  apiDestinationPaths: string[];
  /**
   * Additional paths where Model should be built. Can be absolute or relative to project path
   * @type {string[]}
   * @memberof A2RSettings
   */
  modelDestinationPaths: string[];
};