/**
 * Created by fokion on 01/03/2017.
 */
function UtilsImpl() {
    var me = this;
    me.overloadFunction = function (object, name, fn) {
        var old = object[name];
        object[name] = function() {
            if (fn && typeof fn == "function" && fn.length === arguments.length) {
                return fn.apply(this, arguments);
            } else if (typeof old == "function") {
                return old.apply(this, arguments);
            }
        };
    };
    me.castObject = function(obj, type) {
        if (!type || typeof type != "function") {
            return null;
        }
        var elem = new type();

        for ( var id in obj) {
            if (elem.hasOwnProperty(id)) {
                if (typeof obj[id] != "object") {
                    elem[id] = obj[id];
                } else {
                    elem[id] = {};
                    var map = obj[id];
                    if (map !== null) {
                        elem[id] = copyObject(map, {});
                    } else {
                        elem[id] = null;
                    }
                }
            }
        }

        return elem;
    };
    function copyObject(from, to, isSameObject) {
        if (from !== null) {
            to = isSameObject ? to : {};
            for ( var id in from) {
                if (typeof from[id] != "object") {
                    to[id] = from[id];
                } else {
                    to[id] = {};
                    if (from[id] !== null) {
                        to[id] = copyObject(from[id], {});
                    } else {
                        to[id] = null;
                    }
                }
            }
        }
        return to;
    }
    me.copyObject = copyObject;
    me.addAllValuesFromObject = function (from, to) {
        return copyObject(from, to, true);
    }
}