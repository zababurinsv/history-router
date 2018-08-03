const 
  Util = require('./util'),
  request = require('./request'),
  Middleware = require('./middleware')
;

function Method() {
  /** empty */
}


/** 
 * Processing url params and formData for 'get' method
 * @static
 * 
 * @param {object} router - router
 * @param {object} option - path option
 * @param {string} query - URL query string
 * @param {object} state - state
 */
Method.get = function(router, option, query, state) {
  let redirect = function(path, state) {
    router.history.push(path, state);
  }
  /** Setting Router */
  request.setRouter(router);
  let 
    urlParams = Util.parseQueryString(query),
    data = new Object({ params: urlParams, redirect, request: request.request });
  ;
  if(state !== undefined && state) {
    if(state.formData !== undefined && state.formData) {
      Object.assign(data, { formData: state.formData });
    }
    else {
      Object.assign(data, { state });
    }
  }
  new Promise(function(resolve, reject) {
    let isPassed = Middleware.run(data, router, option);
    isPassed? resolve(isPassed): reject();
  }).then(function() {
    /** Clear */
    router._wrapper.innerHTML = new String();
    /** Addding done function */
    let done = function(response) {
      if(response) {
        if(Util.isElement(response)) {
          router._wrapper.appendChild(response);
        }
        else {
          router._wrapper.innerHTML = response;
        }
      }
    }
    Object.assign(data, { done });
    /** call the callback which is registered */
    typeof option.params === 'function'
      ? option.params(data)
      : null
    ;
  });
}


/** 
 * for FormData and Anchor with POST
 * @static
 * 
 * @param {object} router - router
 * @param {object} option - path option
 * @param {string} formData - form data
 * @param {object} params - params
 */
Method.post = function(router, option, params) {
  let redirect = function(path, state) {
    router.history.push(path, state);
  }
  /** Setting Router */
  request.setRouter(router);
  /** global Middleware */
  let
    data = { redirect, request: request.request }
  ;
  Object.assign(data, params);
  new Promise(function(resolve, reject) {
    let isPassed = Middleware.run(data, router, option);
    isPassed? resolve(isPassed): reject();
  }).then(function() {
    /** call the callback which is registered */
    typeof option.params === 'function'
      ? option.params(data)
      : null
    ;
  })
}

module.exports = Method;