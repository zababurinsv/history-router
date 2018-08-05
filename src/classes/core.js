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
  if(((location.pathname).split('?'))[0] == '/') {
    /** index */
    Method.get(
      router, 
      router._paths[router._paths.length-1], 
      '/', null
    );
  }
  router.history.listen(function(location) {
    for(let i =0; i< router._paths.length; i++ ) {
      let
        option = router._paths[i]
      ;
      if(((location.pathname).split('?'))[0] == `${option.path}`) {
        if(option.method == 'get') {
          /** parse query string */
          Method.get(router, option, location.search, location.state);
          break;
        }
      }
    };
  });
}

module.exports = Core;