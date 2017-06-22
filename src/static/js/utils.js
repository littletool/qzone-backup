/*
 * utils.js
 * Copyright (C) 2017 Enzo Yang <divisoryang@gmail.com>
 *
 */

/**
 * @param {integer} ms 毫秒
 */
function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms))
}

/**
 * 生成一个UUID
 */
function guid() {
    var s4 = function () {
        return Math.floor((1 + Math.random()) * 0x10000)
            .toString(16)
            .substring(1);
    }
    return s4() + s4() + '-' + s4() + '-' + s4() + '-' +
        s4() + '-' + s4() + s4() + s4();
}

/**
 * 去掉标题里不太方便的字符
 *
 * @param {原名} name
 */
function filenameValidate(name) {
    name = name.replace(/\ /g, "_");
    name = name.replace(/:/g, "-");
    name = name.replace(/[\\\/\*\"<>|]/g, "_");
    return name;
}