"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.makePersistable = void 0;
const PersistStore_1 = require("./PersistStore");
const PersistStoreMap_1 = require("./PersistStoreMap");
const utils_1 = require("./utils");
const makePersistable = async (target, storageOptions, reactionOptions) => {
    const mobxPersistStore = new PersistStore_1.PersistStore(target, storageOptions, reactionOptions);
    const hasPersistedStoreAlready = Array.from(PersistStoreMap_1.PersistStoreMap.values())
        .map((item) => item.storageName)
        .includes(mobxPersistStore.storageName);
    utils_1.duplicatedStoreWarningIf(hasPersistedStoreAlready, mobxPersistStore.storageName);
    PersistStoreMap_1.PersistStoreMap.set(target, mobxPersistStore);
    return mobxPersistStore.init();
};
exports.makePersistable = makePersistable;
