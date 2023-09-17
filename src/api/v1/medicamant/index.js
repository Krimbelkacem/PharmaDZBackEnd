const db = require("../../../models/db");
const handleCreate = (req, res) => {
  let med = { ...req.body };
};

const handleListMeds = (req, res) => {
  const limit = req?.query?.limit;
  const start = req?.query?.start;

  console.log(limit, start);

  let con = db.getConnection();
  con("medicament")
    .select("*")
    .then((meds) => {
      if (limit && start) {
        res.json({ medicamants: meds.slice(start, start + limit) });
        return;
      }
      res.json({ medicamants: meds });
      return;
    });
  ///con.destroy();
};

const handleShowMed = (req, res) => {
  const id = req.params.id;
  let con = db.getConnection();
  con("medicament")
    .select("*")
    .where("id", "=", id)
    .then((med) => res.json(med));
};

const handleGetRelatedMeds = (req, res) => {
  const codedci = req.query.codedci;
  //console.log(codedci);
  let con = db.getConnection();
  con("medicament")
    .select("*")
    .where("CODE", codedci)
    .then((meds) => res.json(meds));
};

const handleRemove = (req, res) => {};

module.exports = { handleListMeds, handleShowMed, handleGetRelatedMeds };
