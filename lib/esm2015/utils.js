export const buildExpireTimestamp = (milliseconds) => {
    return new Date().getTime() + milliseconds;
};
export const hasTimestampExpired = (milliseconds) => {
    const dateTimeNow = new Date().getTime();
    const dateTimeExpiration = new Date(milliseconds).getTime();
    return dateTimeExpiration <= dateTimeNow;
};
export const isDefined = (t) => t != null;
/**
 * Check if the data is an object.
 */
export const isObject = (data) => {
    return Boolean(data) && Array.isArray(data) === false && typeof data === 'object';
};
/**
 * Check the data is an object with properties.
 */
export const isObjectWithProperties = (data) => {
    return isObject(data) && Object.keys(data).length > 0;
};
// eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
export const isFunction = (functionToCheck) => {
    return functionToCheck && {}.toString.call(functionToCheck) === '[object Function]';
};
export const isStorageControllerLike = (value) => {
    // "typeof Storage" fixes issue with React Native
    if (typeof Storage !== 'undefined' && value instanceof Storage) {
        return true;
    }
    return [
        value === null || value === void 0 ? void 0 : value.hasOwnProperty('getItem'),
        value === null || value === void 0 ? void 0 : value.hasOwnProperty('removeItem'),
        value === null || value === void 0 ? void 0 : value.hasOwnProperty('setItem'),
        isFunction(value === null || value === void 0 ? void 0 : value.getItem),
        isFunction(value === null || value === void 0 ? void 0 : value.removeItem),
        isFunction(value === null || value === void 0 ? void 0 : value.setItem),
    ].every(Boolean);
};
const isBrowser = typeof window !== 'undefined';
const isNotProductionBuild = process.env.NODE_ENV !== 'production';
export const invalidStorageAdaptorWarningIf = (storageAdaptor, storageName) => {
    if (isBrowser && isNotProductionBuild && !isStorageControllerLike(storageAdaptor)) {
        console.warn(`mobx-persist-store: ${storageName} does not have a valid storage adaptor.\n\n* Make sure the storage controller has 'getItem', 'setItem' and 'removeItem' methods."`);
    }
};
export const duplicatedStoreWarningIf = (hasPersistedStoreAlready, storageName) => {
    if (isBrowser && isNotProductionBuild && hasPersistedStoreAlready) {
        console.warn(`mobx-persist-store: 'makePersistable' was called was called with the same storage name "${storageName}".\n\n * Make sure you call "stopPersisting" before recreating "${storageName}" to avoid memory leaks. \n * Or double check you did not have two stores with the same name.`);
    }
};
export const computedPersistWarningIf = (isComputedProperty, propertyName) => {
    if (isBrowser && isNotProductionBuild && isComputedProperty) {
        console.warn(`mobx-persist-store: The property '${propertyName}' is computed and will not persist.`);
    }
};
export const actionPersistWarningIf = (isComputedProperty, propertyName) => {
    if (isBrowser && isNotProductionBuild && isComputedProperty) {
        console.warn(`mobx-persist-store: The property '${propertyName}' is an action and will not persist.`);
    }
};
export const consoleDebug = (isDebugMode, message, content = '') => {
    if (isDebugMode && isBrowser && isNotProductionBuild) {
        console.info(`%c mobx-persist-store: (Debug Mode) ${message} `, 'background: #4B8CC5; color: black; display: block;', content);
    }
};
