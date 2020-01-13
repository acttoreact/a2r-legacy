import { APIStructure } from '../../model/api';

let api: APIStructure = {};

/**
 * Gets Framework Server API reference
 */
export const getAPI = (): APIStructure => api;

/**
 * Sets Framework Server API reference
 */
export const setAPI = (newApi: APIStructure): void => {
  api = newApi;
};
