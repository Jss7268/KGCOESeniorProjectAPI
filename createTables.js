require('dotenv').config();

const db = require('./db.js');

createTables();

async function createTables(){
	try {
		await db.query("CREATE TABLE users (id uuid PRIMARY KEY, name VARCHAR (100) NOT NULL, email VARCHAR (255) UNIQUE NOT NULL, hashedPassword VARCHAR (255) NOT NULL, createdAt bigint NOT NULL, updateAt bigint, deletedAt bigint)");
	} catch (err) {
		console.log(err);
	}
	try {
		await db.query("CREATE TABLE experiments (id uuid PRIMARY KEY, creator users NOT NULL, createdAt bigint NOT NULL, updateAt bigint, deletedAt bigint, startTime bigint)");
	} catch (err) {
		console.log(err);
	}
	try {
		await db.query("CREATE TABLE users_experiments (experiment experiments NOT NULL, username users NOT NULL, createdAt bigint NOT NULL, updatedAt bigint, deletedAt bigint)");
	} catch (err) {
		console.log(err);
	}
	try {
		await db.query("CREATE TABLE supported_devices (id uuid PRIMARY KEY, permission BOOLEAN, createdAt bigint NOT NULL, updatedAt bigint, deletedAt bigint)");
	} catch (err) {
		console.log(err);
	}
	try {
		await db.query("CREATE TABLE devices_experiments (experiment experiments NOT NULL, device supported_devices NOT NULL, createdAt bigint NOT NULL, updatedAt bigint, deletedAt bigint)");
	} catch (err) {
		console.log(err);
	}
	try {
		await db.query("CREATE TABLE output_types (id uuid PRIMARY KEY, name VARCHAR (100) NOT NULL, units VARCHAR (100) NOT NULL, createdAt bigint NOT NULL, updateAt bigint, deletedAt bigint)");
	} catch (err) {
		console.log(err);
	}
	try {
		await db.query("CREATE TABLE device_outputs (output_type output_types NOT NULL, experiment_id experiments NOT NULL, device_id supported_devices NOT NULL, output_value decimal NOT NULL, timestamp bigint NOT NULL, createdAT bigint NOT NULL, updatedAt bigint, deletedAt bigint)");
	} catch (err) {
		console.log(err);
	}
	try {
		await db.query("CREATE TABLE user_inputs (description VARCHAR (255) NOT NULL, timestamp bigint NOT NULL, experiment_id experiments NOT NULL, device_id supported_devices NOT NULL, username users NOT NULL, createdAT bigint NOT NULL, updatedAt bigint, deletedAt bigint)");
	} catch (err) {
		console.log(err);
	}
	console.log("Table creation finished properly");
	process.exit();
}
