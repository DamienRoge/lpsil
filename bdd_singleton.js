// bdd_singleton.js
// ========


/**
 *
 * @param query
 */
module.exports.doQuery = function (query,callback) {

    var mysql = require('mysql');
    console.log("query : ----------------------");
    console.log(query);

    var connection = mysql.createConnection({
        host: 'localhost',
        user: 'test',
        password: 'test',
        database: 'web-sem-node'
    });

    // connection.connect();

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

