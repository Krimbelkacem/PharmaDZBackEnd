const express = require("express");
const bcrypt = require("bcrypt");
const makeSearch = require("../searchEngine");
const {
  createIndexFromIDs,
  createDCIIndexFromIds,
  createPharmaDistenceIndex,
  createPharmaDistenceMatrix,
} = require("../searchEngine/queryGenerators");

const knex = require("knex")({
  client: "mysql2",
  connection: {
    host: "localhost",
    user: "root",
    password: "",
    database: "Pharma_dz",
    //port: 3307,
  },
});

const searchRouter = express.Router();

searchRouter.post("/", makeSearch);

module.exports = searchRouter;
