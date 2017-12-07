/**
 * @license almond 0.3.0 Copyright (c) 2011-2014, The Dojo Foundation All Rights Reserved.
 * Available via the MIT or new BSD license.
 * see: http://github.com/jrburke/almond for details
 */
//Going sloppy to avoid 'use strict' string cost, but strict practices should
//be followed.
/*jslint sloppy: true */
/*global setTimeout: false */

var requirejs, require, define;
(function (undef) {
    var main, req, makeMap, handlers,
        defined = {},
        waiting = {},
        config = {},
        defining = {},
        hasOwn = Object.prototype.hasOwnProperty,
        aps = [].slice,
        jsSuffixRegExp = /\.js$/;

    function hasProp(obj, prop) {
        return hasOwn.call(obj, prop);
    }

    /**
     * Given a relative module name, like ./something, normalize it to
     * a real name that can be mapped to a path.
     * @param {String} name the relative name
     * @param {String} baseName a real name that the name arg is relative
     * to.
     * @returns {String} normalized name
     */
    function normalize(name, baseName) {
        var nameParts, nameSegment, mapValue, foundMap, lastIndex,
            foundI, foundStarMap, starI, i, j, part,
            baseParts = baseName && baseName.split("/"),
            map = config.map,
            starMap = (map && map['*']) || {};

        //Adjust any relative paths.
        if (name && name.charAt(0) === ".") {
            //If have a base name, try to normalize against it,
            //otherwise, assume it is a top-level require that will
            //be relative to baseUrl in the end.
            if (baseName) {
                //Convert baseName to array, and lop off the last part,
                //so that . matches that "directory" and not name of the baseName's
                //module. For instance, baseName of "one/two/three", maps to
                //"one/two/three.js", but we want the directory, "one/two" for
                //this normalization.
                baseParts = baseParts.slice(0, baseParts.length - 1);
                name = name.split('/');
                lastIndex = name.length - 1;

                // Node .js allowance:
                if (config.nodeIdCompat && jsSuffixRegExp.test(name[lastIndex])) {
                    name[lastIndex] = name[lastIndex].replace(jsSuffixRegExp, '');
                }

                name = baseParts.concat(name);

                //start trimDots
                for (i = 0; i < name.length; i += 1) {
                    part = name[i];
                    if (part === ".") {
                        name.splice(i, 1);
                        i -= 1;
                    } else if (part === "..") {
                        if (i === 1 && (name[2] === '..' || name[0] === '..')) {
                            //End of the line. Keep at least one non-dot
                            //path segment at the front so it can be mapped
                            //correctly to disk. Otherwise, there is likely
                            //no path mapping for a path starting with '..'.
                            //This can still fail, but catches the most reasonable
                            //uses of ..
                            break;
                        } else if (i > 0) {
                            name.splice(i - 1, 2);
                            i -= 2;
                        }
                    }
                }
                //end trimDots

                name = name.join("/");
            } else if (name.indexOf('./') === 0) {
                // No baseName, so this is ID is resolved relative
                // to baseUrl, pull off the leading dot.
                name = name.substring(2);
            }
        }

        //Apply map config if available.
        if ((baseParts || starMap) && map) {
            nameParts = name.split('/');

            for (i = nameParts.length; i > 0; i -= 1) {
                nameSegment = nameParts.slice(0, i).join("/");

                if (baseParts) {
                    //Find the longest baseName segment match in the config.
                    //So, do joins on the biggest to smallest lengths of baseParts.
                    for (j = baseParts.length; j > 0; j -= 1) {
                        mapValue = map[baseParts.slice(0, j).join('/')];

                        //baseName segment has  config, find if it has one for
                        //this name.
                        if (mapValue) {
                            mapValue = mapValue[nameSegment];
                            if (mapValue) {
                                //Match, update name to the new value.
                                foundMap = mapValue;
                                foundI = i;
                                break;
                            }
                        }
                    }
                }

                if (foundMap) {
                    break;
                }

                //Check for a star map match, but just hold on to it,
                //if there is a shorter segment match later in a matching
                //config, then favor over this star map.
                if (!foundStarMap && starMap && starMap[nameSegment]) {
                    foundStarMap = starMap[nameSegment];
                    starI = i;
                }
            }

            if (!foundMap && foundStarMap) {
                foundMap = foundStarMap;
                foundI = starI;
            }

            if (foundMap) {
                nameParts.splice(0, foundI, foundMap);
                name = nameParts.join('/');
            }
        }

        return name;
    }

    function makeRequire(relName, forceSync) {
        return function () {
            //A version of a require function that passes a moduleName
            //value for items that may need to
            //look up paths relative to the moduleName
            var args = aps.call(arguments, 0);

            //If first arg is not require('string'), and there is only
            //one arg, it is the array form without a callback. Insert
            //a null so that the following concat is correct.
            if (typeof args[0] !== 'string' && args.length === 1) {
                args.push(null);
            }
            return req.apply(undef, args.concat([relName, forceSync]));
        };
    }

    function makeNormalize(relName) {
        return function (name) {
            return normalize(name, relName);
        };
    }

    function makeLoad(depName) {
        return function (value) {
            defined[depName] = value;
        };
    }

    function callDep(name) {
        if (hasProp(waiting, name)) {
            var args = waiting[name];
            delete waiting[name];
            defining[name] = true;
            main.apply(undef, args);
        }

        if (!hasProp(defined, name) && !hasProp(defining, name)) {
            throw new Error('No ' + name);
        }
        return defined[name];
    }

    //Turns a plugin!resource to [plugin, resource]
    //with the plugin being undefined if the name
    //did not have a plugin prefix.
    function splitPrefix(name) {
        var prefix,
            index = name ? name.indexOf('!') : -1;
        if (index > -1) {
            prefix = name.substring(0, index);
            name = name.substring(index + 1, name.length);
        }
        return [prefix, name];
    }

    /**
     * Makes a name map, normalizing the name, and using a plugin
     * for normalization if necessary. Grabs a ref to plugin
     * too, as an optimization.
     */
    makeMap = function (name, relName) {
        var plugin,
            parts = splitPrefix(name),
            prefix = parts[0];

        name = parts[1];

        if (prefix) {
            prefix = normalize(prefix, relName);
            plugin = callDep(prefix);
        }

        //Normalize according
        if (prefix) {
            if (plugin && plugin.normalize) {
                name = plugin.normalize(name, makeNormalize(relName));
            } else {
                name = normalize(name, relName);
            }
        } else {
            name = normalize(name, relName);
            parts = splitPrefix(name);
            prefix = parts[0];
            name = parts[1];
            if (prefix) {
                plugin = callDep(prefix);
            }
        }

        //Using ridiculous property names for space reasons
        return {
            f: prefix ? prefix + '!' + name : name, //fullName
            n: name,
            pr: prefix,
            p: plugin
        };
    };

    function makeConfig(name) {
        return function () {
            return (config && config.config && config.config[name]) || {};
        };
    }

    handlers = {
        require: function (name) {
            return makeRequire(name);
        },
        exports: function (name) {
            var e = defined[name];
            if (typeof e !== 'undefined') {
                return e;
            } else {
                return (defined[name] = {});
            }
        },
        module: function (name) {
            return {
                id: name,
                uri: '',
                exports: defined[name],
                config: makeConfig(name)
            };
        }
    };

    main = function (name, deps, callback, relName) {
        var cjsModule, depName, ret, map, i,
            args = [],
            callbackType = typeof callback,
            usingExports;

        //Use name if no relName
        relName = relName || name;

        //Call the callback to define the module, if necessary.
        if (callbackType === 'undefined' || callbackType === 'function') {
            //Pull out the defined dependencies and pass the ordered
            //values to the callback.
            //Default to [require, exports, module] if no deps
            deps = !deps.length && callback.length ? ['require', 'exports', 'module'] : deps;
            for (i = 0; i < deps.length; i += 1) {
                map = makeMap(deps[i], relName);
                depName = map.f;

                //Fast path CommonJS standard dependencies.
                if (depName === "require") {
                    args[i] = handlers.require(name);
                } else if (depName === "exports") {
                    //CommonJS module spec 1.1
                    args[i] = handlers.exports(name);
                    usingExports = true;
                } else if (depName === "module") {
                    //CommonJS module spec 1.1
                    cjsModule = args[i] = handlers.module(name);
                } else if (hasProp(defined, depName) ||
                           hasProp(waiting, depName) ||
                           hasProp(defining, depName)) {
                    args[i] = callDep(depName);
                } else if (map.p) {
                    map.p.load(map.n, makeRequire(relName, true), makeLoad(depName), {});
                    args[i] = defined[depName];
                } else {
                    throw new Error(name + ' missing ' + depName);
                }
            }

            ret = callback ? callback.apply(defined[name], args) : undefined;

            if (name) {
                //If setting exports via "module" is in play,
                //favor that over return value and exports. After that,
                //favor a non-undefined return value over exports use.
                if (cjsModule && cjsModule.exports !== undef &&
                        cjsModule.exports !== defined[name]) {
                    defined[name] = cjsModule.exports;
                } else if (ret !== undef || !usingExports) {
                    //Use the return value from the function.
                    defined[name] = ret;
                }
            }
        } else if (name) {
            //May just be an object definition for the module. Only
            //worry about defining if have a module name.
            defined[name] = callback;
        }
    };

    requirejs = require = req = function (deps, callback, relName, forceSync, alt) {
        if (typeof deps === "string") {
            if (handlers[deps]) {
                //callback in this case is really relName
                return handlers[deps](callback);
            }
            //Just return the module wanted. In this scenario, the
            //deps arg is the module name, and second arg (if passed)
            //is just the relName.
            //Normalize module name, if it contains . or ..
            return callDep(makeMap(deps, callback).f);
        } else if (!deps.splice) {
            //deps is a config object, not an array.
            config = deps;
            if (config.deps) {
                req(config.deps, config.callback);
            }
            if (!callback) {
                return;
            }

            if (callback.splice) {
                //callback is an array, which means it is a dependency list.
                //Adjust args if there are dependencies
                deps = callback;
                callback = relName;
                relName = null;
            } else {
                deps = undef;
            }
        }

        //Support require(['a'])
        callback = callback || function () {};

        //If relName is a function, it is an errback handler,
        //so remove it.
        if (typeof relName === 'function') {
            relName = forceSync;
            forceSync = alt;
        }

        //Simulate async callback;
        if (forceSync) {
            main(undef, deps, callback, relName);
        } else {
            //Using a non-zero value because of concern for what old browsers
            //do, and latest browsers "upgrade" to 4 if lower value is used:
            //http://www.whatwg.org/specs/web-apps/current-work/multipage/timers.html#dom-windowtimers-settimeout:
            //If want a value immediately, use require('id') instead -- something
            //that works in almond on the global level, but not guaranteed and
            //unlikely to work in other AMD implementations.
            setTimeout(function () {
                main(undef, deps, callback, relName);
            }, 4);
        }

        return req;
    };

    /**
     * Just drops the config on the floor, but returns req in case
     * the config return value is used.
     */
    req.config = function (cfg) {
        return req(cfg);
    };

    /**
     * Expose module registry for debugging and tooling
     */
    requirejs._defined = defined;

    define = function (name, deps, callback) {

        //This module may not have dependencies
        if (!deps.splice) {
            //deps is not an array, so probably means
            //an object literal or factory function for
            //the value. Adjust args.
            callback = deps;
            deps = [];
        }

        if (!hasProp(defined, name) && !hasProp(waiting, name)) {
            waiting[name] = [name, deps, callback];
        }
    };

    define.amd = {
        jQuery: true
    };
}());

(function () {
    var root = this;
    var previousUnderscore = root._;
    var ArrayProto = Array.prototype, ObjProto = Object.prototype, FuncProto = Function.prototype;
    var push = ArrayProto.push, slice = ArrayProto.slice, concat = ArrayProto.concat, toString = ObjProto.toString, hasOwnProperty = ObjProto.hasOwnProperty;
    var nativeIsArray = Array.isArray, nativeKeys = Object.keys, nativeBind = FuncProto.bind;
    var _ = function (obj) {
        if (obj instanceof _)
            return obj;
        if (!(this instanceof _))
            return new _(obj);
        this._wrapped = obj;
    };
    if (typeof exports !== 'undefined') {
        if (typeof module !== 'undefined' && module.exports) {
            exports = module.exports = _;
        }
        exports._ = _;
    } else {
        root._ = _;
    }
    _.VERSION = '1.7.0';
    var createCallback = function (func, context, argCount) {
        if (context === void 0)
            return func;
        switch (argCount == null ? 3 : argCount) {
        case 1:
            return function (value) {
                return func.call(context, value);
            };
        case 2:
            return function (value, other) {
                return func.call(context, value, other);
            };
        case 3:
            return function (value, index, collection) {
                return func.call(context, value, index, collection);
            };
        case 4:
            return function (accumulator, value, index, collection) {
                return func.call(context, accumulator, value, index, collection);
            };
        }
        return function () {
            return func.apply(context, arguments);
        };
    };
    _.iteratee = function (value, context, argCount) {
        if (value == null)
            return _.identity;
        if (_.isFunction(value))
            return createCallback(value, context, argCount);
        if (_.isObject(value))
            return _.matches(value);
        return _.property(value);
    };
    _.each = _.forEach = function (obj, iteratee, context) {
        if (obj == null)
            return obj;
        iteratee = createCallback(iteratee, context);
        var i, length = obj.length;
        if (length === +length) {
            for (i = 0; i < length; i++) {
                iteratee(obj[i], i, obj);
            }
        } else {
            var keys = _.keys(obj);
            for (i = 0, length = keys.length; i < length; i++) {
                iteratee(obj[keys[i]], keys[i], obj);
            }
        }
        return obj;
    };
    _.map = _.collect = function (obj, iteratee, context) {
        if (obj == null)
            return [];
        iteratee = _.iteratee(iteratee, context);
        var keys = obj.length !== +obj.length && _.keys(obj), length = (keys || obj).length, results = Array(length), currentKey;
        for (var index = 0; index < length; index++) {
            currentKey = keys ? keys[index] : index;
            results[index] = iteratee(obj[currentKey], currentKey, obj);
        }
        return results;
    };
    var reduceError = 'Reduce of empty array with no initial value';
    _.reduce = _.foldl = _.inject = function (obj, iteratee, memo, context) {
        if (obj == null)
            obj = [];
        iteratee = createCallback(iteratee, context, 4);
        var keys = obj.length !== +obj.length && _.keys(obj), length = (keys || obj).length, index = 0, currentKey;
        if (arguments.length < 3) {
            if (!length)
                throw new TypeError(reduceError);
            memo = obj[keys ? keys[index++] : index++];
        }
        for (; index < length; index++) {
            currentKey = keys ? keys[index] : index;
            memo = iteratee(memo, obj[currentKey], currentKey, obj);
        }
        return memo;
    };
    _.reduceRight = _.foldr = function (obj, iteratee, memo, context) {
        if (obj == null)
            obj = [];
        iteratee = createCallback(iteratee, context, 4);
        var keys = obj.length !== +obj.length && _.keys(obj), index = (keys || obj).length, currentKey;
        if (arguments.length < 3) {
            if (!index)
                throw new TypeError(reduceError);
            memo = obj[keys ? keys[--index] : --index];
        }
        while (index--) {
            currentKey = keys ? keys[index] : index;
            memo = iteratee(memo, obj[currentKey], currentKey, obj);
        }
        return memo;
    };
    _.find = _.detect = function (obj, predicate, context) {
        var result;
        predicate = _.iteratee(predicate, context);
        _.some(obj, function (value, index, list) {
            if (predicate(value, index, list)) {
                result = value;
                return true;
            }
        });
        return result;
    };
    _.filter = _.select = function (obj, predicate, context) {
        var results = [];
        if (obj == null)
            return results;
        predicate = _.iteratee(predicate, context);
        _.each(obj, function (value, index, list) {
            if (predicate(value, index, list))
                results.push(value);
        });
        return results;
    };
    _.reject = function (obj, predicate, context) {
        return _.filter(obj, _.negate(_.iteratee(predicate)), context);
    };
    _.every = _.all = function (obj, predicate, context) {
        if (obj == null)
            return true;
        predicate = _.iteratee(predicate, context);
        var keys = obj.length !== +obj.length && _.keys(obj), length = (keys || obj).length, index, currentKey;
        for (index = 0; index < length; index++) {
            currentKey = keys ? keys[index] : index;
            if (!predicate(obj[currentKey], currentKey, obj))
                return false;
        }
        return true;
    };
    _.some = _.any = function (obj, predicate, context) {
        if (obj == null)
            return false;
        predicate = _.iteratee(predicate, context);
        var keys = obj.length !== +obj.length && _.keys(obj), length = (keys || obj).length, index, currentKey;
        for (index = 0; index < length; index++) {
            currentKey = keys ? keys[index] : index;
            if (predicate(obj[currentKey], currentKey, obj))
                return true;
        }
        return false;
    };
    _.contains = _.include = function (obj, target) {
        if (obj == null)
            return false;
        if (obj.length !== +obj.length)
            obj = _.values(obj);
        return _.indexOf(obj, target) >= 0;
    };
    _.invoke = function (obj, method) {
        var args = slice.call(arguments, 2);
        var isFunc = _.isFunction(method);
        return _.map(obj, function (value) {
            return (isFunc ? method : value[method]).apply(value, args);
        });
    };
    _.pluck = function (obj, key) {
        return _.map(obj, _.property(key));
    };
    _.where = function (obj, attrs) {
        return _.filter(obj, _.matches(attrs));
    };
    _.findWhere = function (obj, attrs) {
        return _.find(obj, _.matches(attrs));
    };
    _.max = function (obj, iteratee, context) {
        var result = -Infinity, lastComputed = -Infinity, value, computed;
        if (iteratee == null && obj != null) {
            obj = obj.length === +obj.length ? obj : _.values(obj);
            for (var i = 0, length = obj.length; i < length; i++) {
                value = obj[i];
                if (value > result) {
                    result = value;
                }
            }
        } else {
            iteratee = _.iteratee(iteratee, context);
            _.each(obj, function (value, index, list) {
                computed = iteratee(value, index, list);
                if (computed > lastComputed || computed === -Infinity && result === -Infinity) {
                    result = value;
                    lastComputed = computed;
                }
            });
        }
        return result;
    };
    _.min = function (obj, iteratee, context) {
        var result = Infinity, lastComputed = Infinity, value, computed;
        if (iteratee == null && obj != null) {
            obj = obj.length === +obj.length ? obj : _.values(obj);
            for (var i = 0, length = obj.length; i < length; i++) {
                value = obj[i];
                if (value < result) {
                    result = value;
                }
            }
        } else {
            iteratee = _.iteratee(iteratee, context);
            _.each(obj, function (value, index, list) {
                computed = iteratee(value, index, list);
                if (computed < lastComputed || computed === Infinity && result === Infinity) {
                    result = value;
                    lastComputed = computed;
                }
            });
        }
        return result;
    };
    _.shuffle = function (obj) {
        var set = obj && obj.length === +obj.length ? obj : _.values(obj);
        var length = set.length;
        var shuffled = Array(length);
        for (var index = 0, rand; index < length; index++) {
            rand = _.random(0, index);
            if (rand !== index)
                shuffled[index] = shuffled[rand];
            shuffled[rand] = set[index];
        }
        return shuffled;
    };
    _.sample = function (obj, n, guard) {
        if (n == null || guard) {
            if (obj.length !== +obj.length)
                obj = _.values(obj);
            return obj[_.random(obj.length - 1)];
        }
        return _.shuffle(obj).slice(0, Math.max(0, n));
    };
    _.sortBy = function (obj, iteratee, context) {
        iteratee = _.iteratee(iteratee, context);
        return _.pluck(_.map(obj, function (value, index, list) {
            return {
                value: value,
                index: index,
                criteria: iteratee(value, index, list)
            };
        }).sort(function (left, right) {
            var a = left.criteria;
            var b = right.criteria;
            if (a !== b) {
                if (a > b || a === void 0)
                    return 1;
                if (a < b || b === void 0)
                    return -1;
            }
            return left.index - right.index;
        }), 'value');
    };
    var group = function (behavior) {
        return function (obj, iteratee, context) {
            var result = {};
            iteratee = _.iteratee(iteratee, context);
            _.each(obj, function (value, index) {
                var key = iteratee(value, index, obj);
                behavior(result, value, key);
            });
            return result;
        };
    };
    _.groupBy = group(function (result, value, key) {
        if (_.has(result, key))
            result[key].push(value);
        else
            result[key] = [value];
    });
    _.indexBy = group(function (result, value, key) {
        result[key] = value;
    });
    _.countBy = group(function (result, value, key) {
        if (_.has(result, key))
            result[key]++;
        else
            result[key] = 1;
    });
    _.sortedIndex = function (array, obj, iteratee, context) {
        iteratee = _.iteratee(iteratee, context, 1);
        var value = iteratee(obj);
        var low = 0, high = array.length;
        while (low < high) {
            var mid = low + high >>> 1;
            if (iteratee(array[mid]) < value)
                low = mid + 1;
            else
                high = mid;
        }
        return low;
    };
    _.toArray = function (obj) {
        if (!obj)
            return [];
        if (_.isArray(obj))
            return slice.call(obj);
        if (obj.length === +obj.length)
            return _.map(obj, _.identity);
        return _.values(obj);
    };
    _.size = function (obj) {
        if (obj == null)
            return 0;
        return obj.length === +obj.length ? obj.length : _.keys(obj).length;
    };
    _.partition = function (obj, predicate, context) {
        predicate = _.iteratee(predicate, context);
        var pass = [], fail = [];
        _.each(obj, function (value, key, obj) {
            (predicate(value, key, obj) ? pass : fail).push(value);
        });
        return [
            pass,
            fail
        ];
    };
    _.first = _.head = _.take = function (array, n, guard) {
        if (array == null)
            return void 0;
        if (n == null || guard)
            return array[0];
        if (n < 0)
            return [];
        return slice.call(array, 0, n);
    };
    _.initial = function (array, n, guard) {
        return slice.call(array, 0, Math.max(0, array.length - (n == null || guard ? 1 : n)));
    };
    _.last = function (array, n, guard) {
        if (array == null)
            return void 0;
        if (n == null || guard)
            return array[array.length - 1];
        return slice.call(array, Math.max(array.length - n, 0));
    };
    _.rest = _.tail = _.drop = function (array, n, guard) {
        return slice.call(array, n == null || guard ? 1 : n);
    };
    _.compact = function (array) {
        return _.filter(array, _.identity);
    };
    var flatten = function (input, shallow, strict, output) {
        if (shallow && _.every(input, _.isArray)) {
            return concat.apply(output, input);
        }
        for (var i = 0, length = input.length; i < length; i++) {
            var value = input[i];
            if (!_.isArray(value) && !_.isArguments(value)) {
                if (!strict)
                    output.push(value);
            } else if (shallow) {
                push.apply(output, value);
            } else {
                flatten(value, shallow, strict, output);
            }
        }
        return output;
    };
    _.flatten = function (array, shallow) {
        return flatten(array, shallow, false, []);
    };
    _.without = function (array) {
        return _.difference(array, slice.call(arguments, 1));
    };
    _.uniq = _.unique = function (array, isSorted, iteratee, context) {
        if (array == null)
            return [];
        if (!_.isBoolean(isSorted)) {
            context = iteratee;
            iteratee = isSorted;
            isSorted = false;
        }
        if (iteratee != null)
            iteratee = _.iteratee(iteratee, context);
        var result = [];
        var seen = [];
        for (var i = 0, length = array.length; i < length; i++) {
            var value = array[i];
            if (isSorted) {
                if (!i || seen !== value)
                    result.push(value);
                seen = value;
            } else if (iteratee) {
                var computed = iteratee(value, i, array);
                if (_.indexOf(seen, computed) < 0) {
                    seen.push(computed);
                    result.push(value);
                }
            } else if (_.indexOf(result, value) < 0) {
                result.push(value);
            }
        }
        return result;
    };
    _.union = function () {
        return _.uniq(flatten(arguments, true, true, []));
    };
    _.intersection = function (array) {
        if (array == null)
            return [];
        var result = [];
        var argsLength = arguments.length;
        for (var i = 0, length = array.length; i < length; i++) {
            var item = array[i];
            if (_.contains(result, item))
                continue;
            for (var j = 1; j < argsLength; j++) {
                if (!_.contains(arguments[j], item))
                    break;
            }
            if (j === argsLength)
                result.push(item);
        }
        return result;
    };
    _.difference = function (array) {
        var rest = flatten(slice.call(arguments, 1), true, true, []);
        return _.filter(array, function (value) {
            return !_.contains(rest, value);
        });
    };
    _.zip = function (array) {
        if (array == null)
            return [];
        var length = _.max(arguments, 'length').length;
        var results = Array(length);
        for (var i = 0; i < length; i++) {
            results[i] = _.pluck(arguments, i);
        }
        return results;
    };
    _.object = function (list, values) {
        if (list == null)
            return {};
        var result = {};
        for (var i = 0, length = list.length; i < length; i++) {
            if (values) {
                result[list[i]] = values[i];
            } else {
                result[list[i][0]] = list[i][1];
            }
        }
        return result;
    };
    _.indexOf = function (array, item, isSorted) {
        if (array == null)
            return -1;
        var i = 0, length = array.length;
        if (isSorted) {
            if (typeof isSorted == 'number') {
                i = isSorted < 0 ? Math.max(0, length + isSorted) : isSorted;
            } else {
                i = _.sortedIndex(array, item);
                return array[i] === item ? i : -1;
            }
        }
        for (; i < length; i++)
            if (array[i] === item)
                return i;
        return -1;
    };
    _.lastIndexOf = function (array, item, from) {
        if (array == null)
            return -1;
        var idx = array.length;
        if (typeof from == 'number') {
            idx = from < 0 ? idx + from + 1 : Math.min(idx, from + 1);
        }
        while (--idx >= 0)
            if (array[idx] === item)
                return idx;
        return -1;
    };
    _.range = function (start, stop, step) {
        if (arguments.length <= 1) {
            stop = start || 0;
            start = 0;
        }
        step = step || 1;
        var length = Math.max(Math.ceil((stop - start) / step), 0);
        var range = Array(length);
        for (var idx = 0; idx < length; idx++, start += step) {
            range[idx] = start;
        }
        return range;
    };
    var Ctor = function () {
    };
    _.bind = function (func, context) {
        var args, bound;
        if (nativeBind && func.bind === nativeBind)
            return nativeBind.apply(func, slice.call(arguments, 1));
        if (!_.isFunction(func))
            throw new TypeError('Bind must be called on a function');
        args = slice.call(arguments, 2);
        bound = function () {
            if (!(this instanceof bound))
                return func.apply(context, args.concat(slice.call(arguments)));
            Ctor.prototype = func.prototype;
            var self = new Ctor();
            Ctor.prototype = null;
            var result = func.apply(self, args.concat(slice.call(arguments)));
            if (_.isObject(result))
                return result;
            return self;
        };
        return bound;
    };
    _.partial = function (func) {
        var boundArgs = slice.call(arguments, 1);
        return function () {
            var position = 0;
            var args = boundArgs.slice();
            for (var i = 0, length = args.length; i < length; i++) {
                if (args[i] === _)
                    args[i] = arguments[position++];
            }
            while (position < arguments.length)
                args.push(arguments[position++]);
            return func.apply(this, args);
        };
    };
    _.bindAll = function (obj) {
        var i, length = arguments.length, key;
        if (length <= 1)
            throw new Error('bindAll must be passed function names');
        for (i = 1; i < length; i++) {
            key = arguments[i];
            obj[key] = _.bind(obj[key], obj);
        }
        return obj;
    };
    _.memoize = function (func, hasher) {
        var memoize = function (key) {
            var cache = memoize.cache;
            var address = hasher ? hasher.apply(this, arguments) : key;
            if (!_.has(cache, address))
                cache[address] = func.apply(this, arguments);
            return cache[address];
        };
        memoize.cache = {};
        return memoize;
    };
    _.delay = function (func, wait) {
        var args = slice.call(arguments, 2);
        return setTimeout(function () {
            return func.apply(null, args);
        }, wait);
    };
    _.defer = function (func) {
        return _.delay.apply(_, [
            func,
            1
        ].concat(slice.call(arguments, 1)));
    };
    _.throttle = function (func, wait, options) {
        var context, args, result;
        var timeout = null;
        var previous = 0;
        if (!options)
            options = {};
        var later = function () {
            previous = options.leading === false ? 0 : _.now();
            timeout = null;
            result = func.apply(context, args);
            if (!timeout)
                context = args = null;
        };
        return function () {
            var now = _.now();
            if (!previous && options.leading === false)
                previous = now;
            var remaining = wait - (now - previous);
            context = this;
            args = arguments;
            if (remaining <= 0 || remaining > wait) {
                clearTimeout(timeout);
                timeout = null;
                previous = now;
                result = func.apply(context, args);
                if (!timeout)
                    context = args = null;
            } else if (!timeout && options.trailing !== false) {
                timeout = setTimeout(later, remaining);
            }
            return result;
        };
    };
    _.debounce = function (func, wait, immediate) {
        var timeout, args, context, timestamp, result;
        var later = function () {
            var last = _.now() - timestamp;
            if (last < wait && last > 0) {
                timeout = setTimeout(later, wait - last);
            } else {
                timeout = null;
                if (!immediate) {
                    result = func.apply(context, args);
                    if (!timeout)
                        context = args = null;
                }
            }
        };
        return function () {
            context = this;
            args = arguments;
            timestamp = _.now();
            var callNow = immediate && !timeout;
            if (!timeout)
                timeout = setTimeout(later, wait);
            if (callNow) {
                result = func.apply(context, args);
                context = args = null;
            }
            return result;
        };
    };
    _.wrap = function (func, wrapper) {
        return _.partial(wrapper, func);
    };
    _.negate = function (predicate) {
        return function () {
            return !predicate.apply(this, arguments);
        };
    };
    _.compose = function () {
        var args = arguments;
        var start = args.length - 1;
        return function () {
            var i = start;
            var result = args[start].apply(this, arguments);
            while (i--)
                result = args[i].call(this, result);
            return result;
        };
    };
    _.after = function (times, func) {
        return function () {
            if (--times < 1) {
                return func.apply(this, arguments);
            }
        };
    };
    _.before = function (times, func) {
        var memo;
        return function () {
            if (--times > 0) {
                memo = func.apply(this, arguments);
            } else {
                func = null;
            }
            return memo;
        };
    };
    _.once = _.partial(_.before, 2);
    _.keys = function (obj) {
        if (!_.isObject(obj))
            return [];
        if (nativeKeys)
            return nativeKeys(obj);
        var keys = [];
        for (var key in obj)
            if (_.has(obj, key))
                keys.push(key);
        return keys;
    };
    _.values = function (obj) {
        var keys = _.keys(obj);
        var length = keys.length;
        var values = Array(length);
        for (var i = 0; i < length; i++) {
            values[i] = obj[keys[i]];
        }
        return values;
    };
    _.pairs = function (obj) {
        var keys = _.keys(obj);
        var length = keys.length;
        var pairs = Array(length);
        for (var i = 0; i < length; i++) {
            pairs[i] = [
                keys[i],
                obj[keys[i]]
            ];
        }
        return pairs;
    };
    _.invert = function (obj) {
        var result = {};
        var keys = _.keys(obj);
        for (var i = 0, length = keys.length; i < length; i++) {
            result[obj[keys[i]]] = keys[i];
        }
        return result;
    };
    _.functions = _.methods = function (obj) {
        var names = [];
        for (var key in obj) {
            if (_.isFunction(obj[key]))
                names.push(key);
        }
        return names.sort();
    };
    _.extend = function (obj) {
        if (!_.isObject(obj))
            return obj;
        var source, prop;
        for (var i = 1, length = arguments.length; i < length; i++) {
            source = arguments[i];
            for (prop in source) {
                if (hasOwnProperty.call(source, prop)) {
                    obj[prop] = source[prop];
                }
            }
        }
        return obj;
    };
    _.pick = function (obj, iteratee, context) {
        var result = {}, key;
        if (obj == null)
            return result;
        if (_.isFunction(iteratee)) {
            iteratee = createCallback(iteratee, context);
            for (key in obj) {
                var value = obj[key];
                if (iteratee(value, key, obj))
                    result[key] = value;
            }
        } else {
            var keys = concat.apply([], slice.call(arguments, 1));
            obj = new Object(obj);
            for (var i = 0, length = keys.length; i < length; i++) {
                key = keys[i];
                if (key in obj)
                    result[key] = obj[key];
            }
        }
        return result;
    };
    _.omit = function (obj, iteratee, context) {
        if (_.isFunction(iteratee)) {
            iteratee = _.negate(iteratee);
        } else {
            var keys = _.map(concat.apply([], slice.call(arguments, 1)), String);
            iteratee = function (value, key) {
                return !_.contains(keys, key);
            };
        }
        return _.pick(obj, iteratee, context);
    };
    _.defaults = function (obj) {
        if (!_.isObject(obj))
            return obj;
        for (var i = 1, length = arguments.length; i < length; i++) {
            var source = arguments[i];
            for (var prop in source) {
                if (obj[prop] === void 0)
                    obj[prop] = source[prop];
            }
        }
        return obj;
    };
    _.clone = function (obj) {
        if (!_.isObject(obj))
            return obj;
        return _.isArray(obj) ? obj.slice() : _.extend({}, obj);
    };
    _.tap = function (obj, interceptor) {
        interceptor(obj);
        return obj;
    };
    var eq = function (a, b, aStack, bStack) {
        if (a === b)
            return a !== 0 || 1 / a === 1 / b;
        if (a == null || b == null)
            return a === b;
        if (a instanceof _)
            a = a._wrapped;
        if (b instanceof _)
            b = b._wrapped;
        var className = toString.call(a);
        if (className !== toString.call(b))
            return false;
        switch (className) {
        case '[object RegExp]':
        case '[object String]':
            return '' + a === '' + b;
        case '[object Number]':
            if (+a !== +a)
                return +b !== +b;
            return +a === 0 ? 1 / +a === 1 / b : +a === +b;
        case '[object Date]':
        case '[object Boolean]':
            return +a === +b;
        }
        if (typeof a != 'object' || typeof b != 'object')
            return false;
        var length = aStack.length;
        while (length--) {
            if (aStack[length] === a)
                return bStack[length] === b;
        }
        var aCtor = a.constructor, bCtor = b.constructor;
        if (aCtor !== bCtor && 'constructor' in a && 'constructor' in b && !(_.isFunction(aCtor) && aCtor instanceof aCtor && _.isFunction(bCtor) && bCtor instanceof bCtor)) {
            return false;
        }
        aStack.push(a);
        bStack.push(b);
        var size, result;
        if (className === '[object Array]') {
            size = a.length;
            result = size === b.length;
            if (result) {
                while (size--) {
                    if (!(result = eq(a[size], b[size], aStack, bStack)))
                        break;
                }
            }
        } else {
            var keys = _.keys(a), key;
            size = keys.length;
            result = _.keys(b).length === size;
            if (result) {
                while (size--) {
                    key = keys[size];
                    if (!(result = _.has(b, key) && eq(a[key], b[key], aStack, bStack)))
                        break;
                }
            }
        }
        aStack.pop();
        bStack.pop();
        return result;
    };
    _.isEqual = function (a, b) {
        return eq(a, b, [], []);
    };
    _.isEmpty = function (obj) {
        if (obj == null)
            return true;
        if (_.isArray(obj) || _.isString(obj) || _.isArguments(obj))
            return obj.length === 0;
        for (var key in obj)
            if (_.has(obj, key))
                return false;
        return true;
    };
    _.isElement = function (obj) {
        return !!(obj && obj.nodeType === 1);
    };
    _.isArray = nativeIsArray || function (obj) {
        return toString.call(obj) === '[object Array]';
    };
    _.isObject = function (obj) {
        var type = typeof obj;
        return type === 'function' || type === 'object' && !!obj;
    };
    _.each([
        'Arguments',
        'Function',
        'String',
        'Number',
        'Date',
        'RegExp'
    ], function (name) {
        _['is' + name] = function (obj) {
            return toString.call(obj) === '[object ' + name + ']';
        };
    });
    if (!_.isArguments(arguments)) {
        _.isArguments = function (obj) {
            return _.has(obj, 'callee');
        };
    }
    if (typeof /./ !== 'function') {
        _.isFunction = function (obj) {
            return typeof obj == 'function' || false;
        };
    }
    _.isFinite = function (obj) {
        return isFinite(obj) && !isNaN(parseFloat(obj));
    };
    _.isNaN = function (obj) {
        return _.isNumber(obj) && obj !== +obj;
    };
    _.isBoolean = function (obj) {
        return obj === true || obj === false || toString.call(obj) === '[object Boolean]';
    };
    _.isNull = function (obj) {
        return obj === null;
    };
    _.isUndefined = function (obj) {
        return obj === void 0;
    };
    _.has = function (obj, key) {
        return obj != null && hasOwnProperty.call(obj, key);
    };
    _.noConflict = function () {
        root._ = previousUnderscore;
        return this;
    };
    _.identity = function (value) {
        return value;
    };
    _.constant = function (value) {
        return function () {
            return value;
        };
    };
    _.noop = function () {
    };
    _.property = function (key) {
        return function (obj) {
            return obj[key];
        };
    };
    _.matches = function (attrs) {
        var pairs = _.pairs(attrs), length = pairs.length;
        return function (obj) {
            if (obj == null)
                return !length;
            obj = new Object(obj);
            for (var i = 0; i < length; i++) {
                var pair = pairs[i], key = pair[0];
                if (pair[1] !== obj[key] || !(key in obj))
                    return false;
            }
            return true;
        };
    };
    _.times = function (n, iteratee, context) {
        var accum = Array(Math.max(0, n));
        iteratee = createCallback(iteratee, context, 1);
        for (var i = 0; i < n; i++)
            accum[i] = iteratee(i);
        return accum;
    };
    _.random = function (min, max) {
        if (max == null) {
            max = min;
            min = 0;
        }
        return min + Math.floor(Math.random() * (max - min + 1));
    };
    _.now = Date.now || function () {
        return new Date().getTime();
    };
    var escapeMap = {
        '&': '&amp;',
        '<': '&lt;',
        '>': '&gt;',
        '"': '&quot;',
        '\'': '&#x27;',
        '`': '&#x60;'
    };
    var unescapeMap = _.invert(escapeMap);
    var createEscaper = function (map) {
        var escaper = function (match) {
            return map[match];
        };
        var source = '(?:' + _.keys(map).join('|') + ')';
        var testRegexp = RegExp(source);
        var replaceRegexp = RegExp(source, 'g');
        return function (string) {
            string = string == null ? '' : '' + string;
            return testRegexp.test(string) ? string.replace(replaceRegexp, escaper) : string;
        };
    };
    _.escape = createEscaper(escapeMap);
    _.unescape = createEscaper(unescapeMap);
    _.result = function (object, property) {
        if (object == null)
            return void 0;
        var value = object[property];
        return _.isFunction(value) ? object[property]() : value;
    };
    var idCounter = 0;
    _.uniqueId = function (prefix) {
        var id = ++idCounter + '';
        return prefix ? prefix + id : id;
    };
    _.templateSettings = {
        evaluate: /<%([\s\S]+?)%>/g,
        interpolate: /<%=([\s\S]+?)%>/g,
        escape: /<%-([\s\S]+?)%>/g
    };
    var noMatch = /(.)^/;
    var escapes = {
        '\'': '\'',
        '\\': '\\',
        '\r': 'r',
        '\n': 'n',
        '\u2028': 'u2028',
        '\u2029': 'u2029'
    };
    var escaper = /\\|'|\r|\n|\u2028|\u2029/g;
    var escapeChar = function (match) {
        return '\\' + escapes[match];
    };
    _.template = function (text, settings, oldSettings) {
        if (!settings && oldSettings)
            settings = oldSettings;
        settings = _.defaults({}, settings, _.templateSettings);
        var matcher = RegExp([
            (settings.escape || noMatch).source,
            (settings.interpolate || noMatch).source,
            (settings.evaluate || noMatch).source
        ].join('|') + '|$', 'g');
        var index = 0;
        var source = '__p+=\'';
        text.replace(matcher, function (match, escape, interpolate, evaluate, offset) {
            source += text.slice(index, offset).replace(escaper, escapeChar);
            index = offset + match.length;
            if (escape) {
                source += '\'+\n((__t=(' + escape + '))==null?\'\':_.escape(__t))+\n\'';
            } else if (interpolate) {
                source += '\'+\n((__t=(' + interpolate + '))==null?\'\':__t)+\n\'';
            } else if (evaluate) {
                source += '\';\n' + evaluate + '\n__p+=\'';
            }
            return match;
        });
        source += '\';\n';
        if (!settings.variable)
            source = 'with(obj||{}){\n' + source + '}\n';
        source = 'var __t,__p=\'\',__j=Array.prototype.join,' + 'print=function(){__p+=__j.call(arguments,\'\');};\n' + source + 'return __p;\n';
        try {
            var render = new Function(settings.variable || 'obj', '_', source);
        } catch (e) {
            e.source = source;
            throw e;
        }
        var template = function (data) {
            return render.call(this, data, _);
        };
        var argument = settings.variable || 'obj';
        template.source = 'function(' + argument + '){\n' + source + '}';
        return template;
    };
    _.chain = function (obj) {
        var instance = _(obj);
        instance._chain = true;
        return instance;
    };
    var result = function (obj) {
        return this._chain ? _(obj).chain() : obj;
    };
    _.mixin = function (obj) {
        _.each(_.functions(obj), function (name) {
            var func = _[name] = obj[name];
            _.prototype[name] = function () {
                var args = [this._wrapped];
                push.apply(args, arguments);
                return result.call(this, func.apply(_, args));
            };
        });
    };
    _.mixin(_);
    _.each([
        'pop',
        'push',
        'reverse',
        'shift',
        'sort',
        'splice',
        'unshift'
    ], function (name) {
        var method = ArrayProto[name];
        _.prototype[name] = function () {
            var obj = this._wrapped;
            method.apply(obj, arguments);
            if ((name === 'shift' || name === 'splice') && obj.length === 0)
                delete obj[0];
            return result.call(this, obj);
        };
    });
    _.each([
        'concat',
        'join',
        'slice'
    ], function (name) {
        var method = ArrayProto[name];
        _.prototype[name] = function () {
            return result.call(this, method.apply(this._wrapped, arguments));
        };
    });
    _.prototype.value = function () {
        return this._wrapped;
    };
    if (typeof define === 'function' && define.amd) {
        define('underscore', [], function () {
            return _;
        });
    }
}.call(this));
define('Events', ['underscore'], function (_) {
    'use strict';
    var slice = Array.prototype.slice, eventSplitter = /\s+/;
    var Events = {
        on: function (events, callback, context) {
            var calls, event, node, tail, list;
            if (!callback) {
                return this;
            }
            events = events.split(eventSplitter);
            calls = this._callbacks || (this._callbacks = {});
            while (!!(event = events.shift())) {
                list = calls[event];
                node = list ? list.tail : {};
                node.next = tail = {};
                node.context = context;
                node.callback = callback;
                calls[event] = {
                    tail: tail,
                    next: list ? list.next : node
                };
            }
            return this;
        },
        off: function (events, callback, context) {
            var event, calls, node, tail, cb, ctx;
            if (!(calls = this._callbacks)) {
                return;
            }
            if (!(events || callback || context)) {
                delete this._callbacks;
                return this;
            }
            events = events ? events.split(eventSplitter) : _.keys(calls);
            while (!!(event = events.shift())) {
                node = calls[event];
                delete calls[event];
                if (!node || !(callback || context)) {
                    continue;
                }
                tail = node.tail;
                while ((node = node.next) !== tail) {
                    cb = node.callback;
                    ctx = node.context;
                    if (callback && cb !== callback || context && ctx !== context) {
                        this.on(event, cb, ctx);
                    }
                }
            }
            return this;
        },
        trigger: function (events) {
            var event, node, calls, tail, args, all, rest;
            if (!(calls = this._callbacks)) {
                return this;
            }
            all = calls.all;
            events = events.split(eventSplitter);
            rest = slice.call(arguments, 1);
            while (!!(event = events.shift())) {
                if (!!(node = calls[event])) {
                    tail = node.tail;
                    while ((node = node.next) !== tail) {
                        node.callback.apply(node.context || this, rest);
                    }
                }
                if (!!(node = all)) {
                    tail = node.tail;
                    args = [event].concat(rest);
                    while ((node = node.next) !== tail) {
                        node.callback.apply(node.context || this, args);
                    }
                }
            }
            return this;
        }
    };
    Events.bind = Events.on;
    Events.unbind = Events.off;
    return Events;
});
define('Configuration', function () {
    'use strict';
    SC.Configuration = {
        cache: { siteSettings: 2 * 60 * 60 },
        filter_site: 'current',
        order_checkout_field_keys: {
            'items': [
                'amount',
                'promotionamount',
                'promotiondiscount',
                'orderitemid',
                'quantity',
                'minimumquantity',
                'onlinecustomerprice_detail',
                'internalid',
                'rate',
                'rate_formatted',
                'options',
                'itemtype',
                'itemid'
            ],
            'giftcertificates': null,
            'shipaddress': null,
            'billaddress': null,
            'payment': null,
            'summary': null,
            'promocodes': null,
            'shipmethod': null,
            'shipmethods': null,
            'agreetermcondition': null,
            'purchasenumber': null
        },
        order_shopping_field_keys: {
            'items': [
                'amount',
                'promotionamount',
                'promotiondiscount',
                'orderitemid',
                'quantity',
                'minimumquantity',
                'onlinecustomerprice_detail',
                'internalid',
                'options',
                'itemtype',
                'rate',
                'rate_formatted'
            ],
            'shipaddress': null,
            'summary': null,
            'promocodes': null
        },
        items_fields_advanced_name: 'order',
        items_fields_standard_keys: [
            'canonicalurl',
            'displayname',
            'internalid',
            'itemid',
            'itemoptions_detail',
            'itemtype',
            'minimumquantity',
            'onlinecustomerprice_detail',
            'pricelevel1',
            'pricelevel1_formatted',
            'isinstock',
            'ispurchasable',
            'isbackorderable',
            'outofstockmessage',
            'stockdescription',
            'showoutofstockmessage',
            'storedisplayimage',
            'storedisplayname2',
            'storedisplaythumbnail',
            'isfulfillable'
        ],
        product_reviews: {
            maxFlagsCount: 2,
            loginRequired: false,
            flaggedStatus: 4,
            approvedStatus: '2',
            pendingApprovalStatus: 1,
            resultsPerPage: 25
        },
        product_lists: {
            additionEnabled: true,
            loginRequired: true,
            list_templates: [
                {
                    templateid: '1',
                    name: 'My list',
                    description: 'An example predefined list',
                    scope: {
                        id: '2',
                        name: 'private'
                    }
                },
                {
                    templateid: '2',
                    name: 'Saved for Later',
                    description: 'This is for the cart saved for later items',
                    scope: {
                        id: '2',
                        name: 'private'
                    },
                    type: {
                        id: '2',
                        name: 'later'
                    }
                }
            ]
        },
        cases: {
            default_values: {
                status_start: {
                    id: '1',
                    name: 'Not Started'
                },
                status_close: {
                    id: '5',
                    name: 'Closed'
                },
                origin: {
                    id: '-5',
                    name: 'Web'
                }
            }
        },
        quote: { days_to_expire: 7 },
        returnAuthorizations: { cancelUrlRoot: 'https://system.netsuite.com' },
        results_per_page: 20,
        checkout_skip_login: false,
        hosts: [],
        publish: [],
        isMultiShippingEnabled: false,
        useCMS: true
    };
    return SC.Configuration;
});
define('Console', ['underscore'], function (_) {
    'use strict';
    if (typeof console === 'undefined') {
        console = {};
    }
    var console_methods = 'assert clear count debug dir dirxml exception group groupCollapsed groupEnd info log profile profileEnd table time timeEnd trace warn'.split(' '), idx = console_methods.length, noop = function () {
        };
    while (--idx >= 0) {
        var method = console_methods[idx];
        if (typeof console[method] === 'undefined') {
            console[method] = noop;
        }
    }
    if (typeof console.memory === 'undefined') {
        console.memory = {};
    }
    _.each({
        'log': 'DEBUG',
        'info': 'AUDIT',
        'error': 'EMERGENCY',
        'warn': 'ERROR'
    }, function (value, key) {
        console[key] = function () {
            nlapiLogExecution(value, arguments.length > 1 ? arguments[0] : '', arguments.length > 1 ? arguments[1] : arguments[0] || 'null');
        };
    });
    _.extend(console, {
        timeEntries: [],
        time: function (text) {
            if (typeof text === 'string') {
                console.timeEntries[text] = Date.now();
            }
        },
        timeEnd: function (text) {
            if (typeof text === 'string') {
                if (!arguments.length) {
                    console.warn('TypeError:', 'Not enough arguments');
                } else {
                    if (typeof console.timeEntries[text] !== 'undefined') {
                        console.log(text + ':', Date.now() - console.timeEntries[text] + 'ms');
                        delete console.timeEntries[text];
                    }
                }
            }
        }
    });
    return console;
});
var unauthorizedError = {
    status: 401,
    code: 'ERR_USER_NOT_LOGGED_IN',
    message: 'Not logged In'
};
var forbiddenError = {
    status: 403,
    code: 'ERR_INSUFFICIENT_PERMISSIONS',
    message: 'Insufficient permissions'
};
var notFoundError = {
    status: 404,
    code: 'ERR_RECORD_NOT_FOUND',
    message: 'Not found'
};
var methodNotAllowedError = {
    status: 405,
    code: 'ERR_METHOD_NOT_ALLOWED',
    message: 'Sorry, you are not allowed to perform this action.'
};
var invalidItemsFieldsAdvancedName = {
    status: 500,
    code: 'ERR_INVALID_ITEMS_FIELDS_ADVANCED_NAME',
    message: 'Please check if the fieldset is created.'
};
var SC = {};
define('Application.Backend', [
    'underscore',
    'Events',
    'Configuration',
    'Console'
], function ApplicationFn(_, Events) {
    'use strict';
    var Application = _.extend({
        init: function init() {
        },
        getPermissions: function getPermissions() {
            var context = nlapiGetContext();
            return {
                transactions: {
                    tranCashSale: context.getPermission('TRAN_CASHSALE'),
                    tranCustCred: context.getPermission('TRAN_CUSTCRED'),
                    tranCustDep: context.getPermission('TRAN_CUSTDEP'),
                    tranCustPymt: context.getPermission('TRAN_CUSTPYMT'),
                    tranStatement: context.getPermission('TRAN_STATEMENT'),
                    tranCustInvc: context.getPermission('TRAN_CUSTINVC'),
                    tranItemShip: context.getPermission('TRAN_ITEMSHIP'),
                    tranSalesOrd: context.getPermission('TRAN_SALESORD'),
                    tranEstimate: context.getPermission('TRAN_ESTIMATE'),
                    tranRtnAuth: context.getPermission('TRAN_RTNAUTH'),
                    tranDepAppl: context.getPermission('TRAN_DEPAPPL'),
                    tranSalesOrdFulfill: context.getPermission('TRAN_SALESORDFULFILL'),
                    tranFind: context.getPermission('TRAN_FIND')
                },
                lists: {
                    regtAcctRec: context.getPermission('REGT_ACCTREC'),
                    regtNonPosting: context.getPermission('REGT_NONPOSTING'),
                    listCase: context.getPermission('LIST_CASE'),
                    listContact: context.getPermission('LIST_CONTACT'),
                    listCustJob: context.getPermission('LIST_CUSTJOB'),
                    listCompany: context.getPermission('LIST_COMPANY'),
                    listIssue: context.getPermission('LIST_ISSUE'),
                    listCustProfile: context.getPermission('LIST_CUSTPROFILE'),
                    listExport: context.getPermission('LIST_EXPORT'),
                    listFind: context.getPermission('LIST_FIND'),
                    listCrmMessage: context.getPermission('LIST_CRMMESSAGE')
                }
            };
        },
        sendContent: function sendContent(content, options) {
            var theOptions = _.extend({
                status: 200,
                cache: false
            }, options || {});
            var contentType = false;
            var responseContent;
            Application.trigger('before:Application.sendContent', content, theOptions);
            response.setHeader('Custom-Header-Status', parseInt(theOptions.status, 10).toString());
            if (_.isArray(content) || _.isObject(content)) {
                contentType = 'JSON';
                responseContent = JSON.stringify(content);
            }
            if (request.getParameter('jsonp_callback')) {
                contentType = 'JAVASCRIPT';
                responseContent = request.getParameter('jsonp_callback') + '(' + content + ');';
            }
            if (theOptions.cache) {
                response.setCDNCacheable(theOptions.cache);
            }
            contentType && response.setContentType(contentType);
            response.write(responseContent);
            Application.trigger('after:Application.sendContent', responseContent, theOptions);
        },
        processError: function processError(e) {
            var status = 500;
            var code = 'ERR_UNEXPECTED';
            var message = 'error';
            var error;
            var content;
            if (e instanceof nlobjError) {
                code = e.getCode();
                message = e.getDetails();
            } else if (_.isObject(e) && !_.isUndefined(e.status)) {
                status = e.status;
                code = e.code;
                message = e.message;
            } else {
                error = nlapiCreateError(e);
                code = error.getCode();
                message = error.getDetails() !== '' ? error.getDetails() : error.getCode();
            }
            if (status === 500 && code === 'INSUFFICIENT_PERMISSION') {
                status = forbiddenError.status;
                code = forbiddenError.code;
                message = forbiddenError.message;
            }
            content = {
                errorStatusCode: parseInt(status, 10).toString(),
                errorCode: code,
                errorMessage: message
            };
            if (e.errorDetails) {
                content.errorDetails = e.errorDetails;
            }
            return content;
        },
        sendError: function sendError(e) {
            var content;
            var contentType;
            Application.trigger('before:Application.sendError', e);
            content = Application.processError(e);
            contentType = 'JSON';
            response.setHeader('Custom-Header-Status', content.errorStatusCode);
            if (request.getParameter('jsonp_callback')) {
                contentType = 'JAVASCRIPT';
                content = request.getParameter('jsonp_callback') + '(' + JSON.stringify(content) + ');';
            } else {
                content = JSON.stringify(content);
            }
            response.setContentType(contentType);
            response.write(content);
            Application.trigger('after:Application.sendError', e);
        },
        getPaginatedSearchResults: function getPaginatedSearchResults(options) {
            var theOptions = options || {};
            var resultsPerPage = theOptions.results_per_page || SC.Configuration.results_per_page;
            var page = theOptions.page || 1;
            var columns = theOptions.columns || [];
            var filters = theOptions.filters || [];
            var recordType = theOptions.record_type;
            var rangeStart = page * resultsPerPage - resultsPerPage;
            var rangeEnd = page * resultsPerPage;
            var doRealCount = _.any(columns, function anyColumn(column) {
                return column.getSummary();
            });
            var result = {
                page: page,
                recordsPerPage: resultsPerPage,
                records: []
            };
            var columnCount;
            var countResult;
            var search;
            if (!doRealCount || theOptions.column_count) {
                columnCount = theOptions.column_count || new nlobjSearchColumn('internalid', null, 'count');
                countResult = nlapiSearchRecord(recordType, null, filters, [columnCount]);
                result.totalRecordsFound = parseInt(countResult[0].getValue(columnCount), 10);
            }
            if (doRealCount || result.totalRecordsFound > 0 && result.totalRecordsFound > rangeStart) {
                search = nlapiCreateSearch(recordType, filters, columns).runSearch();
                result.records = search.getResults(rangeStart, rangeEnd);
                if (doRealCount && !theOptions.column_count) {
                    result.totalRecordsFound = search.getResults(0, 1000).length;
                }
            }
            return result;
        },
        getAllSearchResults: function getAllSearchResults(recordType, filters, columns) {
            var search = nlapiCreateSearch(recordType, filters, columns);
            var searchRan = search.runSearch();
            var bolStop = false;
            var intMaxReg = 1000;
            var intMinReg = 0;
            var result = [];
            var context = nlapiGetContext();
            var extras;
            search.setIsPublic(true);
            searchRan = search.runSearch();
            while (!bolStop && context.getRemainingUsage() > 10) {
                extras = searchRan.getResults(intMinReg, intMaxReg);
                result = Application.searchUnion(result, extras);
                intMinReg = intMaxReg;
                intMaxReg += 1000;
                if (extras.length < 1000) {
                    bolStop = true;
                }
            }
            return result;
        },
        searchUnion: function searchUnion(target, array) {
            return target.concat(array);
        }
    }, Events);
    return Application;
});
define('Backbone.Validation', [], function () {
    var Backbone = {};
    Backbone.Validation = function (_) {
        'use strict';
        var defaultOptions = {
            forceUpdate: false,
            selector: 'name',
            labelFormatter: 'sentenceCase',
            valid: Function.prototype,
            invalid: Function.prototype
        };
        var formatFunctions = {
            formatLabel: function (attrName, model) {
                return defaultLabelFormatters[defaultOptions.labelFormatter](attrName, model);
            },
            format: function () {
                var args = Array.prototype.slice.call(arguments), text = args.shift();
                return text.replace(/\{(\d+)\}/g, function (match, number) {
                    return typeof args[number] !== 'undefined' ? args[number] : match;
                });
            }
        };
        var flatten = function (obj, into, prefix) {
            into = into || {};
            prefix = prefix || '';
            _.each(obj, function (val, key) {
                if (obj.hasOwnProperty(key)) {
                    if (val && typeof val === 'object' && !(val instanceof Date || val instanceof RegExp)) {
                        flatten(val, into, prefix + key + '.');
                    } else {
                        into[prefix + key] = val;
                    }
                }
            });
            return into;
        };
        var Validation = function () {
            var getValidatedAttrs = function (model) {
                return _.reduce(_.keys(model.validation || {}), function (memo, key) {
                    memo[key] = void 0;
                    return memo;
                }, {});
            };
            var getValidators = function (model, attr) {
                var attrValidationSet = model.validation ? model.validation[attr] || {} : {};
                if (_.isFunction(attrValidationSet) || _.isString(attrValidationSet)) {
                    attrValidationSet = { fn: attrValidationSet };
                }
                if (!_.isArray(attrValidationSet)) {
                    attrValidationSet = [attrValidationSet];
                }
                return _.reduce(attrValidationSet, function (memo, attrValidation) {
                    _.each(_.without(_.keys(attrValidation), 'msg'), function (validator) {
                        memo.push({
                            fn: defaultValidators[validator],
                            val: attrValidation[validator],
                            msg: attrValidation.msg
                        });
                    });
                    return memo;
                }, []);
            };
            var validateAttr = function (model, attr, value, computed) {
                return _.reduce(getValidators(model, attr), function (memo, validator) {
                    var ctx = _.extend({}, formatFunctions, defaultValidators), result = validator.fn.call(ctx, value, attr, validator.val, model, computed);
                    if (result === false || memo === false) {
                        return false;
                    }
                    if (result && !memo) {
                        return validator.msg || result;
                    }
                    return memo;
                }, '');
            };
            var validateModel = function (model, attrs) {
                var error, invalidAttrs = {}, isValid = true, computed = _.clone(attrs), flattened = flatten(attrs);
                _.each(flattened, function (val, attr) {
                    error = validateAttr(model, attr, val, computed);
                    if (error) {
                        invalidAttrs[attr] = error;
                        isValid = false;
                    }
                });
                return {
                    invalidAttrs: invalidAttrs,
                    isValid: isValid
                };
            };
            var mixin = function (view, options) {
                return {
                    preValidate: function (attr, value) {
                        return validateAttr(this, attr, value, _.extend({}, this.attributes));
                    },
                    isValid: function (option) {
                        var flattened = flatten(this.attributes);
                        if (_.isString(option)) {
                            return !validateAttr(this, option, flattened[option], _.extend({}, this.attributes));
                        }
                        if (_.isArray(option)) {
                            return _.reduce(option, function (memo, attr) {
                                return memo && !validateAttr(this, attr, flattened[attr], _.extend({}, this.attributes));
                            }, true, this);
                        }
                        if (option === true) {
                            this.validate();
                        }
                        return this.validation ? this._isValid : true;
                    },
                    validate: function (attrs, setOptions) {
                        var model = this, validateAll = !attrs, opt = _.extend({}, options, setOptions), validatedAttrs = getValidatedAttrs(model), allAttrs = _.extend({}, validatedAttrs, model.attributes, attrs), changedAttrs = flatten(attrs || allAttrs), result = validateModel(model, allAttrs);
                        model._isValid = result.isValid;
                        _.each(validatedAttrs, function (val, attr) {
                            var invalid = result.invalidAttrs.hasOwnProperty(attr);
                            if (!invalid) {
                                opt.valid(view, attr, opt.selector);
                            }
                        });
                        _.each(validatedAttrs, function (val, attr) {
                            var invalid = result.invalidAttrs.hasOwnProperty(attr), changed = changedAttrs.hasOwnProperty(attr);
                            if (invalid && (changed || validateAll)) {
                                opt.invalid(view, attr, result.invalidAttrs[attr], opt.selector);
                            }
                        });
                        if (!opt.forceUpdate && _.intersection(_.keys(result.invalidAttrs), _.keys(changedAttrs)).length > 0) {
                            return result.invalidAttrs;
                        }
                    }
                };
            };
            var bindModel = function (view, model, options) {
                _.extend(model, mixin(view, options));
            };
            var unbindModel = function (model) {
                delete model.validate;
                delete model.preValidate;
                delete model.isValid;
            };
            var collectionAdd = function (model) {
                bindModel(this.view, model, this.options);
            };
            var collectionRemove = function (model) {
                unbindModel(model);
            };
            return {
                version: '0.8.0',
                configure: function (options) {
                    _.extend(defaultOptions, options);
                },
                bind: function (view, options) {
                    var model = view.model, collection = view.collection;
                    options = _.extend({}, defaultOptions, defaultCallbacks, options);
                    if (typeof model === 'undefined' && typeof collection === 'undefined') {
                        throw 'Before you execute the binding your view must have a model or a collection.\n' + 'See http://thedersen.com/projects/backbone-validation/#using-form-model-validation for more information.';
                    }
                    if (model) {
                        bindModel(view, model, options);
                    } else if (collection) {
                        collection.each(function (model) {
                            bindModel(view, model, options);
                        });
                        collection.bind('add', collectionAdd, {
                            view: view,
                            options: options
                        });
                        collection.bind('remove', collectionRemove);
                    }
                },
                unbind: function (view) {
                    var model = view.model, collection = view.collection;
                    if (model) {
                        unbindModel(view.model);
                    }
                    if (collection) {
                        collection.each(function (model) {
                            unbindModel(model);
                        });
                        collection.unbind('add', collectionAdd);
                        collection.unbind('remove', collectionRemove);
                    }
                },
                mixin: mixin(null, defaultOptions)
            };
        }();
        var defaultCallbacks = Validation.callbacks = {
            valid: function (view, attr, selector) {
                view.$('[' + selector + '~="' + attr + '"]').removeClass('invalid').removeAttr('data-error');
            },
            invalid: function (view, attr, error, selector) {
                view.$('[' + selector + '~="' + attr + '"]').addClass('invalid').attr('data-error', error);
            }
        };
        var defaultPatterns = Validation.patterns = {
            digits: /^\d+$/,
            number: /^-?(?:\d+|\d{1,3}(?:,\d{3})+)(?:\.\d+)?$/,
            email: /^((([a-z]|\d|[!#\$%&'\*\+\-\/=\?\^_`{\|}~]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])+(\.([a-z]|\d|[!#\$%&'\*\+\-\/=\?\^_`{\|}~]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])+)*)|((\x22)((((\x20|\x09)*(\x0d\x0a))?(\x20|\x09)+)?(([\x01-\x08\x0b\x0c\x0e-\x1f\x7f]|\x21|[\x23-\x5b]|[\x5d-\x7e]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(\\([\x01-\x09\x0b\x0c\x0d-\x7f]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]))))*(((\x20|\x09)*(\x0d\x0a))?(\x20|\x09)+)?(\x22)))@((([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])*([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])))\.)+(([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])*([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])))$/i,
            url: /^(https?|ftp):\/\/(((([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(%[\da-f]{2})|[!\$&'\(\)\*\+,;=]|:)*@)?(((\d|[1-9]\d|1\d\d|2[0-4]\d|25[0-5])\.(\d|[1-9]\d|1\d\d|2[0-4]\d|25[0-5])\.(\d|[1-9]\d|1\d\d|2[0-4]\d|25[0-5])\.(\d|[1-9]\d|1\d\d|2[0-4]\d|25[0-5]))|((([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])*([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])))\.)+(([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])*([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])))\.?)(:\d*)?)(\/((([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(%[\da-f]{2})|[!\$&'\(\)\*\+,;=]|:|@)+(\/(([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(%[\da-f]{2})|[!\$&'\(\)\*\+,;=]|:|@)*)*)?)?(\?((([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(%[\da-f]{2})|[!\$&'\(\)\*\+,;=]|:|@)|[\uE000-\uF8FF]|\/|\?)*)?(\#((([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(%[\da-f]{2})|[!\$&'\(\)\*\+,;=]|:|@)|\/|\?)*)?$/i
        };
        var defaultMessages = Validation.messages = {
            required: '{0} is required',
            acceptance: '{0} must be accepted',
            min: '{0} must be greater than or equal to {1}',
            max: '{0} must be less than or equal to {1}',
            range: '{0} must be between {1} and {2}',
            length: '{0} must be {1} characters',
            minLength: '{0} must be at least {1} characters',
            maxLength: '{0} must be at most {1} characters',
            rangeLength: '{0} must be between {1} and {2} characters',
            oneOf: '{0} must be one of: {1}',
            equalTo: '{0} must be the same as {1}',
            pattern: '{0} must be a valid {1}'
        };
        var defaultLabelFormatters = Validation.labelFormatters = {
            none: function (attrName) {
                return attrName;
            },
            sentenceCase: function (attrName) {
                return attrName.replace(/(?:^\w|[A-Z]|\b\w)/g, function (match, index) {
                    return index === 0 ? match.toUpperCase() : ' ' + match.toLowerCase();
                }).replace('_', ' ');
            },
            label: function (attrName, model) {
                return model.labels && model.labels[attrName] || defaultLabelFormatters.sentenceCase(attrName, model);
            }
        };
        var defaultValidators = Validation.validators = function () {
            var trim = String.prototype.trim ? function (text) {
                return text === null ? '' : String.prototype.trim.call(text);
            } : function (text) {
                var trimLeft = /^\s+/, trimRight = /\s+$/;
                return text === null ? '' : text.toString().replace(trimLeft, '').replace(trimRight, '');
            };
            var isNumber = function (value) {
                return _.isNumber(value) || _.isString(value) && value.match(defaultPatterns.number);
            };
            var hasValue = function (value) {
                return !(_.isNull(value) || _.isUndefined(value) || _.isString(value) && trim(value) === '');
            };
            return {
                fn: function (value, attr, fn, model, computed) {
                    if (_.isString(fn)) {
                        fn = model[fn];
                    }
                    return fn.call(model, value, attr, computed);
                },
                required: function (value, attr, required, model, computed) {
                    var isRequired = _.isFunction(required) ? required.call(model, value, attr, computed) : required;
                    if (!isRequired && !hasValue(value)) {
                        return false;
                    }
                    if (isRequired && !hasValue(value)) {
                        return this.format(defaultMessages.required, this.formatLabel(attr, model));
                    }
                },
                acceptance: function (value, attr, accept, model) {
                    if (value !== 'true' && (!_.isBoolean(value) || value === false)) {
                        return this.format(defaultMessages.acceptance, this.formatLabel(attr, model));
                    }
                },
                min: function (value, attr, minValue, model) {
                    if (!isNumber(value) || value < minValue) {
                        return this.format(defaultMessages.min, this.formatLabel(attr, model), minValue);
                    }
                },
                max: function (value, attr, maxValue, model) {
                    if (!isNumber(value) || value > maxValue) {
                        return this.format(defaultMessages.max, this.formatLabel(attr, model), maxValue);
                    }
                },
                range: function (value, attr, range, model) {
                    if (!isNumber(value) || value < range[0] || value > range[1]) {
                        return this.format(defaultMessages.range, this.formatLabel(attr, model), range[0], range[1]);
                    }
                },
                length: function (value, attr, length, model) {
                    if (!hasValue(value) || trim(value).length !== length) {
                        return this.format(defaultMessages.length, this.formatLabel(attr, model), length);
                    }
                },
                minLength: function (value, attr, minLength, model) {
                    if (!hasValue(value) || trim(value).length < minLength) {
                        return this.format(defaultMessages.minLength, this.formatLabel(attr, model), minLength);
                    }
                },
                maxLength: function (value, attr, maxLength, model) {
                    if (!hasValue(value) || trim(value).length > maxLength) {
                        return this.format(defaultMessages.maxLength, this.formatLabel(attr, model), maxLength);
                    }
                },
                rangeLength: function (value, attr, range, model) {
                    if (!hasValue(value) || trim(value).length < range[0] || trim(value).length > range[1]) {
                        return this.format(defaultMessages.rangeLength, this.formatLabel(attr, model), range[0], range[1]);
                    }
                },
                oneOf: function (value, attr, values, model) {
                    if (!_.include(values, value)) {
                        return this.format(defaultMessages.oneOf, this.formatLabel(attr, model), values.join(', '));
                    }
                },
                equalTo: function (value, attr, equalTo, model, computed) {
                    if (value !== computed[equalTo]) {
                        return this.format(defaultMessages.equalTo, this.formatLabel(attr, model), this.formatLabel(equalTo, model));
                    }
                },
                pattern: function (value, attr, pattern, model) {
                    if (!hasValue(value) || !value.toString().match(defaultPatterns[pattern] || pattern)) {
                        return this.format(defaultMessages.pattern, this.formatLabel(attr, model), pattern);
                    }
                }
            };
        }();
        return Validation;
    }(_);
    return Backbone.Validation;
});
define('SC.Model', [
    'Application',
    'Backbone.Validation',
    'underscore'
], function (Application, BackboneValidation, _) {
    'use strict';
    var SCModel = {
        extend: function (model) {
            if (!model.name && !this.name) {
                throw {
                    status: 400,
                    code: 'ERR_MISSING_MODEL_NAME',
                    message: 'Missing model name.'
                };
            }
            var new_model = {};
            _.extend(new_model, this, model);
            new_model.wrapped = new_model.wrapped || {};
            _.each(new_model, function (value, key) {
                if (typeof value === 'function' && key !== 'extend') {
                    new_model[key] = wrapFunctionWithEvents(new_model.name + '.' + key, new_model, value);
                }
            });
            wrapValidation(new_model);
            return new_model;
        }
    };
    function wrapFunctionWithEvents(methodName, model, fn) {
        if (model.wrapped[methodName]) {
            return model[methodName];
        } else {
            var wrappedMethod = _.wrap(fn, function (func) {
                var args = _.toArray(arguments).slice(1);
                Application.trigger.apply(Application, [
                    'before:' + methodName,
                    model
                ].concat(args));
                var result = func.apply(model, args);
                Application.trigger.apply(Application, [
                    'after:' + methodName,
                    model,
                    result
                ].concat(args));
                return result;
            });
            model.wrapped[methodName] = true;
            return wrappedMethod;
        }
    }
    function wrapValidation(model) {
        if (!model.validate) {
            model.validate = wrapFunctionWithEvents(model.name + '.validate', model, function (data) {
                if (this.validation) {
                    var validator = _.extend({
                            validation: this.validation,
                            attributes: data
                        }, BackboneValidation.mixin), invalidAttributes = validator.validate();
                    if (!validator.isValid()) {
                        throw {
                            status: 400,
                            code: 'ERR_BAD_REQUEST',
                            message: invalidAttributes
                        };
                    }
                }
            });
        }
    }
    return SCModel;
});
define('SearchHelper', ['underscore'], function SearchHelperDefine(_) {
    'use strict';
    var SearchHelper = function SearchHelper(record, filters, columns, fieldset, resultsPerPage, page, sort, sortOrder) {
        this.setRecord(record);
        this.setFilters(filters);
        this.setColumns(columns);
        this.setFieldset(fieldset);
        this.setResultsPerPage(resultsPerPage);
        this.setPage(page);
        this.setSort(sort);
        this.setSortOrder(sortOrder);
    };
    SearchHelper.prototype.setSort = function setSort(sort) {
        this._sortField = sort;
        return this;
    };
    SearchHelper.prototype.setSortOrder = function setSortOrder(sortOrder) {
        this._sortOrder = sortOrder;
        return this;
    };
    SearchHelper.prototype.setResultsPerPage = function setResultsPerPage(resultsPerPage) {
        this.resultsPerPage = resultsPerPage;
        return this;
    };
    SearchHelper.prototype.setPage = function setPage(page) {
        this.page = page;
        return this;
    };
    SearchHelper.prototype.setFieldset = function setFieldset(fieldset) {
        this._fieldset = _.clone(fieldset);
        return this;
    };
    SearchHelper.prototype.setColumns = function setColumns(value) {
        this._columns = _.clone(value);
        return this;
    };
    SearchHelper.prototype.setFilters = function setFilters(value) {
        this._filters = _.clone(value);
        return this;
    };
    SearchHelper.prototype.addFilter = function addFilter(value) {
        this._filters = this._filters || [];
        this._filters.push(value);
        return this;
    };
    SearchHelper.prototype.addColumn = function addColumn(value) {
        this._columns = this._columns || [];
        this._columns.push(value);
        return this;
    };
    SearchHelper.prototype.setRecord = function setRecord(value) {
        this._record = value;
        return this;
    };
    SearchHelper.prototype.getResult = function getResult() {
        return this._lastResult && this._lastResult.length === 1 && this._lastResult[0];
    };
    SearchHelper.prototype.getResults = function getResults() {
        return this._lastResult;
    };
    SearchHelper.prototype.getResultsForListHeader = function getResultsForListHeader() {
        return {
            page: this.page,
            recordsPerPage: this.resultsPerPage,
            records: this._lastResult,
            totalRecordsFound: this.totalRecordsFound,
            order: this._sortOrder === 'desc' ? -1 : 1,
            sort: this._sortField
        };
    };
    SearchHelper.prototype.getColumns = function getColumns() {
        var self = this;
        return _.compact(_.map(this._columns, function mapColumn(v, k) {
            var column;
            if (self._fieldset && !_.contains(self._fieldset, k)) {
                return null;
            }
            column = new nlobjSearchColumn(v.fieldName, v.joinKey ? v.joinKey : null, v.summary ? v.summary : null);
            if (v.sort || self._sortField === k) {
                if (v.sort) {
                    column.setSort(v.sort === 'desc');
                } else if (self._sortField === k) {
                    column.setSort(self._sortOrder === 'desc');
                }
            }
            if (v.formula) {
                column.setFormula(v.formula);
            }
            return column;
        }));
    };
    SearchHelper.prototype._mapResult = function _mapResult(list) {
        var self = this;
        var props = _.clone(this._columns);
        return list && list.length && _.map(list, function mapResult(line) {
            return _.reduce(props, function reduce(o, v, k) {
                if (self._fieldset && !_.contains(self._fieldset, k)) {
                    return o;
                }
                switch (v.type) {
                case 'listrecordToObject':
                case 'file':
                case 'object':
                    o[k] = {
                        internalid: line.getValue(v.fieldName, v.joinKey ? v.joinKey : null, v.summary ? v.summary : null),
                        name: line.getText(v.fieldName, v.joinKey ? v.joinKey : null, v.summary ? v.summary : null)
                    };
                    break;
                case 'getText':
                case 'text':
                    o[k] = line.getText(v.fieldName, v.joinKey ? v.joinKey : null, v.summary ? v.summary : null);
                    break;
                default:
                    o[k] = line.getValue(v.fieldName, v.joinKey ? v.joinKey : null, v.summary ? v.summary : null);
                    break;
                }
                if (v.applyFunction) {
                    o[k] = v.applyFunction(line, v, k);
                }
                return o;
            }, {});
        }) || [];
    };
    SearchHelper.prototype.getFilters = function getFilters() {
        return _.map(this._filters || [], function mapFilters(f) {
            var filter = new nlobjSearchFilter(f.fieldName, f.joinKey ? f.joinKey : null, f.operator, f.value1 ? f.value1 : null, f.value2 ? f.value2 : null);
            if (f.summary) {
                filter.setSummaryType(f.summary);
            }
            return filter;
        }) || [];
    };
    SearchHelper.prototype.searchRange = function searchRange(from, to) {
        var search = nlapiCreateSearch(this._record, this.getFilters(), this.getColumns());
        var results = search.runSearch();
        this._lastResult = this._mapResult(results.getResults(from, to));
        return this;
    };
    SearchHelper.prototype.search = function search() {
        var columns = this.getColumns();
        var filters = this.getFilters();
        var results;
        if (!this.resultsPerPage) {
            this._lastResult = this._mapResult(this._getAllSearchResults(this._record, filters, columns));
        } else {
            this.page = this.page || 1;
            results = this._getPaginatedSearchResults(this._record, filters, columns, this.resultsPerPage, this.page);
            this._lastResult = this._mapResult(results.records);
            this.totalRecordsFound = results.totalRecordsFound;
        }
        return this;
    };
    SearchHelper.prototype._searchUnion = function _searchUnion(target, array) {
        return target.concat(array);
    };
    SearchHelper.prototype._getPaginatedSearchResults = function _getPaginatedSearchResults(recordType, filters, columns, resultsPerPage, page, columnCount) {
        var rangeStart = page * resultsPerPage - resultsPerPage;
        var rangeEnd = page * resultsPerPage;
        var doRealCount = _.any(columns, function doRealCount(column) {
            return column.getSummary();
        });
        var result = {
            page: page,
            recordsPerPage: resultsPerPage,
            records: []
        };
        var _columnCount;
        var countResult;
        var search;
        if (!doRealCount || columnCount) {
            _columnCount = columnCount || new nlobjSearchColumn('internalid', null, 'count');
            countResult = nlapiSearchRecord(recordType, null, filters, [_columnCount]);
            result.totalRecordsFound = parseInt(countResult[0].getValue(_columnCount), 10);
        }
        if (doRealCount || result.totalRecordsFound > 0 && result.totalRecordsFound > rangeStart) {
            search = nlapiCreateSearch(recordType, filters, columns).runSearch();
            result.records = search.getResults(rangeStart, rangeEnd);
            if (doRealCount && !columnCount) {
                result.totalRecordsFound = search.getResults(0, 1000).length;
            }
        }
        return result;
    };
    SearchHelper.prototype._getAllSearchResults = function _getAllSearchResults(recordType, filters, columns) {
        var search = nlapiCreateSearch(recordType, filters, columns);
        var searchRan;
        var bolStop = false;
        var intMaxReg = 1000;
        var intMinReg = 0;
        var result = [];
        var extras;
        search.setIsPublic(true);
        searchRan = search.runSearch();
        while (!bolStop && nlapiGetContext().getRemainingUsage() > 10) {
            extras = searchRan.getResults(intMinReg, intMaxReg);
            result = this._searchUnion(result, extras);
            intMinReg = intMaxReg;
            intMaxReg += 1000;
            if (extras.length < 1000) {
                bolStop = true;
            }
        }
        return result;
    };
    return SearchHelper;
});
define('Case.FileUpload.Configuration', [
    'Configuration',
    'underscore'
], function CaseFileUploadConfiguration(
    Configuration,
    _
) {
    'use strict';

    var CaseFileUploadConfig;
    var context = nlapiGetContext();

    CaseFileUploadConfig = {
        suitelet: {
            scriptID: 'customscript_ef_sl_case_upload',
            deployedScript: 'customdeploy_ef_sl_case_upload'
        },

        folderID: context.getSetting('SCRIPT', 'custscript_ef_cu_folder_id'),

        temporaryFolderID: context.getSetting('SCRIPT', 'custscript_ef_cu_temporary_folder_id'),

        maximumFileUpload: 10,

        thumbnailImageResizeID: 'thumbnail',

        allowedTypes: [
            'PNGIMAGE',
            'JPGIMAGE',
            'PDF',
            'EXCEL',
            'WORD',
            'PLAINTEXT',
            'MISCBINARY',
            'ZIP'
        ],

        allowedExtensions: [
            'png',
            'jpeg',
            'jpg',
            'pdf',
            'txt',
            'zip',
            'rar',
            'doc',
            'docx',
            'xls',
            'xlsx',
            'da0',
            'fac'
        ],

        uploadType: 'files' // image_only, files,
    };

    _.extend(CaseFileUploadConfig, {
        get: function get() {
            return this;
        }
    });

    Configuration.publish.push({
        key: 'CaseFileUpload_config',
        model: 'Case.FileUpload.Configuration',
        call: 'get'
    });

    return CaseFileUploadConfig;
});
define('Case.File.Model', [
    'SC.Model',
    'SearchHelper',
    'underscore'
], function CheckoutFileUploadModel(
    SCModel,
    SearchHelper,
    _
) {
    'use strict';

    return SCModel.extend({
        name: 'CaseFile',

        record: 'customrecord_ef_cu_case_messages_file',

        columns: {
            internalid: {fieldName: 'internalid'},
            caseID: {fieldName: 'custrecord_ef_cu_cmf_case'},
            messageID: {fieldName: 'custrecord_ef_cu_cmf_message_id'},
            fileID: {fieldName: 'custrecord_ef_cu_cmf_file_id'}
        },

        filters: [
            {fieldName: 'isinactive', operator: 'is', value1: 'F'}
        ],

        getMessageFiles: function getMessageFiles(caseID) {
            var filters = _.clone(this.filters);
            var data;
            var search;
            var results;

            filters.push({
                fieldName: this.columns.caseID.fieldName,
                operator: 'is',
                value1: caseID
            });

            search = new SearchHelper()
                .setRecord(this.record)
                .setFilters(filters)
                .setColumns(this.columns)
                .setSort('internalid')
                .setSortOrder('asc')
                .search();

            results = search.getResults();

            if ( results && results.length > 0 ) {
                data = _.map(results, function mapResult(result) {
                    var fileLink = nlapiLoadFile(result.fileID);
                    return {
                        internalid: result.internalid,
                        msgid: result.messageID,
                        fileid: result.fileID,
                        link: fileLink.getURL()
                    };
                });
            }

            return _.groupBy(data, 'msgid');
        }
    });
});
define('EF CU SL - Case File Upload', [
    'Application',
    'Case.File.Model',
    'underscore',
    'Case.FileUpload.Configuration'
], function EFCUCaseFileUpload(Application, CaseFileModel, _, Configuration) {
    'use strict';

    var CaseMessageFile = function caseMessageFile(fileObject) {
        this.fileObject = fileObject;
        this.fileOrigName = this.fileObject.getName();
        this.fileExtension = this.fileOrigName.substring(this.fileOrigName.lastIndexOf('.'), this.fileOrigName.length);
    };

    var main = function main(request) {
        var result;
        var fileObject;
        var caseMsgFile;
        var caseID;
        var fileID;

        try {
            switch (request.getMethod()) {
            case 'POST':
                fileObject = request.getFile('file');
                caseMsgFile = new CaseMessageFile(fileObject);

                if ( caseMsgFile.validate() ) {
                    result = caseMsgFile.upload();
                    Application.sendContent(_.extend(result));
                }

                break;

            case 'GET':
                caseID = request.getParameter('caseid');
                result = CaseFileModel.getMessageFiles(caseID);
                Application.sendContent(result);

                break;

            case 'DELETE':
                fileID = request.getParameter('internalid');
                nlapiDeleteFile(fileID);
                Application.sendContent({status: 'ok'});
                break;
            default: break;
            }
        }catch (e) {
            Application.sendError(e);
        }
    };

    CaseMessageFile.prototype = {
        validate: function validate() {
            if (!this.fileObject) {
                throw nlapiCreateError('ERR_FILE_NOT_PRESENT', 'No file uploaded');
            }

            if (Configuration.sizeLimit) {
                if (this.fileObject.getSize() > Configuration.sizeLimit) {
                    throw nlapiCreateError('ERR_FILE_SIZE', 'File size limit exceeded');
                }
            }
			nlapiLogExecution('DEBUG', 'types', JSON.stringify(Configuration.allowedTypes));
          	nlapiLogExecution('DEBUG', 'type', JSON.stringify(this.fileObject.getType()));
            if (Configuration.allowedTypes &&
               (_.isArray(Configuration.allowedTypes) && Configuration.allowedTypes.length > 0)) {
                if (!_.contains(Configuration.allowedTypes, this.fileObject.getType())) {
                    throw nlapiCreateError('ERR_FILE_TYPE', 'File type not allowed');
                }
            }

            return true;
        },

        upload: function uploadFile() {
            var fileID;
            var fileUrl;

            this.fileObject.setName( this.getNewFileName() );
            this.fileObject.setFolder(Configuration.temporaryFolderID);

            try {
                fileID = nlapiSubmitFile(this.fileObject);

                if (fileID) {
                    fileUrl = nlapiLookupField('file', fileID.toString(), 'url');
                }
            } catch (e) {
                if (e instanceof nlobjError) {
                    console.error(e.getCode(), e.getDetails());
                }

                throw nlapiCreateError('ERR_FILE_UPLOADED', 'Error ocurred while uploading');
            }

            return {
                fileID: fileID.toString(),
                link: fileUrl,
                oldName: this.fileOrigName
            };
        },

        getNewFileName: function getNewFileName() {
            return nlapiGetUser() + '_' +
                   new Date().getMilliseconds().toString() + parseInt(Math.random() * 10000000, 10).toString() +
                   this.fileExtension;
        }
    };

    return { main: main };
});
require.config({"paths":{"Backbone.Validation":"backbone-validation.server.custom"},"shim":{"Backbone.Validation":{"exports":"Backbone.Validation"}},"findNestedDependencies":true,"map":{"SC.Model":{"Application":"Application.Backend"},"Utils":{"Application":"Application.Backend"},"EF CU SL - Case File Upload":{"Application":"Application.Backend"}},"baseUrl":"","configFile":null,"exclude":[],"excludeShallow":[],"loader":null,"preserveComments":false,"wrapShim":true});
var Handler = require('EF CU SL - Case File Upload');