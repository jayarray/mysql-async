let VALIDATE = require('./validate.js');

//----------------------------------------
// For row-returning operations (SELECT, SHOW, etc)

class RowsResult {
  constructor(rows, fields) {
    this.rows_ = rows;
    this.fields_ = fields;
  }

  /** 
   * Get fields objects.
   * @returns {Array} Returns an array of objects describing the columnns (i.e. table its from, name, length, etc).
   */
  Fields() {
    return this.fields_;
  }

  /** 
   * Get column names.
   * @returns {Array<string>} Returns an array of strings.
   */
  ColumnNames() {
    return this.fields_.map(field => field.name);
  }

  /**
   * Get row at the specified index.
   * @param {number} i Desired row index.
   * @returns {Object}
   */
  Row(i) {
    let length = this.rows_.length;
    if (i < 0 || i > length)
      return null;
    return this.rows_[i];
  }

  /** 
   * Get all row objects.
   * @returns {Array} Returns an array of row objects.
   */
  Rows() {
    return this.rows_;
  }

  /**
   * Get rows in a specified index range.
   * @param {number} i Start index
   * @param {number} j End index
   * @returns {Array} Returns an array of row objects. If inputs are invalid, it returns null.
   */
  RowRange(i, j) {
    let length = this.rows_.length;
    if (i < 0 || i > j || j < i || j > length)
      return null;

    if (i == j)
      return this.rows_.slice(i, j);
    return this.rows_.slice(i, j + 1);
  }

  /**
   * Create a RowsResult object.
   * @param {Array} rows An array of results from a SELECT query.
   * @param {Array} fields An array of field objects from a SELECT query.
   * @returns {RowsResult} Returns a RowsResult object. If inputs are invalid, it returns null.
   */
  static Create(rows, fields) {
    if (VALIDATE.IsArray(rows) || VALIDATE.IsArray(fields))
      return null;
    return new RowsResult(rows, fields);
  }
}

//-----------------------------------------
// For MODIFIER operations (CREATE, UPDATE, DELETE, etc)

class InfoResult {
  constructor(resultObj) {
    this.info_ = resultObj;
  }

  /** 
   * @returns {Array<string>} Returns an array of strings corresponding to the name of each property.
   */
  PropertyNames() {
    return Object.keys(this.info_);
  }

  /**
   * @param {string} name The name of the property you want the value of.
   * @returns {Array<string>} Returns an array of strings corresponding to the name of each property.
   */
  PropertyValue(name) {
    return this.info_[name];
  }

  /**
   * Create a InfoResult object.
   * @param {Object} resultObj The result object from a CRUD operation.
   * @returns {InfoResult} Returns a InfoResult object. If inputs are invalid, it returns null.
   */
  static Create(resultObj) {
    if (VALIDATE.IsInstance(resultObj))
      return null;
    return new InfoResult(resultObj);
  }
}

//--------------------------------------
// EXPORTS

exports.CreateRowsResult = RowsResult.Create;
exports.CreateInfoResult = InfoResult.Create;