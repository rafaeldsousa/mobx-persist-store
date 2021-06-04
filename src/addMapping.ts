import { serializable } from "serializr";
import { Types, types } from "./types";

export function addMapping(type: Types, schema?: any): (target: Object, key: string, baseDescriptor?: PropertyDescriptor) => void // two
export function addMapping(target: Object, key: string, baseDescriptor?: PropertyDescriptor): void // method decorator
export function addMapping(schema: Object): <T>(target: T) => T // object
export function addMapping(...args: any[]): any {
    const [a, b, c] = args;

    if (a in types) {
        return serializable(types[a](b));
    } else {
        return serializable.apply(null, args as [target: any, key: string, baseDescriptor?: PropertyDescriptor | undefined])
    }
}