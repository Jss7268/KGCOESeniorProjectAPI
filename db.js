const {Pool} = require('pg');

const pool = new Pool({
	host: process.env.DB_HOST,
	user: process.env.DB_USER,
	password: process.env.DB_PASS,
	database: process.env.DB_DATABASE,
	port: 5432,
});

const getExperiments = (request, response) => {
	pool.query('SELECT * FROM experiments', (error, results) => {
	  if (error) {
		throw error;
		console.log(error);
	  }
	  response.status(200).json(results.rows);
	});
}

// const getExperimentsDates = (request, response) => {
// 	pool.query('SELECT DATE FROM experiments WHERE ')
// }

const getExperimentDataById = (request, response) => {
	const id = parseInt(request.params.id)

  pool.query('SELECT * FROM device_outputs WHERE id = $1', [id], (error, results) => {
    if (error) {
      throw error;
    }
    response.status(200).json(results.rows);
  });
}

pool.setMaxListeners(0);

module.exports = {
	query: (text, params) => pool.query(text, params),
	pool: pool,
	getExperiments,
	getExperimentDataById
}