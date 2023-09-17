const express = require("express");
const medHandler = require("./medicamant");
const pharmaHandler = require("./pharmacies");
const placeHolder = (req, res) => {};
const apiRouter = express.Router();

//pour recuperer les pharmacies
apiRouter.get("/pharmacies", pharmaHandler.handleListPharmacies);

//recuperer les details d'une pharmacie
apiRouter.get("/pharmacies/:id", placeHolder);

//recuperer la list des medicamant dans le stock d'une pharmacie
apiRouter.get("/pharmacies/:id/medicaments", placeHolder);

//ajouter une pharmacie
apiRouter.post("/pharmacies", pharmaHandler.handleCreatePharmacy);

//ajouter des medicament dans le stock de la pharmacie
apiRouter.post("/pharmacies/:id/medicaments", placeHolder);

//pour recuperer les medicaments
apiRouter.get("/medicaments", medHandler.handleListMeds);
//les medicmant par un CODE dci
apiRouter.get("/medicaments/related", medHandler.handleGetRelatedMeds);

//pour recuperer les details d'un medicamnet
apiRouter.get("/medicaments/:id", medHandler.handleShowMed);

//ajouter un medicament vers la bdd
apiRouter.post("/medicaments", placeHolder);

module.exports = apiRouter;
