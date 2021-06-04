import { action, isAction, isComputedProp, makeObservable, observable, reaction, runInAction, toJS, } from 'mobx';
import { PersistStoreMap } from './PersistStoreMap';
import { StorageAdapter } from './StorageAdapter';
import { mpsConfig, mpsReactionOptions } from './configurePersistable';
import { actionPersistWarningIf, computedPersistWarningIf, consoleDebug, invalidStorageAdaptorWarningIf, } from './utils';
import { getDefaultModelSchema, serialize, update } from 'serializr';
export class PersistStore {
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
        this.reactionOptions = Object.assign({ fireImmediately: true }, mpsReactionOptions, reactionOptions);
        this.debugMode = (_b = (_a = options.debugMode) !== null && _a !== void 0 ? _a : mpsConfig.debugMode) !== null && _b !== void 0 ? _b : false;
        this.storageAdapter = new StorageAdapter({
            expireIn: (_c = options.expireIn) !== null && _c !== void 0 ? _c : mpsConfig.expireIn,
            removeOnExpiration: (_e = (_d = options.removeOnExpiration) !== null && _d !== void 0 ? _d : mpsConfig.removeOnExpiration) !== null && _e !== void 0 ? _e : true,
            stringify: (_g = (_f = options.stringify) !== null && _f !== void 0 ? _f : mpsConfig.stringify) !== null && _g !== void 0 ? _g : true,
            storage: options.storage ? options.storage : mpsConfig.storage,
            debugMode: this.debugMode,
        });
        makeObservable(this, {
            clearPersistedStore: action,
            hydrateStore: action,
            isHydrated: observable,
            isPersisting: observable,
            pausePersisting: action,
            startPersisting: action,
            stopPersisting: action,
        }, { autoBind: true, deep: false });
        invalidStorageAdaptorWarningIf(this.storageAdapter.options.storage, this.storageName);
        consoleDebug(this.debugMode, `${this.storageName} - (makePersistable)`, {
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
        runInAction(() => {
            this.isHydrated = false;
            consoleDebug(this.debugMode, `${this.storageName} - (hydrateStore) isHydrated:`, this.isHydrated);
        });
        if (this.storageAdapter && this.target) {
            const data = await this.storageAdapter.getItem(this.storageName);
            // Reassigning so TypeScript doesn't complain (Object is possibly 'null') about this.target within forEach
            const target = this.target;
            if (data) {
                runInAction(() => {
                    this.schema = getDefaultModelSchema(this.target);
                    if (this.schema && typeof this.properties === 'object') {
                        update(this.schema, this.target, data, null, null);
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
        runInAction(() => {
            this.isHydrated = true;
            consoleDebug(this.debugMode, `${this.storageName} - isHydrated:`, this.isHydrated);
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
        this.cancelWatch = reaction(() => {
            const propertiesToWatch = {};
            this.properties.forEach((propertyName) => {
                const isComputedProperty = isComputedProp(target, String(propertyName));
                const isActionProperty = isAction(target[propertyName]);
                computedPersistWarningIf(isComputedProperty, propertyName);
                actionPersistWarningIf(isActionProperty, propertyName);
                if (!isComputedProperty && !isActionProperty) {
                    propertiesToWatch[propertyName] = toJS(target[propertyName]);
                }
            });
            return propertiesToWatch;
        }, async (dataToSave) => {
            if (this.schema) {
                serialize(this.schema, this.target);
            }
            if (this.storageAdapter) {
                await this.storageAdapter.setItem(this.storageName, dataToSave);
            }
        }, this.reactionOptions);
        this.isPersisting = true;
        consoleDebug(this.debugMode, `${this.storageName} - (startPersisting) isPersisting:`, this.isPersisting);
    }
    pausePersisting() {
        this.isPersisting = false;
        consoleDebug(this.debugMode, `${this.storageName} - pausePersisting (isPersisting):`, this.isPersisting);
        if (this.cancelWatch) {
            this.cancelWatch();
            this.cancelWatch = null;
        }
    }
    stopPersisting() {
        this.pausePersisting();
        consoleDebug(this.debugMode, `${this.storageName} - (stopPersisting)`);
        PersistStoreMap.delete(this.target);
        this.cancelWatch = null;
        this.properties = [];
        this.reactionOptions = {};
        this.storageAdapter = null;
        this.target = null;
    }
    async clearPersistedStore() {
        if (this.storageAdapter) {
            consoleDebug(this.debugMode, `${this.storageName} - (clearPersistedStore)`);
            await this.storageAdapter.removeItem(this.storageName);
        }
    }
    async getPersistedStore() {
        if (this.storageAdapter) {
            consoleDebug(this.debugMode, `${this.storageName} - (getPersistedStore)`);
            // @ts-ignore
            return this.storageAdapter.getItem(this.storageName);
        }
        return null;
    }
}
