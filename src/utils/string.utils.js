/**
 * Capitalizes a string.
 *
 * @param {string} string The string to capitalize
 * @returns {string}
 */
const capitalize = (string) => {
  if (typeof string !== 'string') return '';
  return string.charAt(0).toUpperCase() + string.slice(1);
};

module.exports = {
  capitalize,
};
