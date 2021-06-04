"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.StorageAdapter = void 0;
const utils_1 = require("./utils");
class StorageAdapter {
    constructor(options) {
        this.options = options;
    }
    async setItem(key, item) {
        var _a;
        const { stringify = true, debugMode = false } = this.options;
        const data = this.options.expireIn
            ? Object.assign({}, item, {
                __mps__: {
                    expireInTimestamp: utils_1.buildExpireTimestamp(this.options.expireIn),
                },
            })
            : item;
        const content = stringify ? JSON.stringify(data) : data;
        utils_1.consoleDebug(debugMode, `${key} - setItem:`, content);
        await ((_a = this.options.storage) === null || _a === void 0 ? void 0 : _a.setItem(key, content));
    }
    async getItem(key) {
        var _a, _b;
        const { removeOnExpiration = true, debugMode = false } = this.options;
        const storageData = await ((_a = this.options.storage) === null || _a === void 0 ? void 0 : _a.getItem(key));
        let parsedData;
        try {
            parsedData = JSON.parse(storageData) || {};
        }
        catch (error) {
            parsedData = storageData || {};
        }
        const hasExpired = utils_1.hasTimestampExpired((_b = parsedData.__mps__) === null || _b === void 0 ? void 0 : _b.expireInTimestamp);
        utils_1.consoleDebug(debugMode, `${key} - hasExpired`, hasExpired);
        if (hasExpired && removeOnExpiration) {
            await this.removeItem(key);
        }
        parsedData = hasExpired ? {} : parsedData;
        utils_1.consoleDebug(debugMode, `${key} - (getItem):`, parsedData);
        return parsedData;
    }
    async removeItem(key) {
        var _a;
        const { debugMode = false } = this.options;
        utils_1.consoleDebug(debugMode, `${key} - (removeItem): storage was removed`);
        await ((_a = this.options.storage) === null || _a === void 0 ? void 0 : _a.removeItem(key));
    }
}
exports.StorageAdapter = StorageAdapter;
