const get = require('lodash/get')
const set = require('lodash/set')

export function validator(value) {
    return {
        isString: () => {
            return value !== undefined && value !== null && typeof value === 'string';
        },
        isNumber: () => {
            return value !== undefined && value !== null && typeof value === 'number'
        },
        isBoolean: () => {
            return value !== undefined && value !== null && typeof value === 'boolean'
        },
        isObject: () => {
            return value !== undefined && value !== null && typeof value === 'object' && value.constructor === Object
        },
        isArray: () => {
            return value !== undefined && value !== null && typeof value === 'object' && value.constructor === Array
        },
        isFunction: () => {
            return value !== undefined && value !== null && typeof value === 'function'
        }
    }
}

export function validateFetchProperty({type, pattern}) {
    const validTypes = ['path', 'contentType'];

    const validType = validator(type).isString() && validTypes.includes(type);
    const validPattern = validator(pattern).isString();

    return validType && validPattern
}

export function validateIgnoreObject({key, excludeStartLevel}) {
    const validKey = validator(key).isArray() && key.length > 0
    const validExcludeStartLevel = validator(excludeStartLevel).isNumber()

    return validKey && validExcludeStartLevel
}

export function validateIgnoreProperty(ignoreList) {
    return validator(ignoreList).isArray() && ignoreList.length > 0 && ignoreList.every(ignore => validateIgnoreObject(ignore))
}

export function validateCacheProperty(cache) {
    return validator(cache).isBoolean()
}

export function validateGlobalKeyProperty(globalKey) {
    return validator(globalKey).isString()
}

export function validateFormatProperty(globalKey) {
    return validator(globalKey).isFunction()
}

export function validateLoadObject({fetch, ignore, cache, globalKey, format}) {
    const isFetchValid = validateFetchProperty(fetch);
    const isIgnoreValid = ignore === undefined || validateIgnoreProperty(ignore);
    const isCacheValid = cache === undefined || validateCacheProperty(cache);
    const isGlobalKeyValid = globalKey === undefined || validateGlobalKeyProperty(globalKey);
    const isFormatValid = format === undefined || validateFormatProperty(format);

    const isValid = isFetchValid && isIgnoreValid && isCacheValid && isGlobalKeyValid && isFormatValid;

    if (!isValid) {
        console.error(`Load object: ${{fetch, ignore, cache, globalKey, format}} is invalid.`,
            `isFetchValid - ${isFetchValid}`,
            `isIgnoreValid - ${isIgnoreValid}`,
            `isCacheValid - ${isCacheValid}`,
            `isGlobalKeyValid - ${isGlobalKeyValid}`,
            `isFormatValid - ${isFormatValid}`,
        )
    }

    return isValid;
}

export function proceedIgnoreObject(object, ignore) {
    if (!validateIgnoreObject(ignore)) return;

    function proceedObjectRecursive(object, level) {
        // If we enough inside of the object to start properties exclude
        const canStartExclude = level >= ignore.excludeStartLevel;
        // Collect all object keys
        const objKeys = Object.keys(object);
        // Here we will store all the keys which values are objects
        const innerObjectKeys = [];

        objKeys.forEach(key => {
            if (canStartExclude && ignore.key.includes(key)) {
                object[key] = null;
            }

            if (validator(object[key]).isObject()) {
                innerObjectKeys.push(key)
            }
        })

        innerObjectKeys.forEach(key => proceedObjectRecursive(object[key], ++level));
    }

    proceedObjectRecursive(object, 0)
}

export function proceedIgnore(object, ignoreList) {
    ignoreList.forEach(ignore => proceedIgnoreObject(object, ignore))
}

export function proceedInclude (object, includeList) {
    const data = {}

    includeList.forEach(include => {
        set(data, include, get(object, include, null))
    })

    return data
}
