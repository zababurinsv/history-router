/**
 * @author Mansu Jeong <pronist@naver.com>
 * @copyright Copyright (C) 2017 - 2018 Mansu Jeong. All rights reserved.
 * @license MIT
 */

let instance = null;

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
        option = _self._router._paths[i],
        _params = { params: options.params };
      ;
      if(option.method == options.method) {
        /** if location same to routed path  */
        if(((`${options.url}`).split('?'))[0] == `${option.path}`) {
          if(options.method == 'post') {
            let done = function(data) {
              resolve(data);
            };
            Object.assign(_params, { done });
          }
          option.params(_params)
          break;
        }
      }
    };
  })
}

module.exports = Request.__getInstance();