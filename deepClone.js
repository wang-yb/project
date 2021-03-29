// es5 deepclone
function deepCloneES5(origin) {
    if (origin == undefined || typeof origin !== 'object') {
        return origin;
    }
    var toStr = Object.prototype.toString;
    var isArr = '[object Array]';

    var target = toStr.call(k) === isArr ? [] : {};

    for (var k in origin) {
        if (origin.hasOwnProperty(k)) {
            if (typeof origin[k] === 'object' && origin[k] !== null) {
                target[k] = deepClone(origin[k])
            } else {
                target[k] = origin[k]
            }
        }
    }
    return target;
}

// es6 deepclone
function deepCloneES6(origin, hashMap = new WeakMap()) {
    if (origin == undefined || typeof origin !== 'object') {
        return origin;
    }
    // 时间对象
    if (origin instanceof Date) {
        return new Date(origin)
    }
    // 正则
    if (origin instanceof RegExp) {
        return new RegExp(origin)
    }
    // 判断是否已经被复制
    if (hashMap.get(origin)) {
        return hashMap.get(origin)
    }
    // 利用constructor特性构建一个新的数组or对象
    let target = new origin.constructor();
    // 已被复制
    hashMap.set(origin, target)
    for (let k in origin) {
        if (origin.hasOwnProperty(k)) {
            if (typeof origin[k] === 'object' && origin[k] !== null) {
                target[k] = deepCloneES6(origin[k], hashMap);
            } else {
                target[k] = origin[k];
            }
        }
    }
    return target;
}