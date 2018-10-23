let mysql = require('mysql');
let VALIDATE = require('./validate.js');
let RESULTS = require('./results.js');
let CONNECTION = require('./connection.js').Connection;

//------------------------------------
// CONNECTION

class PoolConnection {
  constructor(pConn) {
    this.connection_ = pConn;
  }

  /** 
   * @returns {Promise} Returns a Promise that resolves if connection is established. Otherwise it returns an error.
   */
  IsConnected() {
    return new Promise((resolve, reject) => {
      this.connection_.connect((error) => {
        if (error)
          reject(`Connection error: ${error}`);
        else
          resolve();
      });
    });
  }

  /**
   * Query the database with a SQL statement that will return rows.
   * @param {string} sql SQL query
   * @returns {Promise<RowsResult>} Returns a Promise that returns a RowsResult object if successful. Otherwise, it returns an error.
   */
  RowReturningQuery(sql) {
    let error = VALIDATE.IsStringInput(sql);
    if (error)
      return Promise.reject(`Query failed: sql string is ${error}`);

    return new Promise((resolve, reject) => {
      this.connection_.query(sql, (error, result, fields) => {
        if (error)
          reject(`Query failed: ${error}`);
        else
          resolve(RESULTS.CreateRowsResult(result, fields));
      });
    });
  }

  /**
   * Query the database with a SQL statement that only makes changes to the database and does not return rows.
   * @param {string} sql SQL query
   * @returns {Promise<InfoResult>} Returns a Promise that returns a InfoResult object if successful. Otherwise, it returns an error.
   */
  InfoReturningQuery(sql) {
    let error = VALIDATE.IsStringInput(sql);
    if (error)
      return Promise.reject(`Query failed: sql string is ${error}`);

    return new Promise((resolve, reject) => {
      this.connection_.query(sql, (error, result) => {
        if (error)
          reject(`Query failed: ${error}`);
        else
          resolve(RESULTS.CreateInfoResult(result));
      });
    });
  }

  /**
   * Releases connection back into connection pool.
   */
  Release() {
    this.connection_.release();
  }
}

//-------------------------------------
// POOL

class Pool {
  /**
   * Create a MySQL connection pool.
   * @param {string} user 
   * @param {string} host 
   * @param {string} database 
   * @param {string} password 
   * @param {number} connectionLimit Number of max connections to the database.
   */
  constructor(user, host, database, password, connectionLimit) {
    this.pool_ = mysql.createPool({
      user: user,
      host: host,
      database: database,
      password: password,
      connectionLimit: connectionLimit, //important
      debug: false
    });
  }

  /**
   * @returns {PoolConnection} Returns a PoolConnection object if successful. Else, it returns null.
   */
  GetConnection() {
    let pConn = this.pool_.getConnection((err, connection) => {
      if (err)
        return null;
      else
        return connection;
    });

    return new PoolConnection(pConn);
  }
}

//------------------------------
// EXPORTS

exports.Pool = Pool;