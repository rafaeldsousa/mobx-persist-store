import { list as _list, map as _map, object as _object, custom } from 'serializr';
function _walk(v) {
    if (typeof v === 'object' && v)
        Object.keys(v).map(k => _walk(v[k]));
    return v;
}
function _default() {
    return custom(_walk, (v) => v);
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
export const types = { object, list, map };
