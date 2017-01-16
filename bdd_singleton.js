// bdd_singleton.js
// ========


/**
 *
 * @param query
 */
module.exports.doQuery = function (query,callback) {

    var mysql = require('mysql');


    var connection = mysql.createConnection({
        host: 'localhost',
        user: 'test',
        password: 'test',
        database: 'web-sem-node'
    });

    // connection.connect();


    var monReturn = "ERROR BUDDY";

    connection.query(query, callback);

};

/*module.exports = {
 closeConection: function () {
 connection.end();
 return;
 },
 startConnection: function () {
 connection.connect();
 return;
 },
 test: function () {
 return 'toto';
 }
 };*/

