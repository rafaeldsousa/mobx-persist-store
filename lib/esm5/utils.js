export var buildExpireTimestamp = function (milliseconds) {
    return new Date().getTime() + milliseconds;
};
export var hasTimestampExpired = function (milliseconds) {
    var dateTimeNow = new Date().getTime();
    var dateTimeExpiration = new Date(milliseconds).getTime();
    return dateTimeExpiration <= dateTimeNow;
};
export var isDefined = function (t) { return t != null; };
/**
 * Check if the data is an object.
 */
export var isObject = function (data) {
    return Boolean(data) && Array.isArray(data) === false && typeof data === 'object';
};
/**
 * Check the data is an object with properties.
 */
export var isObjectWithProperties = function (data) {
    return isObject(data) && Object.keys(data).length > 0;
};
// eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
export var isFunction = function (functionToCheck) {
    return functionToCheck && {}.toString.call(functionToCheck) === '[object Function]';
};
export var isStorageControllerLike = function (value) {
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
var isBrowser = typeof window !== 'undefined';
var isNotProductionBuild = process.env.NODE_ENV !== 'production';
export var invalidStorageAdaptorWarningIf = function (storageAdaptor, storageName) {
    if (isBrowser && isNotProductionBuild && !isStorageControllerLike(storageAdaptor)) {
        console.warn("mobx-persist-store: " + storageName + " does not have a valid storage adaptor.\n\n* Make sure the storage controller has 'getItem', 'setItem' and 'removeItem' methods.\"");
    }
};
export var duplicatedStoreWarningIf = function (hasPersistedStoreAlready, storageName) {
    if (isBrowser && isNotProductionBuild && hasPersistedStoreAlready) {
        console.warn("mobx-persist-store: 'makePersistable' was called was called with the same storage name \"" + storageName + "\".\n\n * Make sure you call \"stopPersisting\" before recreating \"" + storageName + "\" to avoid memory leaks. \n * Or double check you did not have two stores with the same name.");
    }
};
export var computedPersistWarningIf = function (isComputedProperty, propertyName) {
    if (isBrowser && isNotProductionBuild && isComputedProperty) {
        console.warn("mobx-persist-store: The property '" + propertyName + "' is computed and will not persist.");
    }
};
export var actionPersistWarningIf = function (isComputedProperty, propertyName) {
    if (isBrowser && isNotProductionBuild && isComputedProperty) {
        console.warn("mobx-persist-store: The property '" + propertyName + "' is an action and will not persist.");
    }
};
export var consoleDebug = function (isDebugMode, message, content) {
    if (content === void 0) { content = ''; }
    if (isDebugMode && isBrowser && isNotProductionBuild) {
        console.info("%c mobx-persist-store: (Debug Mode) " + message + " ", 'background: #4B8CC5; color: black; display: block;', content);
    }
};
