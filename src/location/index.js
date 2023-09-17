const OpenLocationCode = require("./src/openlocationcode");

module.exports = {
  OpenLocationCode,
  encode: ({ latitude, longitude, codeLength }, callback) => {
    // ?? if (callback) callback(false, result)
    return OpenLocationCode.encode(latitude, longitude, codeLength);
  },
  decode: (plusCode) => {
    try {
      return OpenLocationCode.decode(plusCode);
    } catch (error) {
      return false; // { error }
    }
  },
  decodePromise: (plusCode) =>
    new Promise((resolve, reject) => {
      try {
        const result = OpenLocationCode.decode(plusCode);
        resolve(result);
      } catch (error) {
        reject(error);
      }
    }),
  encodePromise: ({ latitude, longitude, codeLength }) =>
    new Promise((resolve, reject) => {
      try {
        const result = OpenLocationCode.encode(latitude, longitude, codeLength);
        resolve(result);
      } catch (error) {
        reject(error);
      }
    }),
};
