module.exports = (db) => {
  return {
    userRouter: require("./userRouter")(db),
    productRouter: require("./productRouter")(db),
  };
};
