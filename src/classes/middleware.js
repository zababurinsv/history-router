
function Middleware() {
  /** empty */
}


/** 
 * Global, or Route Middleware processing 
 * @static
 * 
 * @private
 * 
 * @param {object} data - callback parameters
 * @param {object} router - router
 * @param {string} route - route meta
 * @param {boolean} isRoute - route? global?
 */
Middleware.__middleware = function(data, router, route, isRoute) {
  let 
    middleware = data,
    isPassed = false
  ;
  let next = function(is) {
    isPassed = is;
  }
  Object.assign(middleware, { next });
  let iterator = 0;
  if(isRoute) {
    /** Route Middleware */
    do {
      route.middlewares[iterator](middleware); 
      iterator++;
    } while((iterator < route.middlewares.length) && isPassed)
  }
  else {
    /** Global Middleware */
    do {
      router._middlewares[iterator](middleware);
      iterator++;   
    } while((iterator < router._middlewares.length) && isPassed)
  }
  return isPassed;
}

/** 
 * Global, or Route Middleware processing 
 * @static
 * 
 * @public
 * 
 * @param {object} data - callback parameters
 * @param {object} router - router
 * @param {string} route - route
 */
Middleware.run = function(data, router, route) {
  /** Global middleware */
  let isPassed = router._middlewares.length == 0
    ? true
    : Middleware.__middleware(data, router, route, false)
  ;
  /** Route middleware */
  if(isPassed || router._middlewares.length == 0) {
    isPassed = route.middlewares.length == 0
      ? true
      : Middleware.__middleware(data, router, route, true)
    ;
  }
  return isPassed;
}


module.exports = Middleware;