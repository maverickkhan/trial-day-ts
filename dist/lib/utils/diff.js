"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = diff;
function isObject(value) {
    return value !== null && typeof value === 'object' && !Array.isArray(value);
}
function safeParse(obj) {
    if (typeof obj === 'string') {
        try {
            return JSON.parse(obj);
        }
        catch {
            throw new Error('Invalid JSON passed to diff()');
        }
    }
    return obj;
}
function diff(oldObjRaw, newObjRaw) {
    const oldObj = safeParse(oldObjRaw);
    const newObj = safeParse(newObjRaw);
    const changes = {};
    for (const key of Object.keys(newObj)) {
        const a = oldObj[key];
        const b = newObj[key];
        if (isObject(a) && isObject(b)) {
            const nested = diff(a, b);
            if (Object.keys(nested).length > 0) {
                changes[key] = nested;
            }
        }
        else if (a !== b) {
            changes[key] = b;
        }
    }
    return changes;
}
