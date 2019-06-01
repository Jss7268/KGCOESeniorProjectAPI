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
		await db.query(`CREATE TABLE IF NOT EXISTS user_access 
			(access_level smallint PRIMARY KEY,
			access_name varchar(255) NOT NULL,
			description text,
			created_at bigint NOT NULL, 
			updated_at bigint, 
			deleted_at bigint NOT NULL DEFAULT 0)`);
	} catch (err) {
		console.log(err);
	}
	try {
		await db.query(`CREATE TABLE IF NOT EXISTS users 
			(id uuid PRIMARY KEY DEFAULT uuid_generate_v4 (), 
			name VARCHAR (100) NOT NULL, 
			email VARCHAR (255) NOT NULL, 
			hashed_password VARCHAR (255) NOT NULL, 
			access_level smallint NOT NULL DEFAULT 0, 
			created_at bigint NOT NULL, 
			updated_at bigint, 
			deleted_at bigint NOT NULL DEFAULT 0,
			UNIQUE (email, deleted_at),
			FOREIGN KEY (access_level) REFERENCES user_access (access_level))`);
	} catch (err) {
		console.log(err);
	}
	try {
		await db.query(`CREATE TABLE IF NOT EXISTS experiments 
			(id uuid PRIMARY KEY DEFAULT uuid_generate_v4 (), 
			creator_id uuid, 
			notes text, 
			description text, 
			created_at bigint NOT NULL, 
			updated_at bigint, 
			deleted_at bigint NOT NULL DEFAULT 0, 
			start_time bigint, 
			FOREIGN KEY (creator_id) REFERENCES users (id))`);
	} catch (err) {
		console.log(err);
	}
	try {
		await db.query(`CREATE TABLE IF NOT EXISTS devices_experiments 
			(experiment_id uuid NOT NULL, 
			device_id uuid NOT NULL, 
			created_at bigint NOT NULL, 
			updated_at bigint, 
			deleted_at bigint NOT NULL DEFAULT 0, 
			PRIMARY KEY (experiment_id, device_id, deleted_at), 
			FOREIGN KEY (device_id) REFERENCES users (id), 
			FOREIGN KEY (experiment_id) REFERENCES experiments (id))`);
	} catch (err) {
		console.log(err);
	}
	try {
		await db.query(`CREATE TABLE IF NOT EXISTS output_types 
			(id uuid PRIMARY KEY DEFAULT uuid_generate_v4 (), 
			output_type_name VARCHAR (100) NOT NULL, 
			units VARCHAR (100), 
			created_at bigint NOT NULL, 
			updated_at bigint, 
			deleted_at bigint NOT NULL DEFAULT 0, 
			UNIQUE (output_type_name, deleted_at))`);
	} catch (err) {
		console.log(err);
	}
	try {
		await db.query(`CREATE TABLE IF NOT EXISTS device_outputs 
			(id uuid PRIMARY KEY DEFAULT uuid_generate_v4 (), 
			experiment_id uuid NOT NULL, 
			device_id uuid NOT NULL, 
			output_type_id uuid NOT NULL, 
			output_value decimal NOT NULL, 
			timestamp bigint NOT NULL, 
			created_at bigint NOT NULL, 
			updated_at bigint, 
			deleted_at bigint NOT NULL DEFAULT 0, 
			FOREIGN KEY (device_id) REFERENCES users (id), 
			FOREIGN KEY (output_type_id) REFERENCES output_types (id), 
			FOREIGN KEY (experiment_id) REFERENCES experiments (id))`);
	} catch (err) {
		console.log(err);
	}
	try {
		await db.query(`CREATE TABLE IF NOT EXISTS user_inputs 
			(description text NOT NULL, 
			timestamp bigint NOT NULL, 
			experiment_id uuid NOT NULL, 
			device_id uuid NOT NULL, 
			user_id uuid NOT NULL, 
			created_at bigint NOT NULL, 
			updated_at bigint, 
			deleted_at bigint NOT NULL DEFAULT 0, 
			FOREIGN KEY (experiment_id) REFERENCES experiments (id), 
			FOREIGN KEY (device_id) REFERENCES users (id), 
			FOREIGN KEY (user_id) REFERENCES users (id))`);
	} catch (err) {
		console.log(err);
	}

	try {
		await db.query(`CREATE OR REPLACE VIEW sanitized_users AS SELECT id, name, email, access_level, created_at, updated_at, deleted_at from users`)
	} catch (err) {
		console.log(err);
	}
	
	try {
		var accessLevels = [['default', 'Default'], ['authorized_device', 'Authorized Device'], ['elevated_user', 'Elevated User'], ['admin_user', 'Admin User']]
		for (i = 0; i < accessLevels.length; i ++) {
			let time = new Date().getTime();
			await db.query(`INSERT INTO user_access (access_level, access_name, description, created_at, updated_at) VALUES ($1, $2, $3, $4, $4) ON CONFLICT (access_level) DO NOTHING`, [i, accessLevels[i][0], accessLevels[i][1], time]);
		}
	} catch (err) {
		console.log(err);
	}

	try {
		await db.query(`UPDATE users SET access_level = (SELECT access_level from user_access where access_name = $1) where email = $2 and deleted_at = 0`, ['admin_user', 'test@admin.com']);
	} catch (err) {
		console.log(err);
	}
	
	console.log("Table creation finished properly");
	process.exit();
}
