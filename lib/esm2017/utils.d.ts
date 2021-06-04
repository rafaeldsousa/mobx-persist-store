import { StorageController } from './types';
export declare const buildExpireTimestamp: (milliseconds: number) => number;
export declare const hasTimestampExpired: (milliseconds: number) => boolean;
export declare const isDefined: <T>(t: T | null | undefined) => t is T;
/**
 * Check if the data is an object.
 */
export declare const isObject: (data: any) => boolean;
/**
 * Check the data is an object with properties.
 */
export declare const isObjectWithProperties: (data: any) => boolean;
export declare const isFunction: (functionToCheck: any) => boolean;
export declare const isStorageControllerLike: (value: StorageController | Storage | undefined) => value is StorageController;
export declare const invalidStorageAdaptorWarningIf: (storageAdaptor: StorageController | undefined, storageName: string) => void;
export declare const duplicatedStoreWarningIf: (hasPersistedStoreAlready: boolean, storageName: string) => void;
export declare const computedPersistWarningIf: (isComputedProperty: boolean, propertyName: string) => void;
export declare const actionPersistWarningIf: (isComputedProperty: boolean, propertyName: string) => void;
export declare const consoleDebug: (isDebugMode: boolean, message: string, content?: any) => void;
