const express = require("express");
const bcrypt = require("bcrypt");
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

const authRouter = express.Router();

authRouter.post("/signup", async (req, res) => {
  const { username, email, password } = req.body;

  console.log(req.body);
  console.log(email);
  // Validate incoming data (you can use a validation library like Joi here)

  try {
    // Check if the user with the same email already exists
    const existingUser = await knex("users").where("email", email).first();
    if (existingUser) {
      return res.status(409).json({ error: "Email already exists" });
    }

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Insert the new user into the database
    const newUser = await knex("users").insert({
      username,
      email,
      password: hashedPassword,
    });

    res.json({ message: "User registered successfully", data: newUser });
  } catch (error) {
    console.error("Error registering user:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

authRouter.post("/signin", async (req, res) => {
  const { email, password } = req.body;
  console.log(email, password);
  console.log(req.body);

  try {
    // Check if the user with the given email exists
    const existingUser = await knex("users").where("email", email).first();
    if (!existingUser) {
      return res.status(401).json({ error: "Invalid credentials" });
    }

    // Compare the provided password with the hashed password stored in the database
    const passwordMatch = await bcrypt.compare(password, existingUser.password);
    if (!passwordMatch) {
      return res.status(401).json({ error: "Invalid credentials" });
    }

    let pharmacie;
    if (existingUser.idpharmacie)
      pharmacie = await knex("pharmacie")
        .select("*")
        .where("id_owner", existingUser.user_id);
    pharmacie?.length
      ? res.json({
          message: "User logged in successfully",
          user: {
            id: existingUser.user_id,
            username: existingUser.username,
            email: existingUser.email,
            is_admin: existingUser.is_admin,
            pharmacie: pharmacie[0],
          },
        })
      : res.json({
          message: "User logged in successfully",
          user: {
            id: existingUser.user_id,
            username: existingUser.username,
            email: existingUser.email,
            is_admin: existingUser.is_admin,
          },
        });
  } catch (error) {
    console.error("Error signing in:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});
authRouter.post("/logout", (req, res) => {
  // Perform any necessary actions to log out the user (e.g., clearing session, token, etc.)
  // In this simple example, we can just return a success message
  res.json({ message: "User logged out successfully" });
});

module.exports = authRouter;
