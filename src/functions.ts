/**
 * Check if json is valid
 * @param data
 * @returns {boolean}
 */
export function isValidJson(data: any) {
  try {
    JSON.parse(data);
    return true;
  } catch (e) {
    return false;
  }
}

/**
 * Convert object to json
 * @param data
 * @returns {string}
 */
export function toJson(data: any) {
  return JSON.stringify(data, null, 2);
}

/**
 * Convert json to object
 * @param data
 * @returns {any}
 */
export function fromJson(data: string) {
  return JSON.parse(data);
}
