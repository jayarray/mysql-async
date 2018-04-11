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
    this.connection = connection;
  }

  /** 
   * @returns {Promise} Returns a Promise that resolves if connection is established. Otherwise it returns an error.
   */
  IsConnected() {
    return new Promise((resolve, reject) => {
      this.connection.connect((error) => {
        if (error)
          reject(`Connection error: ${error}`);
        resolve();
      })
    });
  }

  /**
   * Query the database.
   * @param {string} sql SQL query
   * @returns {Promise<SelectResult>} Returns a Promise that returns a SelectResult object if successful. Otherwise, it returns an error.
   */
  RowReturningQuery(sql) {
    let error = VALIDATE.IsStringInput(sql);
    if (error)
      return Promise.reject(`Query failed: sql string is ${error}`);

    return new Promise((resolve, reject) => {
      this.connection.query(sql, (error, result, fields) => {
        if (error)
          reject(`Query failed: ${error}`);
        resolve(RESULTS.CreateSelectResult(result, fields));
      });
    });
  }

  /**
   * Query the database.
   * @param {string} sql SQL query
   * @returns {Promise<CrudResult>} Returns a Promise that returns a CrudResult object if successful. Otherwise, it returns an error.
   */
  InfoReturningQuery(sql) {
    let error = VALIDATE.IsStringInput(sql);
    if (error)
      return Promise.reject(`Query failed: sql string is ${error}`);

    if (sql.toLowerCase().startsWith('select'))
      return Promise.reject(`Query failed: sql string cannot be a SELECT statement`);

    return new Promise((resolve, reject) => {
      this.connection.query(sql, (error, result) => {
        if (error)
          reject(`Query failed: ${error}`);
        resolve(RESULTS.CreateCrudResult(result));
      });
    });
  }
}

/**
 * Create a DbConnection object with provided credentials.
 * @param {string} host Host name
 * @param {string} user User name
 * @param {string} password Password
 * @returns {Promie<DbConnection>} Returns a DbConnection object is successful. Otherwise, it returns an error.
 */
function Create(host, user, password) {
  let error = VALIDATE.IsInstance(host);
  if (error)
    return Promise.reject(`Failed to create a connection: host is ${error}`);

  if (typeof host != 'string')
    return Promise.reject(`Failed to create a connection: host must be a string`);

  error = VALIDATE.IsInstance(user);
  if (error)
    return Promise.reject(`Failed to create a connection: user is ${error}`);

  if (typeof user != 'string')
    return Promise.reject(`Failed to create a connection: user must be a string`);

  error = VALIDATE.IsInstance(password);
  if (error)
    return Promise.reject(`Failed to create a connection: password is ${error}`);

  if (typeof host != 'string')
    return Promise.reject(`Failed to create a connection: password must be a string`);

  let connection = MYSQL.createConnection({
    host: host,
    user: username,
    password: password
  });

  return Promise.resolve(new DbConnection(connection));
}

//----------------------------------
// EXPORTS

exports.Create = Create;