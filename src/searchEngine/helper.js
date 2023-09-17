const filterKeysByPrefix = (prefix, keys) => {
  console.log(keys);
  let exp = new RegExp(`^${prefix}`, "i");
  let _keys = keys.filter((key) => exp.test(key));
  console.log(_keys);
  return _keys;
};

module.exports = {
  filterKeysByPrefix,
};
