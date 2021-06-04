import { PersistenceStorageOptions, ReactionOptions } from './types';
export declare class PersistStore<T, P extends keyof T> {
    private cancelWatch;
    private properties;
    private reactionOptions;
    private storageAdapter;
    private target;
    private schema;
    private readonly debugMode;
    isHydrated: boolean;
    isPersisting: boolean;
    readonly storageName: string;
    constructor(target: T, options: PersistenceStorageOptions<P>, reactionOptions?: ReactionOptions);
    init(): Promise<PersistStore<T, P>>;
    hydrateStore(): Promise<void>;
    startPersisting(): void;
    pausePersisting(): void;
    stopPersisting(): void;
    clearPersistedStore(): Promise<void>;
    getPersistedStore<T extends Record<string, any>>(): Promise<T | null>;
}
