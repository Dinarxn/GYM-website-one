/**
 * Lightweight, zero-dependency assertion library with detailed error diffs.
 */

class AssertionError extends Error {
  constructor(message, actual, expected) {
    super(message);
    this.name = 'AssertionError';
    this.actual = actual;
    this.expected = expected;
  }
}

function assert(condition, message = 'Assertion failed') {
  if (!condition) {
    throw new AssertionError(message, condition, true);
  }
}

function equal(actual, expected, message) {
  if (actual !== expected) {
    const defaultMsg = `Expected ${JSON.stringify(actual)} to strictly equal ${JSON.stringify(expected)}`;
    const fullMsg = message ? `${defaultMsg} - ${message}` : defaultMsg;
    throw new AssertionError(fullMsg, actual, expected);
  }
}

function notEqual(actual, expected, message) {
  if (actual === expected) {
    const defaultMsg = `Expected ${JSON.stringify(actual)} not to equal ${JSON.stringify(expected)}`;
    throw new AssertionError(message || defaultMsg, actual, expected);
  }
}

function deepEqual(actual, expected, message) {
  if (!isDeepEqual(actual, expected)) {
    const defaultMsg = `Expected deep equality:\nActual:   ${formatValue(actual)}\nExpected: ${formatValue(expected)}`;
    throw new AssertionError(message || defaultMsg, actual, expected);
  }
}

function isDeepEqual(a, b) {
  if (a === b) return true;
  if (a === null || typeof a !== 'object' || b === null || typeof b !== 'object') {
    return false;
  }

  if (Array.isArray(a) !== Array.isArray(b)) return false;

  if (Array.isArray(a)) {
    if (a.length !== b.length) return false;
    for (let i = 0; i < a.length; i++) {
      if (!isDeepEqual(a[i], b[i])) return false;
    }
    return true;
  }

  const keysA = Object.keys(a);
  const keysB = Object.keys(b);
  if (keysA.length !== keysB.length) return false;

  for (const key of keysA) {
    if (!Object.prototype.hasOwnProperty.call(b, key)) return false;
    if (!isDeepEqual(a[key], b[key])) return false;
  }
  return true;
}

function formatValue(v) {
  try {
    return JSON.stringify(v);
  } catch {
    return String(v);
  }
}

function match(string, regex, message) {
  const str = String(string);
  const re = typeof regex === 'string' ? new RegExp(regex) : regex;
  if (!re.test(str)) {
    const defaultMsg = `Expected "${str}" to match ${re}`;
    throw new AssertionError(message || defaultMsg, str, re.toString());
  }
}

function notMatch(string, regex, message) {
  const str = String(string);
  const re = typeof regex === 'string' ? new RegExp(regex) : regex;
  if (re.test(str)) {
    const defaultMsg = `Expected "${str}" not to match ${re}`;
    throw new AssertionError(message || defaultMsg, str, re.toString());
  }
}

function includes(collection, item, message) {
  let found = false;
  if (typeof collection === 'string') {
    found = collection.includes(item);
  } else if (Array.isArray(collection)) {
    found = collection.includes(item);
  } else if (collection && typeof collection.has === 'function') {
    found = collection.has(item);
  } else if (collection && typeof collection === 'object') {
    found = Object.values(collection).includes(item);
  }
  if (!found) {
    const defaultMsg = `Expected collection ${formatValue(collection)} to include ${formatValue(item)}`;
    throw new AssertionError(message || defaultMsg, collection, item);
  }
}

function throws(fn, expectedError, message) {
  let threw = false;
  let caughtError = null;
  try {
    fn();
  } catch (err) {
    threw = true;
    caughtError = err;
  }

  if (!threw) {
    throw new AssertionError(message || 'Expected function to throw an error, but it did not', null, expectedError);
  }

  if (expectedError) {
    if (typeof expectedError === 'string') {
      if (!caughtError.message.includes(expectedError)) {
        throw new AssertionError(
          message || `Expected error message to include "${expectedError}", got "${caughtError.message}"`,
          caughtError.message,
          expectedError
        );
      }
    } else if (expectedError instanceof RegExp) {
      if (!expectedError.test(caughtError.message)) {
        throw new AssertionError(
          message || `Expected error message to match ${expectedError}, got "${caughtError.message}"`,
          caughtError.message,
          expectedError.toString()
        );
      }
    } else if (typeof expectedError === 'function') {
      if (!(caughtError instanceof expectedError)) {
        throw new AssertionError(
          message || `Expected error to be instance of ${expectedError.name}`,
          caughtError.constructor.name,
          expectedError.name
        );
      }
    }
  }
}

async function rejects(asyncFn, expectedError, message) {
  let threw = false;
  let caughtError = null;
  try {
    const promise = typeof asyncFn === 'function' ? asyncFn() : asyncFn;
    await promise;
  } catch (err) {
    threw = true;
    caughtError = err;
  }

  if (!threw) {
    throw new AssertionError(message || 'Expected promise to reject, but it resolved', null, expectedError);
  }

  if (expectedError) {
    if (typeof expectedError === 'string') {
      if (!caughtError.message.includes(expectedError)) {
        throw new AssertionError(
          message || `Expected rejection message to include "${expectedError}", got "${caughtError.message}"`,
          caughtError.message,
          expectedError
        );
      }
    } else if (expectedError instanceof RegExp) {
      if (!expectedError.test(caughtError.message)) {
        throw new AssertionError(
          message || `Expected rejection message to match ${expectedError}, got "${caughtError.message}"`,
          caughtError.message,
          expectedError.toString()
        );
      }
    }
  }
}

function closeTo(actual, expected, delta = 0.001, message) {
  const diff = Math.abs(actual - expected);
  if (diff > delta) {
    const defaultMsg = `Expected ${actual} to be within ${delta} of ${expected} (diff: ${diff})`;
    throw new AssertionError(message || defaultMsg, actual, expected);
  }
}

function truthy(value, message) {
  if (!value) {
    throw new AssertionError(message || `Expected ${JSON.stringify(value)} to be truthy`, value, true);
  }
}

function falsy(value, message) {
  if (value) {
    throw new AssertionError(message || `Expected ${JSON.stringify(value)} to be falsy`, value, false);
  }
}

module.exports = {
  assert,
  equal,
  notEqual,
  deepEqual,
  match,
  notMatch,
  includes,
  throws,
  rejects,
  closeTo,
  truthy,
  falsy,
  AssertionError,
};
