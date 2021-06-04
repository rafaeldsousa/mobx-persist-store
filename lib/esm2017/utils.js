"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.consoleDebug = exports.actionPersistWarningIf = exports.computedPersistWarningIf = exports.duplicatedStoreWarningIf = exports.invalidStorageAdaptorWarningIf = exports.isStorageControllerLike = exports.isFunction = exports.isObjectWithProperties = exports.isObject = exports.isDefined = exports.hasTimestampExpired = exports.buildExpireTimestamp = void 0;
const buildExpireTimestamp = (milliseconds) => {
    return new Date().getTime() + milliseconds;
};
exports.buildExpireTimestamp = buildExpireTimestamp;
const hasTimestampExpired = (milliseconds) => {
    const dateTimeNow = new Date().getTime();
    const dateTimeExpiration = new Date(milliseconds).getTime();
    return dateTimeExpiration <= dateTimeNow;
};
exports.hasTimestampExpired = hasTimestampExpired;
const isDefined = (t) => t != null;
exports.isDefined = isDefined;
/**
 * Check if the data is an object.
 */
const isObject = (data) => {
    return Boolean(data) && Array.isArray(data) === false && typeof data === 'object';
};
exports.isObject = isObject;
/**
 * Check the data is an object with properties.
 */
const isObjectWithProperties = (data) => {
    return exports.isObject(data) && Object.keys(data).length > 0;
};
exports.isObjectWithProperties = isObjectWithProperties;
// eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
const isFunction = (functionToCheck) => {
    return functionToCheck && {}.toString.call(functionToCheck) === '[object Function]';
};
exports.isFunction = isFunction;
const isStorageControllerLike = (value) => {
    // "typeof Storage" fixes issue with React Native
    if (typeof Storage !== 'undefined' && value instanceof Storage) {
        return true;
    }
    return [
        value === null || value === void 0 ? void 0 : value.hasOwnProperty('getItem'),
        value === null || value === void 0 ? void 0 : value.hasOwnProperty('removeItem'),
        value === null || value === void 0 ? void 0 : value.hasOwnProperty('setItem'),
        exports.isFunction(value === null || value === void 0 ? void 0 : value.getItem),
        exports.isFunction(value === null || value === void 0 ? void 0 : value.removeItem),
        exports.isFunction(value === null || value === void 0 ? void 0 : value.setItem),
    ].every(Boolean);
};
exports.isStorageControllerLike = isStorageControllerLike;
const isBrowser = typeof window !== 'undefined';
const isNotProductionBuild = process.env.NODE_ENV !== 'production';
const invalidStorageAdaptorWarningIf = (storageAdaptor, storageName) => {
    if (isBrowser && isNotProductionBuild && !exports.isStorageControllerLike(storageAdaptor)) {
        console.warn(`mobx-persist-store: ${storageName} does not have a valid storage adaptor.\n\n* Make sure the storage controller has 'getItem', 'setItem' and 'removeItem' methods."`);
    }
};
exports.invalidStorageAdaptorWarningIf = invalidStorageAdaptorWarningIf;
const duplicatedStoreWarningIf = (hasPersistedStoreAlready, storageName) => {
    if (isBrowser && isNotProductionBuild && hasPersistedStoreAlready) {
        console.warn(`mobx-persist-store: 'makePersistable' was called was called with the same storage name "${storageName}".\n\n * Make sure you call "stopPersisting" before recreating "${storageName}" to avoid memory leaks. \n * Or double check you did not have two stores with the same name.`);
    }
};
exports.duplicatedStoreWarningIf = duplicatedStoreWarningIf;
const computedPersistWarningIf = (isComputedProperty, propertyName) => {
    if (isBrowser && isNotProductionBuild && isComputedProperty) {
        console.warn(`mobx-persist-store: The property '${propertyName}' is computed and will not persist.`);
    }
};
exports.computedPersistWarningIf = computedPersistWarningIf;
const actionPersistWarningIf = (isComputedProperty, propertyName) => {
    if (isBrowser && isNotProductionBuild && isComputedProperty) {
        console.warn(`mobx-persist-store: The property '${propertyName}' is an action and will not persist.`);
    }
};
exports.actionPersistWarningIf = actionPersistWarningIf;
const consoleDebug = (isDebugMode, message, content = '') => {
    if (isDebugMode && isBrowser && isNotProductionBuild) {
        console.info(`%c mobx-persist-store: (Debug Mode) ${message} `, 'background: #4B8CC5; color: black; display: block;', content);
    }
};
exports.consoleDebug = consoleDebug;
