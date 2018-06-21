let MYSQL = require('mysql');
let VALIDATE = require('./validate.js');
let RESULTS = require('./results.js');

//------------------------------
// CONNECTION

class DbConnection {
  /**
   * @param {Object} connection MySql connection object.
   */
  constructor(connection) {
    this.connection_ = connection;
  }

  /** 
   * @returns {Promise} Returns a Promise that resolves if connection is established. Otherwise it returns an error.
   */
  IsConnected() {
    return new Promise((resolve, reject) => {
      this.connection_.connect((error) => {
        if (error)
          reject(`Connection error: ${error}`);
        resolve();
      })
    });
  }

  /**
   * Query the database with a SQL statement that will return rows.
   * @param {string} sql SQL query
   * @returns {Promise<RowsResult>} Returns a Promise that returns a RowsRTesult object if successful. Otherwise, it returns an error.
   */
  RowReturningQuery(sql) {
    let error = VALIDATE.IsStringInput(sql);
    if (error)
      return Promise.reject(`Query failed: sql string is ${error}`);

    return new Promise((resolve, reject) => {
      this.connection_.query(sql, (error, result, fields) => {
        if (error)
          reject(`Query failed: ${error}`);
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

    if (sql.toLowerCase().startsWith('select'))
      return Promise.reject(`Query failed: sql string cannot be a SELECT statement`);

    return new Promise((resolve, reject) => {
      this.connection_.query(sql, (error, result) => {
        if (error)
          reject(`Query failed: ${error}`);
        resolve(RESULTS.CreateInfoResult(result));
      });
    });
  }

  /**
   * Create a DbConnection object with provided credentials.
   * @param {string} host Host name
   * @param {string} user User name
   * @param {string} password Password
   * @returns {Promie<DbConnection>} Returns a DbConnection object is successful. If inputs are invalid, it returns null.
   */
  static Create(host, user, password, database) {
    if (
      VALIDATE.IsInstance(host) ||
      typeof host != 'string' ||
      VALIDATE.IsInstance(user) ||
      typeof user != 'string' ||
      VALIDATE.IsInstance(password) ||
      typeof host != 'string' ||
      VALIDATE.IsInstance(database) ||
      typeof database != 'string'
    )
      return null;

    let connection = MYSQL.createConnection({
      host: host,
      user: user,
      password: password,
      database: database
    });

    return new DbConnection(connection);
  }
}

//----------------------------------
// EXPORTS

exports.Create = DbConnection.Create;