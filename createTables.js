require('dotenv').config();

const db = require('./config/db.js');

createTables();

async function createTables() {
	try {
		await db.query("CREATE EXTENSION IF NOT EXISTS \"uuid-ossp\";");
	} catch (err) {
		console.log(err);
	}
	try {
		await db.query("CREATE TABLE IF NOT EXISTS users " +
			"(id uuid PRIMARY KEY DEFAULT uuid_generate_v4 (), " + 
			"name VARCHAR (100) NOT NULL, " + 
			"email VARCHAR (255), " + 
			"hashed_password VARCHAR (255) NOT NULL, " + 
			"access smallint NOT NULL DEFAULT 0, " + 
			"created_at bigint NOT NULL, " + 
			"updated_at bigint, " + 
			"deleted_At bigint NOT NULL DEFAULT 0)");
	} catch (err) {
		console.log(err);
	}
	try {
		await db.query("CREATE TABLE IF NOT EXISTS experiments " +
			"(id uuid PRIMARY KEY DEFAULT uuid_generate_v4 (), " + 
			"creator_id uuid, " + 
			"notes text, " +
			"description text, " +
 			"created_at bigint NOT NULL, " + 
			"updated_at bigint, " + 
			"deleted_at bigint NOT NULL DEFAULT 0, " + 
			"start_time bigint, " + 
			"FOREIGN KEY (creator_id) REFERENCES users (id))");
	} catch (err) {
		console.log(err);
	}
	try {
		await db.query("CREATE TABLE IF NOT EXISTS devices_experiments " +
			"(experiment_id uuid NOT NULL, " + 
			"device_id uuid NOT NULL, " + 
			"created_at bigint NOT NULL, " + 
			"updated_at bigint, " + 
			"deleted_at bigint NOT NULL DEFAULT 0, " + 
			"PRIMARY KEY (experiment_id, device_id, deleted_at), " +
			"FOREIGN KEY (device_id) REFERENCES users (id), " + 
			"FOREIGN KEY (experiment_id) REFERENCES experiments (id))");
	} catch (err) {
		console.log(err);
	}
	try {
		await db.query("CREATE TABLE  IF NOT EXISTS output_types " +
			"(id uuid PRIMARY KEY DEFAULT uuid_generate_v4 (), " + 
			"name VARCHAR (100) NOT NULL, " + 
			"units VARCHAR (100) NOT NULL, " + 
			"created_at bigint NOT NULL, " + 
			"updated_at bigint, " + 
			"deleted_at bigint NOT NULL DEFAULT 0)");
	} catch (err) {
		console.log(err);
	}
	try {
		await db.query("CREATE TABLE IF NOT EXISTS device_outputs " +
			"(device_id uuid NOT NULL, " + 
			"output_type_id uuid NOT NULL, " + 
			"experiment_id uuid NOT NULL, " + 
			"output_value decimal NOT NULL, " + 
			"timestamp bigint NOT NULL, " + 
			"created_at bigint NOT NULL, " + 
			"updated_at bigint, " + 
			"deleted_at bigint NOT NULL DEFAULT 0, " + 
			"PRIMARY KEY (device_id, output_type_id, experiment_id, deleted_at), " +
			"FOREIGN KEY (device_id) REFERENCES users (id), " + 
			"FOREIGN KEY (output_type_id) REFERENCES output_types (id), " + 
			"FOREIGN KEY (experiment_id) REFERENCES experiments (id))");
	} catch (err) {
		console.log(err);
	}
	try {
		await db.query("CREATE TABLE IF NOT EXISTS user_inputs " +
			"(description text NOT NULL, " +
			"timestamp bigint NOT NULL, " +
			"experiment_id uuid NOT NULL, " +
			"device_id uuid NOT NULL, " + 
			"user_id uuid NOT NULL, " + 
			"created_at bigint NOT NULL, " + 
			"updated_at bigint, " + 
			"deleted_At bigint NOT NULL DEFAULT 0, " + 
			"FOREIGN KEY (experiment_id) REFERENCES experiments (id), " + 
			"FOREIGN KEY (device_id) REFERENCES users (id), " + 
			"FOREIGN KEY (user_id) REFERENCES users (id))");
	} catch (err) {
		console.log(err);
	}
	console.log("Table creation finished properly");
	process.exit();
}
