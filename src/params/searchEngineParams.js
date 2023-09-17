const fs = require("fs");
let paramsData = require("./params.json");
const jsonFile = "./params.json";

//let param;
/* function readParamsFromFile() {
  try {
    const data = fs.readFileSync(jsonFile, "utf8");
    const parsedData = JSON.parse(data);
    console.log(parsedData);
    return parsedData;
  } catch (error) {
    console.log(error);
    return {};
  }
} */

function writeParamsToFile(params) {
  const data = { params };
  fs.writeFileSync(jsonFile, JSON.stringify(data, null, 4));
}

function getParams() {
  if (Object.keys(paramsData).length === 0) {
    console.log("reading params", paramsData);
    paramsData = readParamsFromFile();
    console.log(paramsData);
  }
  return paramsData;
}

function updateParams(updatedParams) {
  paramsData = { ...paramsData, ...updatedParams };
  writeParamsToFile(paramsData);
}

module.exports = {
  getParams,
  updateParams,
};
