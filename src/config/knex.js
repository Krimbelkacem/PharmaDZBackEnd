const knex = require("knex");

const knexConfig = {
  development: {
    client: "mysql2",
    connection: {
      host: "localhost",
      user: "root",
      password: "", // Empty password
      database: "Pharma_dz", // Replace with your desired database name
    },
  },
};

const knexInstance = knex(knexConfig.development);

module.exports = knexInstance;
