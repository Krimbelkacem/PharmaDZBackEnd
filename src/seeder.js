const fs = require("fs");
const knex = require("knex");

// Create a Knex instance with your database configuration
const db = require("knex")({
  client: "mysql2",
  connection: {
    host: "localhost",
    user: "root",
    password: "",
    database: "Pharma_dz",
    //port: 3307,
  },
});

// Read the SQL queries from the file
fs.readFile("./meds.sql", "utf8", async (err, data) => {
  if (err) {
    console.error("Error reading file:", err);
    return;
  }

  const queries = data.split("\n").map((query) => query.trim());

  // Execute each query in sequence
  for (const query of queries) {
    try {
      await db.raw(query);
      console.log("Query executed:", query);
    } catch (error) {
      console.error("Error executing query:", query);
      console.error(error);
    }
  }

  // Close the database connection
  db.destroy();
});
