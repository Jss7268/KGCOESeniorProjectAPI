require('dotenv').config();

const db = require('./db.js');

createTables();

async function createTables(){
	const {rows} = await db.query("SELECT * FROM experiments");
	console.log(rows);
	console.log("Table creation finished properly");
	process.exit();
}
