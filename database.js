const mysql = require('mysql');

const DBName = 'ghost';
const DBConfig = {
    host: "0.0.0.0",
    user: "root",
    password: "",
    database: DBName,
};

const query = sql => {
    return new Promise( ( resolve, reject ) => {
        let connection = mysql.createConnection(DBConfig);
        connection.query( sql, ( err, rows ) => {
            if ( err ) {
                connection.end();
                reject( err );
            }
            else {
                connection.end();
                resolve( rows );
            }
        });
    });
}

module.exports.query = query;