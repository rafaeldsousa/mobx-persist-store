"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PersistStore = void 0;
const mobx_1 = require("mobx");
const PersistStoreMap_1 = require("./PersistStoreMap");
const StorageAdapter_1 = require("./StorageAdapter");
const configurePersistable_1 = require("./configurePersistable");
const utils_1 = require("./utils");
const serializr_1 = require("serializr");
class PersistStore {
    constructor(target, options, reactionOptions = {}) {
        var _a, _b, _c, _d, _e, _f, _g;
        this.cancelWatch = null;
        this.properties = [];
        this.reactionOptions = {};
        this.storageAdapter = null;
        this.target = null;
        this.schema = null;
        this.debugMode = false;
        this.isHydrated = false;
        this.isPersisting = false;
        this.storageName = '';
        this.target = target;
        this.storageName = options.name;
        this.properties = options.properties;
        this.reactionOptions = Object.assign({ fireImmediately: true }, configurePersistable_1.mpsReactionOptions, reactionOptions);
        this.debugMode = (_b = (_a = options.debugMode) !== null && _a !== void 0 ? _a : configurePersistable_1.mpsConfig.debugMode) !== null && _b !== void 0 ? _b : false;
        this.storageAdapter = new StorageAdapter_1.StorageAdapter({
            expireIn: (_c = options.expireIn) !== null && _c !== void 0 ? _c : configurePersistable_1.mpsConfig.expireIn,
            removeOnExpiration: (_e = (_d = options.removeOnExpiration) !== null && _d !== void 0 ? _d : configurePersistable_1.mpsConfig.removeOnExpiration) !== null && _e !== void 0 ? _e : true,
            stringify: (_g = (_f = options.stringify) !== null && _f !== void 0 ? _f : configurePersistable_1.mpsConfig.stringify) !== null && _g !== void 0 ? _g : true,
            storage: options.storage ? options.storage : configurePersistable_1.mpsConfig.storage,
            debugMode: this.debugMode,
        });
        mobx_1.makeObservable(this, {
            clearPersistedStore: mobx_1.action,
            hydrateStore: mobx_1.action,
            isHydrated: mobx_1.observable,
            isPersisting: mobx_1.observable,
            pausePersisting: mobx_1.action,
            startPersisting: mobx_1.action,
            stopPersisting: mobx_1.action,
        }, { autoBind: true, deep: false });
        utils_1.invalidStorageAdaptorWarningIf(this.storageAdapter.options.storage, this.storageName);
        utils_1.consoleDebug(this.debugMode, `${this.storageName} - (makePersistable)`, {
            properties: this.properties,
            storageAdapter: this.storageAdapter,
            reactionOptions: this.reactionOptions,
        });
    }
    async init() {
        await this.hydrateStore();
        this.startPersisting();
        return this;
    }
    async hydrateStore() {
        // If the user calls stopPersist and then rehydrateStore we don't want to automatically call startPersist below
        const isBeingWatched = Boolean(this.cancelWatch);
        if (this.isPersisting) {
            this.pausePersisting();
        }
        mobx_1.runInAction(() => {
            this.isHydrated = false;
            utils_1.consoleDebug(this.debugMode, `${this.storageName} - (hydrateStore) isHydrated:`, this.isHydrated);
        });
        if (this.storageAdapter && this.target) {
            const data = await this.storageAdapter.getItem(this.storageName);
            // Reassigning so TypeScript doesn't complain (Object is possibly 'null') about this.target within forEach
            const target = this.target;
            if (data) {
                mobx_1.runInAction(() => {
                    this.schema = serializr_1.getDefaultModelSchema(this.target);
                    if (this.schema && typeof this.properties === 'object') {
                        serializr_1.update(this.schema, this.target, data, null, null);
                    }
                    // this.properties.forEach((propertyName: string) => {
                    //   const allowPropertyHydration = [
                    //     target.hasOwnProperty(propertyName),
                    //     typeof data[propertyName] !== 'undefined',
                    //   ].every(Boolean);
                    //   if (allowPropertyHydration) {
                    //     target[propertyName] = data[propertyName];
                    //   }
                    // });
                });
            }
        }
        mobx_1.runInAction(() => {
            this.isHydrated = true;
            utils_1.consoleDebug(this.debugMode, `${this.storageName} - isHydrated:`, this.isHydrated);
        });
        if (isBeingWatched) {
            this.startPersisting();
        }
    }
    startPersisting() {
        if (!this.storageAdapter || !this.target || this.cancelWatch) {
            return;
        }
        // Reassigning so TypeScript doesn't complain (Object is possibly 'null') about and this.target within reaction
        const target = this.target;
        this.cancelWatch = mobx_1.reaction(() => {
            const propertiesToWatch = {};
            this.properties.forEach((propertyName) => {
                const isComputedProperty = mobx_1.isComputedProp(target, String(propertyName));
                const isActionProperty = mobx_1.isAction(target[propertyName]);
                utils_1.computedPersistWarningIf(isComputedProperty, propertyName);
                utils_1.actionPersistWarningIf(isActionProperty, propertyName);
                if (!isComputedProperty && !isActionProperty) {
                    propertiesToWatch[propertyName] = mobx_1.toJS(target[propertyName]);
                }
            });
            return propertiesToWatch;
        }, async (dataToSave) => {
            if (this.schema) {
                serializr_1.serialize(this.schema, this.target);
            }
            if (this.storageAdapter) {
                await this.storageAdapter.setItem(this.storageName, dataToSave);
            }
        }, this.reactionOptions);
        this.isPersisting = true;
        utils_1.consoleDebug(this.debugMode, `${this.storageName} - (startPersisting) isPersisting:`, this.isPersisting);
    }
    pausePersisting() {
        this.isPersisting = false;
        utils_1.consoleDebug(this.debugMode, `${this.storageName} - pausePersisting (isPersisting):`, this.isPersisting);
        if (this.cancelWatch) {
            this.cancelWatch();
            this.cancelWatch = null;
        }
    }
    stopPersisting() {
        this.pausePersisting();
        utils_1.consoleDebug(this.debugMode, `${this.storageName} - (stopPersisting)`);
        PersistStoreMap_1.PersistStoreMap.delete(this.target);
        this.cancelWatch = null;
        this.properties = [];
        this.reactionOptions = {};
        this.storageAdapter = null;
        this.target = null;
    }
    async clearPersistedStore() {
        if (this.storageAdapter) {
            utils_1.consoleDebug(this.debugMode, `${this.storageName} - (clearPersistedStore)`);
            await this.storageAdapter.removeItem(this.storageName);
        }
    }
    async getPersistedStore() {
        if (this.storageAdapter) {
            utils_1.consoleDebug(this.debugMode, `${this.storageName} - (getPersistedStore)`);
            // @ts-ignore
            return this.storageAdapter.getItem(this.storageName);
        }
        return null;
    }
}
exports.PersistStore = PersistStore;
