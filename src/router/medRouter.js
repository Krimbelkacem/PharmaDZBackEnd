const express = require("express");
const bcrypt = require("bcrypt");
const knex = require("knex")({
  client: "mysql2",
  connection: {
    host: "localhost",
    user: "root",
    password: "",
    database: "Pharma_dz",
    // port: 3307,
  },
});

const medRouter = express.Router();

medRouter.get("/", async (req, res) => {
  try {
    const medicaments = await knex("medicament").select("*").whereNotNull("P2");
    res.json(
      medicaments.map((med) => {
        const {
          ID,
          NUM_ENREGISTREMENT: NUM_ENR,
          CODE,
          DENOMINATION_COMMUNE_INTERNATIONALE: DCI,
          NOM_DE_MARQUE: MARQUE,
          FORME,
          DOSAGE,
          COND,
          REMBOURSEMENT,
          PRIX_PORTE_SUR_LA_DECISION_DENREGISTREMENT: PRIX,
          //P2,
        } = med;

        return {
          ID,
          CODE,
          MARQUE,
          DCI,
          NUM_ENR,
          FORME,
          DOSAGE,
          COND,
          REMBOURSEMENT,
          PRIX,
          // P2,
        };
      })
    );
  } catch (error) {
    console.error("Error fetching medicaments:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});
// Define a route to add stock entries
medRouter.post("/addStock", async (req, res) => {
  try {
    const pharmacie_id = req.query.pharmacie_id;
    const { medicament_id, quantity, expiration } = req.body;
    console.log(pharmacie_id, medicament_id, quantity, expiration);

    await knex("stock").insert({
      pharmacie_id,
      med_id: medicament_id,
      date_added: new Date(),
      quantity,
      expiration,
    });

    res.json({ message: "Stock entry added successfully" });
  } catch (error) {
    console.error("Error adding stock entry:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});
medRouter.get("/getStockList", async (req, res) => {
  try {
    const pharmacie_id = req.query.pharmacie_id;
    console.log(pharmacie_id);
    if (!pharmacie_id) {
      res.json([]);
      return;
    }

    const stockList = await knex("stock")
      .select(
        "stock.*",
        "medicament.id as medicament_id",
        "medicament.nom_de_marque"
      )
      .join("medicament", "stock.med_id", "=", "medicament.id")
      .where("stock.pharmacie_id", pharmacie_id);

    res.json(stockList);
  } catch (error) {
    console.error("Error retrieving stock list:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});
medRouter.post("/sale", async (req, res) => {
  const pharmacie_id = req.query.pharmacie_id;

  const { medicament_id, quantity } = req.body;
  knex("vente").insert({ pharmacie_id, med_id: medicament_id, quantity });
  //knex('stock').
});
// Search route
medRouter.get("/searchMed", async (req, res) => {
  const searchText = req.query.q; // Get search query from URL query parameter

  try {
    const searchResults = await knex("medicament")
      .select("*")
      .where("denomination_commune_internationale", "LIKE", `%${searchText}%`)
      .orWhere("nom_de_marque", "LIKE", `%${searchText}%`)
      .orWhere("code", "LIKE", `%${searchText}%`);

    res.json(searchResults);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "An error occurred while searching." });
  }
});

async function getMatchingMedicationsByDCI(ordonnance) {
  try {
    const uniqueDCIs = [
      ...new Set(
        ordonnance.map((item) => item.denomination_commune_internationale)
      ),
    ];

    const matchingMedications = await knex("medicament")
      .select("*")
      .whereIn("denomination_commune_internationale", uniqueDCIs);

    return matchingMedications;
  } catch (error) {
    console.error("Error retrieving medications:", error);
    throw new Error("An error occurred while retrieving medications.");
  }
}
/* 
async function testFunction() {
  try {
    const ordonnance = [
      { id: 1, denomination_commune_internationale: "Common Name " },
      { id: 2, denomination_commune_internationale: "Paracetamol" },
      // ... add more medications
    ];

    const matchingMedications = await getMatchingMedicationsByDCI(ordonnance);

    console.log("Matching Medications:", matchingMedications);
  } catch (error) {
    console.error("Error:", error.message);
  }
}

testFunction(); */

module.exports = medRouter;
