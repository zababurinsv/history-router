import { createHashHistory, createBrowserHistory } from 'history';
import url from 'url-composer';

class HistoryRouter {
  /**
   * Create this Instance
   * 
   * @param {Object} options
   */
   constructor(options = {}) {
     
    /** Default */
    this.options = {
      hash: options.hasOwnProperty('hash')
        ? options.hash
        : true
    };
    
    /** History */
    this.history = this.options.hash
      ? createHashHistory(this.options.history)
      : createBrowserHistory(this.options.history)
    ;
    
    /** Blocking */
    this.history.block(location => {
      /** Initialize */
      let path = `${location.pathname}${location.search}${location.hash}`,
          where = { 
            to: location, 
            from: this.history.location 
          },
          response = false
      ;
      for(let i = 0; i < this.routes.length; i++) {
        /** Current Route */
        let route = this.routes[i],
            isCorrectUrl = url.test(this.options.hash 
              ? { path: `/#/${route.path}`, url: `/#/${path}` }
              : { path: route.path, url: path }
            )
        ;
        if(isCorrectUrl) {
          /**
           * Run middlewares
           * 
           * @param {Array} middlewares 
           */
          let middleware = (middlewares, { from, to }, response = null) => {
            /** assert Middleware */
            if(middlewares.length) {
              let next = data => response = data instanceof Function? data(): data;
              for(let i = 0; i < middlewares.length; i++) {
                middlewares[i]({ to, from, next, response });
                if(!response) {
                  return false;
                }
              }
              /** Passed all middlewares */
              return response;
            } else {
              /** Midlewares are empty */
              return true;
            }
          };
          /** Global middlewares */
          if(response = middleware(this.middlewares, where)) {
            /** Route middlewares */
            if(route.middlewares.length) {
              response = middleware(route.middlewares, where, response);
            }
          }
          if(response) {
            return route.callback({
              location, 
              params: url.parse({ path, definition: route.path, object: true }), 
              response
            });
          } else {
            return false;
          }
        }
      };
    });

    /** Registered routes */
    this.routes = new Array();

    /** Global middlewares */
    this.middlewares = new Array(); 
  }

  /**
   * Register Route
   * 
   * @param {String} path 
   * @param {Function} callback 
   * @param {Array} middlewares 
   */
  when(path, callback, middlewares = []) {
    /** Route */
    this.routes.push({ path, callback, middlewares });
    return this;
  }

  /**
   * Register global middleware
   * 
   * @param {Function} callback 
   */
  middleware(callback) {
    /** Global middleware */
    this.middlewares.push(callback);
    return this;
  }
}

/** Only for CDN, or Bower */
window.HistoryRouter = HistoryRouter;

export default HistoryRouter;