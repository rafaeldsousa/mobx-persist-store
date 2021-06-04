import { serializable } from "serializr";
import { types } from "./types";
export function addMapping() {
    var args = [];
    for (var _i = 0; _i < arguments.length; _i++) {
        args[_i] = arguments[_i];
    }
    var a = args[0], b = args[1], c = args[2];
    if (a in types) {
        return serializable(types[a](b));
    }
    else {
        return serializable.apply(null, args);
    }
}
