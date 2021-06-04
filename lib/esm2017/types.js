"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.types = void 0;
const serializr_1 = require("serializr");
function _walk(v) {
    if (typeof v === 'object' && v)
        Object.keys(v).map(k => _walk(v[k]));
    return v;
}
function _default() {
    return serializr_1.custom(_walk, (v) => v);
}
function object(s) {
    return s ? serializr_1.object(s) : _default();
}
function list(s) {
    return serializr_1.list(object(s));
}
function map(s) {
    return serializr_1.map(object(s));
}
exports.types = { object, list, map };
