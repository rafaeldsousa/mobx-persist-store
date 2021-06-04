import { Types } from "./types";
export declare function addMapping(type: Types, schema?: any): (target: Object, key: string, baseDescriptor?: PropertyDescriptor) => void;
export declare function addMapping(target: Object, key: string, baseDescriptor?: PropertyDescriptor): void;
export declare function addMapping(schema: Object): <T>(target: T) => T;
