export const capitalize = (string: string) => {
  return string.charAt(0).toUpperCase() + string.slice(1);
}

export const camelCase = (string: string) => {
  if (!string) { return string }

  return String(string).replace(/(_\w)/g, (m) => {
    return m[1].toUpperCase();
  });
}

export const snakeCase = (string: string) => {
  if (!string) { return string }

  return String(string).replace(/[\w]([A-Z])/g, (m) => {
    return m[0] + "_" + m[1];
  }).toLowerCase().split(" ").join("_");
}

export const convertKeysToCamelCase = (object: object, doNotCovertKeys = null) => {
  if (!object) { return object }

  if (object.constructor === Array) {
    return convertArrayKeysToCamelCase(object)
  } else if (object.constructor === Object) {
    return convertObjectKeysToCamelCase(object, doNotCovertKeys)
  } else {
    return object
  }
}

export const convertKeysToSnakeCase = (object: object) => {
  if (!object) { return object }

  if (object.constructor === Array) {
    return convertArrayKeysToSnakeCase(object)
  } else if (object.constructor === Object) {
    return convertObjectKeysToSnakeCase(object)
  } else {
    return object
  }
}

const convertObjectKeysToCamelCase = (object: object, doNotCovertKeys: any = null) => {
  return Object.keys(object).reduce((accumulator: Record<string, any>, key) => {
    const shouldNotConvertKey = doNotCovertKeys?.constructor === Array && doNotCovertKeys.includes(key)
    const camelCaseKey = camelCase(String(key))
    let value: any = object[key as keyof typeof object]
    if (value) {
      if (value.constructor === Array) {
        value = convertArrayKeysToCamelCase(value)
      } else if (value.constructor === Object) {
        if (!shouldNotConvertKey) {
          value = convertObjectKeysToCamelCase(value, doNotCovertKeys)
        }
      }
    }
    accumulator[camelCaseKey] = value
    return accumulator
  }, {})
}

const convertArrayKeysToCamelCase = (array: any) => {
  return array.map((elem: any) => {
    if (elem) {
      if (elem.constructor === Array) {
        return convertArrayKeysToCamelCase(elem)
      } else if (elem.constructor === Object) {
        return convertObjectKeysToCamelCase(elem)
      }
    }
    return elem
  })
}

const convertObjectKeysToSnakeCase = (object: object) => {
  return Object.keys(object).reduce((accumulator: any, key) => {
    const snakeCaseKey = snakeCase(String(key))
    let value: any = object[key as keyof typeof object]
    if (value) {
      if (value.constructor === Array) {
        value = convertArrayKeysToSnakeCase(value)
      } else if (value.constructor === Object) {
        if (value.doNotConvertToSnakeCase) {
          delete value.doNotConvertToSnakeCase
        } else {
          value = convertObjectKeysToSnakeCase(value)
        }
      }
    }
    accumulator[snakeCaseKey] = value
    return accumulator
  }, {})
}

const convertArrayKeysToSnakeCase = (array: any) => {
  return array.map((elem: any) => {
    if (elem) {
      if (elem.constructor === Array) {
        return convertArrayKeysToSnakeCase(elem)
      } else if (elem.constructor === Object) {
        return convertObjectKeysToSnakeCase(elem)
      }
    }
    return elem
  })
}

export const pluralize = (string: string, count: BigInteger, type = 'noun') => {
  if ((type === "verb" && Number(count) === 1) || (type === 'noun' && Number(count) !== 1)) {
    return _pluralize(string)
  }
  return string
}

const _pluralize = (word: string) => {
  if (word[word.length - 1] === 's') {
    return word + 'es'
  }
  return word + 's'
}

export const convertSearchFilter = (object: object, mappingObj: any = {}) => {
  return Object.keys(object).reduce((acc: any, key) => {
    let objectValue = object[key as keyof typeof object]

    if (typeof (objectValue) === 'string') {
      acc[key] = objectValue
    } else if (typeof (objectValue) === 'object') {
      acc[key] = Object.keys(objectValue).map(val => {
        if (objectValue[val]) {
          if (!!mappingObj[val]) {
            return mappingObj[val]
          } else {
            return val
          }
        }
      }).filter(n => n)
    }
    return acc
  }, {})
}

export const humanize = (str: string) => {
  let i, frags = str.split('_');
  for (i = 0; i < frags.length; i++) {
    frags[i] = frags[i].charAt(0).toUpperCase() + frags[i].slice(1);
  }
  return frags.join(' ');
}