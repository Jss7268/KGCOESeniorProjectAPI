# EDCS Back-end
[EDCS Frontend](https://github.com/Jss7268/KGCOESeniorProjectWeb)

## Prerequisites
You need to install node/npm and postgresql
```
sudo apt-get update
sudo apt-get install npm postgresql postgresql-contrib
curl -sL https://deb.nodesource.com/setup_10.x | sudo -E bash -
sudo apt install nodejs
```

## Before running
You need to copy the `.env.example` file:
```
cp .env.example .env
```
__Don't edit the `.env.example` file, instead, make changes to the `.env` file__

If you want to run the backend using ssl, follow [these instructions](https://www.nginx.com/blog/using-free-ssltls-certificates-from-lets-encrypt-with-nginx/) to generate certificates. Then update `SSL_PRIVATE_KEY` and `SSL_PUBLIC_KEY` with the locations of the generated `.pem` files. __*You need to make sure that the user that is running the backend has read access to the private key file.__

If running locally or without ssl, remove the line containing `USE_HTTPS=true`

To generate secret Json Web Tokens ([JWT](https://jwt.io/introduction/)), you should generate a new secret of length 32 and update `SECRET` with its value. You can use a CodeIgniter Encryption Key from https://randomkeygen.com/ 

If you are deploying the front-end (not localhost), then change the `ALLOWED_ORIGINS` to the location of the [frontend](https://github.com/Jss7268/KGCOESeniorProjectWeb)

### Setting up postgresql
Assuming you have postgres installed, connect to postgres
```
sudo -u postgres psql
```
The next step is to set the password. __*This will be stored in the `.env` file__
```
\password
```
Next lets create the database
```
CREATE DATABASE edcs;
```
And quit
```
\q
```
Now that we have a password, we need to set the authentication method to use the password.
Find the `pg_hba.conf` file with:
```
locate pg_hba.conf
```
And change the line
```conf
local   all             postgres                                peer
```
To:
```
local   all             postgres                                md5
```
Now restart postgres
```
sudo service postgresql restart
```
When connecting to postgres using `psql -U postgres`, it should prompt for your password.

Now reopen the `.env` file and change the `PASSWORD` to the password you just set.
Now populate the database with the necessary tables.
```
node createTables.js
```

## Running the backend
To run quickly, just run the command:
```
node server
```
OR
To start a daemon you can use [pm2](https://www.npmjs.com/package/pm2).
```
npm install pm2 -g
pm2 start server.js --name edcs
```
To check the status
```
pm2 status edcs
```

