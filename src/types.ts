import { IReactionOptions } from 'mobx';
import {
  list as _list,
  map as _map,
  object as _object,
  custom
} from 'serializr';

export type ReactionOptions = IReactionOptions;

export interface PersistenceStorageOptions<P> extends StorageOptions {
  name: string;
  properties: P[];
}

export interface StorageOptions {
  /**
   * @property {Boolean} [debugMode] When true console.info when getItem, setItem or removeItem are triggered.
   * @default false
   */
  debugMode?: boolean;
  /**
   * @property {Number} [expireIn] A value in milliseconds to determine when the data in storage should not be retrieved by getItem.
   *
   * Recommend the library https://github.com/henrikjoreteg/milliseconds to set the value
   */
  expireIn?: number;
  /**
   * @property {Boolean} [removeOnExpiration] If {@link StorageOptions#expireIn} has a value and has expired, the data in storage will be removed automatically when getItem is called. The default value is true.
   * @default true
   */
  removeOnExpiration?: boolean;
  /**
   *
   */
  storage?: StorageController;
  /**
   * @property {Boolean} [jsonify] When true the data will be JSON.stringify before being passed to setItem. The default value is true.
   * @default true
   */
  stringify?: boolean;
}

export interface StorageController {
  /**
   * The function that will retrieved the storage data by a specific identifier.
   *
   * @function
   * @param {String} key
   * @return {Promise<String | Object>}
   */
  getItem<T>(key: string): T | string | null | Promise<T | string | null>;
  /**
   * The function that will remove data from storage by a specific identifier.
   *
   * @function
   * @param {String} key
   * @return {Promise<void>}
   */
  removeItem(key: string): void | Promise<void>;
  /**
   * The function that will save data to the storage by a specific identifier.
   *
   * @function
   * @param {String} key
   * @param {String | Object} value
   * @return {Promise<void>}
   */
  setItem(key: string, value: any): void | Promise<void>;
}

function _walk(v: any) {
  if (typeof v === 'object' && v) Object.keys(v).map(k => _walk(v[k]))
  return v
}

function _default() {
  return custom(_walk, (v: any) => v)
}

function object(s: any) {
  return s ? _object(s) : _default()
}

function list(s: any) {
  return _list(object(s))
}

function map(s: any) {
  return _map(object(s))
}

export type Types = 'object' | 'list' | 'map'
export const types: { [key: string]: ((s?: any) => any) } = { object, list, map }