import { createHashHistory, createBrowserHistory } from 'history';
import url from 'url-composer';

import Route from './lib/Route';
import Middleware from './lib/Middleware';

class HistoryRouter {
  /**
   * Create HistoryRouter Instance
   * 
   * @param {Boolean} hash
   */
   constructor(hash) {
   /**
     * @property {History} history
     */
    this.history = hash? createHashHistory(): createBrowserHistory();
    
    /**
     * @property {Route[]}
     */
    this.routes = new Array();

    /**
     * @property {Middleware[]}
     */
    this.middlewares = new Array(); 


    /** Blocking */
    this.history.block(location => this._block(location, hash));
  }

  /**
   * Blocking
   * 
   * @param {Location} location 
   * @param {Boolean} hash
   */
  _block(location, hash) {
    let path = `${location.pathname}${location.search}${location.hash}`,
        to = location, 
        from = this.history.location
    ;
    let response = false;
    for(let i = 0; i < this.routes.length; i++) {
      if(this.routes[i].validate(path, hash)) {
        if(response = this._validateFromMiddlewares(this.middlewares, { to, from })) {
          if(this.routes[i].middlewares.length > 0 && response) {
            response = this._validateFromMiddlewares(
              this.routes[i].middlewares,
              { to, from },
              response
            );
          }
        }
        if(response) {
          return this.routes[i].run(
            { to, from }, 
            url.parse({ path, definition: this.routes[i].path, object: true }), 
            response
          );
        }
        return false;
      }
    }
  }

  /**
   * Validate from middlewares
   * 
   * @param {Middleware[]} middlewares 
   * @param {Object} location 
   * @param {*} response 
   */
  _validateFromMiddlewares(middlewares, { from, to }, response = null) {
    if(middlewares.length > 0) {
      for(let i = 0; i < middlewares.length; i++) {
        response = middlewares[i].run({ to, from }, response);
        if(!response) {
          return false;
        }
      }
      return response;
    }
    return true;
  }

  /**
   * Register Route
   * 
   * @param {String} path 
   * @param {Function} cb 
   * @param {Array} middlewares 
   */
  when(path, cb, middlewares = []) {
    for(let i = 0; i < middlewares.length; i++) {
      middlewares[i] = new Middleware(middlewares[i])
    }
    /** Route */
    this.routes.push(new Route(path, cb, middlewares));
    return this;
  }

  /**
   * Register global middleware
   * 
   * @param {Function} cb 
   */
  middleware(cb) {
    /** Global middleware */
    this.middlewares.push(new Middleware(cb));
    return this;
  }
}

/** Only for CDN, or Bower */
window.HistoryRouter = HistoryRouter;

export default HistoryRouter;