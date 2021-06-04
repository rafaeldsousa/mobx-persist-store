"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.addMapping = void 0;
const serializr_1 = require("serializr");
const types_1 = require("./types");
function addMapping(...args) {
    const [a, b, c] = args;
    if (a in types_1.types) {
        return serializr_1.serializable(types_1.types[a](b));
    }
    else {
        return serializr_1.serializable.apply(null, args);
    }
}
exports.addMapping = addMapping;
