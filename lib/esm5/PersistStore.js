var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
import { action, isAction, isComputedProp, makeObservable, observable, reaction, runInAction, toJS, } from 'mobx';
import { PersistStoreMap } from './PersistStoreMap';
import { StorageAdapter } from './StorageAdapter';
import { mpsConfig, mpsReactionOptions } from './configurePersistable';
import { actionPersistWarningIf, computedPersistWarningIf, consoleDebug, invalidStorageAdaptorWarningIf, } from './utils';
import { getDefaultModelSchema, serialize, update } from 'serializr';
var PersistStore = /** @class */ (function () {
    function PersistStore(target, options, reactionOptions) {
        if (reactionOptions === void 0) { reactionOptions = {}; }
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
        consoleDebug(this.debugMode, this.storageName + " - (makePersistable)", {
            properties: this.properties,
            storageAdapter: this.storageAdapter,
            reactionOptions: this.reactionOptions,
        });
    }
    PersistStore.prototype.init = function () {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.hydrateStore()];
                    case 1:
                        _a.sent();
                        this.startPersisting();
                        return [2 /*return*/, this];
                }
            });
        });
    };
    PersistStore.prototype.hydrateStore = function () {
        return __awaiter(this, void 0, void 0, function () {
            var isBeingWatched, data_1, target;
            var _this = this;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        isBeingWatched = Boolean(this.cancelWatch);
                        if (this.isPersisting) {
                            this.pausePersisting();
                        }
                        runInAction(function () {
                            _this.isHydrated = false;
                            consoleDebug(_this.debugMode, _this.storageName + " - (hydrateStore) isHydrated:", _this.isHydrated);
                        });
                        if (!(this.storageAdapter && this.target)) return [3 /*break*/, 2];
                        return [4 /*yield*/, this.storageAdapter.getItem(this.storageName)];
                    case 1:
                        data_1 = _a.sent();
                        target = this.target;
                        if (data_1) {
                            runInAction(function () {
                                _this.schema = getDefaultModelSchema(_this.target);
                                if (_this.schema && typeof _this.properties === 'object') {
                                    update(_this.schema, _this.target, data_1, null, null);
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
                        _a.label = 2;
                    case 2:
                        runInAction(function () {
                            _this.isHydrated = true;
                            consoleDebug(_this.debugMode, _this.storageName + " - isHydrated:", _this.isHydrated);
                        });
                        if (isBeingWatched) {
                            this.startPersisting();
                        }
                        return [2 /*return*/];
                }
            });
        });
    };
    PersistStore.prototype.startPersisting = function () {
        var _this = this;
        if (!this.storageAdapter || !this.target || this.cancelWatch) {
            return;
        }
        // Reassigning so TypeScript doesn't complain (Object is possibly 'null') about and this.target within reaction
        var target = this.target;
        this.cancelWatch = reaction(function () {
            var propertiesToWatch = {};
            _this.properties.forEach(function (propertyName) {
                var isComputedProperty = isComputedProp(target, String(propertyName));
                var isActionProperty = isAction(target[propertyName]);
                computedPersistWarningIf(isComputedProperty, propertyName);
                actionPersistWarningIf(isActionProperty, propertyName);
                if (!isComputedProperty && !isActionProperty) {
                    propertiesToWatch[propertyName] = toJS(target[propertyName]);
                }
            });
            return propertiesToWatch;
        }, function (dataToSave) { return __awaiter(_this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        if (this.schema) {
                            serialize(this.schema, this.target);
                        }
                        if (!this.storageAdapter) return [3 /*break*/, 2];
                        return [4 /*yield*/, this.storageAdapter.setItem(this.storageName, dataToSave)];
                    case 1:
                        _a.sent();
                        _a.label = 2;
                    case 2: return [2 /*return*/];
                }
            });
        }); }, this.reactionOptions);
        this.isPersisting = true;
        consoleDebug(this.debugMode, this.storageName + " - (startPersisting) isPersisting:", this.isPersisting);
    };
    PersistStore.prototype.pausePersisting = function () {
        this.isPersisting = false;
        consoleDebug(this.debugMode, this.storageName + " - pausePersisting (isPersisting):", this.isPersisting);
        if (this.cancelWatch) {
            this.cancelWatch();
            this.cancelWatch = null;
        }
    };
    PersistStore.prototype.stopPersisting = function () {
        this.pausePersisting();
        consoleDebug(this.debugMode, this.storageName + " - (stopPersisting)");
        PersistStoreMap.delete(this.target);
        this.cancelWatch = null;
        this.properties = [];
        this.reactionOptions = {};
        this.storageAdapter = null;
        this.target = null;
    };
    PersistStore.prototype.clearPersistedStore = function () {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        if (!this.storageAdapter) return [3 /*break*/, 2];
                        consoleDebug(this.debugMode, this.storageName + " - (clearPersistedStore)");
                        return [4 /*yield*/, this.storageAdapter.removeItem(this.storageName)];
                    case 1:
                        _a.sent();
                        _a.label = 2;
                    case 2: return [2 /*return*/];
                }
            });
        });
    };
    PersistStore.prototype.getPersistedStore = function () {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                if (this.storageAdapter) {
                    consoleDebug(this.debugMode, this.storageName + " - (getPersistedStore)");
                    // @ts-ignore
                    return [2 /*return*/, this.storageAdapter.getItem(this.storageName)];
                }
                return [2 /*return*/, null];
            });
        });
    };
    return PersistStore;
}());
export { PersistStore };
