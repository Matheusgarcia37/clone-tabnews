import database from "../../../../infra/database.js";

async function status(req, res) {
  const result = await database.query("SELECT 1 + 1 AS NUMERO;");
  console.log(result.rows[0]);
  return res.status(200).json({
    message: "API v1 is working",
  });
}

export default status;
