const mysql = require("mysql");

const connection = () => {
    const con = mysql.createConnection({
        connectionLimit: 100,
        host: 'letslearnlive.cr2wbmrderov.us-east-1.rds.amazonaws.com',
        port: '3306',
        user: 'root',
        password: 'password',
        database: 'letslearnlive'
    });
    return con;
}

exports.connection = connection;


