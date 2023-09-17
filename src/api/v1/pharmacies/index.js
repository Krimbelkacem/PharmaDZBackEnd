const db = require("../../../models/db");

const handleCreatePharmacy = (req, res) => {
  console.log(req.body);
  const { name, coordinates, adress } = req.body;
  console.log(coordinates);
  const [latitude, longitude] = coordinates.split(",");
  console.log(latitude, longitude);

  let con = db.getConnection();
  con
    .raw(
      "INSERT INTO pharmacies (name, coordinates, adress) VALUES (?, POINT(?, ?), ?)",
      [name, longitude, latitude, adress]
    )
    .then((result) => {
      console.log("Data inserted successfully");
      console.log(result);
    })
    .catch((error) => {
      console.error("Error inserting data:", error);
    })
    .finally(() => {
      con.destroy();
    });
};

const handleListPharmacies = (req, res) => {
  let con = db.getConnection();
  con("pharmacies")
    .select("*")
    .then((pharmacies) => {
      res.json(pharmacies);
    })
    .catch((err) => console.log());
};
module.exports = {
  handleCreatePharmacy,
  handleListPharmacies,
};
