import database from '../../../../infra/database.js'

async function status(request, response) {
  const result = await database.query('SELECT 1 + 1 AS two');
  console.log(result.rows[0].two); // 2
  
  response.status(200).json({
    status: "ok",
  });
}

export default status;
