/**
 * @author Mansu Jeong <pronist@naver.com>
 * @copyright Copyright (C) 2017 - 2018 Mansu Jeong. All rights reserved.
 * @license MIT
 */

const 
  Method = require('./method')
;


/** 
 * history-router Core
 * @constructor
 */
function Core() {
  /** emtpy */
}

/** 
 * the 'listen' of History.js 
 * @static
 * 
 * @param {object} router - history-router.Router
 */
Core.listen = function(router) {
  router.history.listen(function(location) {
    /** clear */
    let view = router._wrapper.querySelector('*[data-role="router-view"]');
    view.innerHTML = new String();
    /** find route path */
    for(let i =0; i< router._paths.length; i++ ) {
      let
        route = router._paths[i]
      ;
      if(((location.pathname).split('?'))[0] == `${route.path}`) {
        if(route.method == 'get') {
          /** parse query string */
          Method.get(router, route, location.search, location.state);
          break;
        }
      }
    };
  });
}

module.exports = Core;