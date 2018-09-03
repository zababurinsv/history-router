/**
 * @author Mansu Jeong <pronist@naver.com>
 * @copyright Copyright (C) 2017 - 2018 Mansu Jeong. All rights reserved.
 * @license MIT
 */

let instance = null;

const 
  Middleware = require('./middleware')
;

/** 
 * history-router Request
 * @class
 */
function Request() {  
  /** Router */
  this._router = null;
}

/**
 * Getting Request Singleton Instacne
 * @static
 */
Request.__getInstance = function() {
  if(instance !== undefined && instance) {
    return instance;
  }
  else {
    instance = new Request();
    return instance;
  }
}

/**
 * Setting history-router.Router
 * @method
 * 
 * @param {object} router - Route Object
 */
Request.prototype.setRouter = function(router) {
  this._router = router;
}

/**
 * 'get' request about Router of history-router
 * @method
 * 
 * @param {object} options - Request options
 */

 /** OPTIONS
  * 
  * url - request path
  * param - parameters
  * method - http method -> 'get', or 'post'
  */
Request.prototype.request = function(options) {
  options = {
    url: options.url || '/',
    params: options.params || {},
    method: options.method || 'get'
  };
  let 
    _self = Request.__getInstance()
  ;
  return new Promise(function(resolve, reject) {
    for(let i =0; i< _self._router._paths.length; i++ ) {
      let
        route = _self._router._paths[i],
        data = { params: options.params }
      ;
      if(route.method == options.method) {
        /** if location same to routed path  */
        if(((`${options.url}`).split('?'))[0] == `${route.path}`) {
          if(options.method == 'post') {
            let done = function(response) {
              resolve(response);
            };
            Object.assign(data, { done });
          }
          new Promise(function(resolve, reject) {
            let isPassed = Middleware.run(data, _self._router, route);
            isPassed
              ? resolve(isPassed)
              : reject()
            ;
          }).then(function() {
            /** call the callback which is registered */
            typeof route.params === 'function'
              ? route.params(data)
              : null
            ;
          })
          break;
        }
      }
    };
  })
}

module.exports = Request.__getInstance();