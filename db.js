require('dotenv').config();
const {Pool} = require('pg');


const pool = new Pool({
	host: process.env.DB_HOST,
	user: process.env.DB_USER,
	password: process.env.DB_PASS,
	database: process.env.DB_DATABASE,
	port: process.env.PORT,
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
// "build": "babel server.js --out-dir build",

const getExperimentDataById = (request, response) => {
	const id = request.params.id;
	//todo: validate id
	 try{
		pool.query('SELECT * FROM device_outputs WHERE experiment_id = $1', [id], (error, results) => {
			 if (error) {
				console.log(error.status);
				//todo: group error codes found https://www.enterprisedb.com/docs/en/9.2/pg/errcodes-appendix.html
				if(error.code == ("0A000" || error.code)){
					response.status(400).json({
						error: {
							message: error.message,
							code: error.code
						}
					});
				}
			}
			else{
				response.status(200).json(results.rows);
			}
		});
	 }
	 catch(ex){
	 	console.log(error);
	// 	callback(new Error('something happened'));
	 }
}

const createexperiment = (request, response) => {
	var createdAt = new Date().getTime();
  const { creatorId } = request.body
	// (id uuid PRIMARY KEY DEFAULT uuid_generate_v4 (), creator users NOT NULL, createdAt bigint NOT NULL, updatedAt bigint, deletedAt bigint, startTime bigint
  pool.query('INSERT INTO experiments (creatorId, createdAt ) VALUES ($1, $2) returning id', [ creatorId, createdAt ], (error, result) => {
    if (error) {
			console.log(error);
			//todo: group error codes found https://www.enterprisedb.com/docs/en/9.2/pg/errcodes-appendix.html
			if(error.code){
				response.status(400).json({
					error: {
						message: error.message,
						code: error.code
					}
				});
			}
		}
		else{
			response.status(201).send(`${result.creatorId} created a new experiment with ID ${result.id}`)
		}
  })
}

pool.setMaxListeners(0);

module.exports = {
	query: (text, params) => pool.query(text, params),
	pool: pool,
	getExperiments,
	getExperimentDataById,
	createexperiment
}