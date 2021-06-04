import { serializable } from "serializr";
import { types } from "./types";
export function addMapping(...args) {
    const [a, b, c] = args;
    if (a in types) {
        return serializable(types[a](b));
    }
    else {
        return serializable.apply(null, args);
    }
}
