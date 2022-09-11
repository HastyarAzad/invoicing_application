const mysql2 = require("mysql2");

// getting database credentials 
// var mysqlHost = process.env.MYSQL_HOST || 'mysql_server';
// var mysqlPort = process.env.MYSQL_PORT || '3306';
// var mysqlUser = process.env.MYSQL_USER || 'hastyar';
// var mysqlPass = process.env.MYSQL_PASS || 'password';
// var mysqlDB = process.env.MYSQL_DB || 'invoicing';


var mysqlHost = process.env.MYSQL_HOST || 'localhost';
var mysqlPort = process.env.MYSQL_PORT || '3306';
var mysqlUser = process.env.MYSQL_USER || 'root';
var mysqlPass = process.env.MYSQL_PASS || 'password';
var mysqlDB = process.env.MYSQL_DB || 'invoicing';

// creating a config variable
var connectionOptions = {
  host: mysqlHost,
  port: mysqlPort,
  user: mysqlUser,
  password: mysqlPass,
  database: mysqlDB
};

// creating a connection
var db = mysql2.createConnection(connectionOptions);

module.exports = db;