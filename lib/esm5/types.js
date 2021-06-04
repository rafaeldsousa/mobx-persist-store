import { list as _list, map as _map, object as _object, custom } from 'serializr';
function _walk(v) {
    if (typeof v === 'object' && v)
        Object.keys(v).map(function (k) { return _walk(v[k]); });
    return v;
}
function _default() {
    return custom(_walk, function (v) { return v; });
}
function object(s) {
    return s ? _object(s) : _default();
}
function list(s) {
    return _list(object(s));
}
function map(s) {
    return _map(object(s));
}
export var types = { object: object, list: list, map: map };
