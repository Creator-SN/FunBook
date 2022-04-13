"use strict";
exports.__esModule = true;
exports.StringRender = void 0;
var StringRender = /** @class */ (function () {
    function StringRender() {
    }
    StringRender.index = function (obj, is, value) {
        if (typeof is == "string") {
            is = is.split(".");
        }
        if (is.length == 1 && value !== undefined) {
            return (obj[is[0]] = value);
        }
        else if (is.length == 0) {
            return obj;
        }
        else {
            return StringRender.index(obj[is[0]], is.slice(1), value);
        }
    };
    StringRender.render = function (template, obj) {
        return template.replace(/\$\{(.+?)\}/g, function (_, p1) {
            return StringRender.index(obj, p1);
        });
    };
    return StringRender;
}());
exports.StringRender = StringRender;
exports["default"] = { StringRender: StringRender };
