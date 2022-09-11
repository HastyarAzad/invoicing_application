#!/bin/sh
echo "Waiting for mysql to start..."
./wait-for mysql_server:3306

echo "installing db-migration"
npm install -g db-migrate


echo "Migrating the databse..."
npm run db:up 

echo "Starting the server..."
npm start 