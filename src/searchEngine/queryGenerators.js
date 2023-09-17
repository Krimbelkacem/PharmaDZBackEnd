const params = require("../params/searchEngineParams"); //.getParams();
const pharmaRouter = require("../router/pharmaRouter");
const knex = require("knex")({
  client: "mysql2",
  connection: {
    host: "localhost",
    user: "root",
    password: "",
    database: "Pharma_dz",
  },
});

const medColumnFromId = (id, pharmacies) => {
  return `SUM(CASE WHEN med_id = ${id} THEN QUANTITY - Q_VENDUE ELSE 0 END) AS Q_${id},min(CASE WHEN med_id=${id} THEN  ABS(DATEDIFF(now(),expiration)) END) AS exp_${id}`;
};
const medsPharmaQuantityQuery = (med_ids, pharmacies) => {
  let sql = "";
  let med_colums = med_ids.map((id) => medColumnFromId(id));
  sql = `SELECT pharmacie_id, ${med_colums.join(
    ","
  )} from stock where expiration > DATE_SUB(DATE(NOW()), INTERVAL ${
    params.getParams().experiation_margin
  } DAY) AND pharmacie_id in (${pharmacies
    .map((_) => _.pharmacie_id)
    .join(",")})  GROUP BY pharmacie_id ORDER BY pharmacie_id`;
  //console.log("quantity", sql, "\n\n\n");
  return sql;
};

const quantityIndex = (quantities) => {
  return quantities.map((quantity) =>
    filterKeysByPrefix("Q_", Object.keys(quantity)).map((key) =>
      Number.parseInt(quantity[key])
    )
  );
};

const createIndexFromIDs = async (ids, pharmacies) => {
  let list_DCI = await createDCIIndexFromIds(ids);
  let IDs = await createIndexFromDCIList(list_DCI);

  let sql = medsPharmaQuantityQuery(IDs, pharmacies);
  //console.log(sql);
  return knex
    .raw(sql)
    .then((res) => res)
    .then((res) => res[0])
    .catch((error) => "" /* console.log("error", error )*/);
};

const createIndexFromDCIList = async (listDCI) => {
  return knex("medicament")
    .select("*")
    .whereIn("code", listDCI)
    .then((res) => {
      return res.map((med) => med.ID);
    })
    .catch(() => {}); //console.log);
};

const createPharmaDistenceIndex = (position) => {
  return knex
    .raw(
      `
        SELECT
            pharmacie_id,
            (
                6371 * 
                acos(
                    cos(radians(${position.latitude})) *
                    cos(radians(latitude)) *
                    cos(radians(longitude) - radians(${position.longitude})) +
                    sin(radians(${position.latitude})) *
                    sin(radians(latitude))
                )
            ) AS distance, latitude, longitude, name as nom
        FROM
            pharmacie
        HAVING distance < ${params.getParams().scope} `
    )
    .then(
      (
        results //console.log("distence",
      ) => results[0]
    )
    .catch((error) => {
      console.error("Error:", error);
    });
};

const createPharmaDistenceMatrix = async (pharmacies) => {
  let mat = await knex.raw(
    pharmacies
      .map(
        (pharmacie) =>
          "(SELECT " +
          pharmacies
            .map(
              (_pharmacie, index) => `(
    
                6371 * 
                acos(
                    cos(radians(${_pharmacie.latitude})) *
                    cos(radians(latitude)) *
                    cos(radians(longitude) - radians(${_pharmacie.longitude})) +
                    sin(radians(${_pharmacie.latitude})) *
                    sin(radians(latitude))
                )
            ) AS d_${index}
    `
            )
            .join(",") +
          `FROM pharmacie
    WHERE pharmacie_id = ${pharmacie.pharmacie_id})`
      )
      .join(" UNION ")
  );
  //console.log(mat);
  return mat[0];
};
const createDCIIndexFromIds = async (ids) => {
  let DCIs = await knex("medicament").select("code").whereIn("ID", ids);
  return DCIs.map((dci) => dci.code);
};

module.exports = {
  createIndexFromDCIList,
  medsPharmaQuantityQuery,
  createIndexFromIDs,
  createDCIIndexFromIds,
  createPharmaDistenceIndex,
  createPharmaDistenceMatrix,
};
