class Middleware {
  /**
   * Create Middleware Instance
   */
  constructor(cb) {
    /**
     * @property {Function}
     */
    this.cb = cb;
  }

  /**
   * Run middleware
   * 
   * @param {Object} location 
   * @param {*} response
   * 
   * @return {*}
   */
  run({ from, to }, response = null) {
    return this.cb({ from, to, response });
  };
}

export default Middleware;