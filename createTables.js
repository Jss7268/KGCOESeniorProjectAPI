require('dotenv').config();

const db = require('./db.js');

createTables();

async function createTables(){
	try {
		await db.query("CREATE EXTENSION IF NOT EXISTS \"uuid-ossp\";");
	} catch (err) {
		console.log(err);
	}
	try {
		await db.query("CREATE TABLE users (id uuid PRIMARY KEY DEFAULT uuid_generate_v4 (), name VARCHAR (100) NOT NULL, email VARCHAR (255), hashedPassword VARCHAR (255) NOT NULL, access smallint NOT NULL DEFAULT 0, createdAt bigint NOT NULL, updatedAt bigint, deletedAt bigint)");
	} catch (err) {
		console.log(err);
	}
	try {
		await db.query("CREATE TABLE experiments (id uuid PRIMARY KEY DEFAULT uuid_generate_v4 (), creatorId uuid, createdAt bigint NOT NULL, updatedAt bigint, deletedAt bigint, startTime bigint, FOREIGN KEY (creatorId) REFERENCES users (id))");
	} catch (err) {
		console.log(err);
	}
	try {
		await db.query("CREATE TABLE users_experiments (experiment experiments NOT NULL, username users NOT NULL, createdAt bigint NOT NULL, updatedAt bigint, deletedAt bigint)");
	} catch (err) {
		console.log(err);
	}
	try {
		await db.query("CREATE TABLE output_types (id uuid PRIMARY KEY DEFAULT uuid_generate_v4 (), name VARCHAR (100) NOT NULL, units VARCHAR (100) NOT NULL, createdAt bigint NOT NULL, updatedAt bigint, deletedAt bigint)");
	} catch (err) {
		console.log(err);
	}
	try {
		await db.query("CREATE TABLE device_outputs (output_type output_types NOT NULL, experiment_id experiments NOT NULL, device_id uuid NOT NULL DEFAULT uuid_generate_v4 (), output_value decimal NOT NULL, timestamp bigint NOT NULL, createdAT bigint NOT NULL, updatedAt bigint, deletedAt bigint)");
	} catch (err) {
		console.log(err);
	}
	try {
		await db.query("CREATE TABLE user_inputs (description VARCHAR (255) NOT NULL, timestamp bigint NOT NULL, experiment_id experiments NOT NULL, device_id uuid NOT NULL DEFAULT uuid_generate_v4 (), username users NOT NULL, createdAT bigint NOT NULL, updatedAt bigint, deletedAt bigint)");
	} catch (err) {
		console.log(err);
	}
	console.log("Table creation finished properly");
	process.exit();
}
