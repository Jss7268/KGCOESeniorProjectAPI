require('dotenv').config();

const db = require('./db.js');

createTables();

async function createTables()
	const users = await db.query("CREATE TABLE users (id uuid PRIMARY KEY, name VARCHAR (100) NOT NULL, email VARCHAR (255) UNIQUE NOT NULL, hashedPassword VARCHAR (255) NOT NULL, createdAt bigint NOT NULL, updateAt bigint, deletedAt bigint)");
	const experiments = await db.query("CREATE TABLE experiments (id uuid PRIMARY KEY, creator users NOT NULL, createdAt bigint NOT NULL, updateAt bigint, deletedAt bigint, startTime bigint)");
	const users_experiments = await db.query("CREATE TABLE users_experiments (experiment experiments NOT NULL, user users NOT NULL, createdAt bigint NOT NULL, updatedAt bigint, deletedAt bigint)");
	const supported_devices = await db.query("CREATE TABLE supported_devices (id uuid PRIMARY KEY, permission BOOLEAN, createdAt bigint NOT NULL, updatedAt bigint, deletedAt bigint)");
	const devices_experiments = await db.query("CREATE TABLE devices_experiments (experiment experiments NOT NULL, device supported_devices NOT NULL, createdAt bigint NOT NULL, updatedAt bigint, deletedAt bigint)");
	const output_types = await db.query("CREATE TABLE output_types (id uuid PRIMARY KEY, name VARCHAR (100) NOT NULL, units VARCHAR (100) NOT NULL, createdAt bigint NOT NULL, updateAt bigint, deletedAt bigint)");
	const device_outputs = await db.query("");
	const user_inputs = await db.query("");
	console.log(rows);
	console.log(users);
	console.log("Table creation finished properly");
	process.exit();
