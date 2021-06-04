import { PersistenceStorageOptions } from './types';
import { PersistStore } from './PersistStore';
export declare const makePersistable: <T extends {
    [key: string]: any;
}, P extends keyof T>(target: T, storageOptions: PersistenceStorageOptions<P>, reactionOptions?: import("mobx").IReactionOptions | undefined) => Promise<PersistStore<T, P>>;
