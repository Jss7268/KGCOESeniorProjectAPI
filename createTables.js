require('dotenv').config();

const db = require('./db.js');

createTables();

async function createTables(){
	await db.query("");
	console.log("Table creation finished properly");
	process.exit();
}