/**
 * @author Mansu Jeong <pronist@naver.com>
 * @copyright Copyright (C) 2017 - 2018 Mansu Jeong. All rights reserved.
 * @license MIT
 */

;let
  path = require('path')
;

const 
  Core = require('../classes/core'),
  Tag = require('../classes/tag'),
  Method = require('../classes/method')
;

/** history.js */
const 
  createHistory = require('history').createBrowserHistory
;

/**
 * Create Router Ojbect
 * @constructor
 */
function Router() {
  /** public */
  this.history = null;

   /** private */
  this._wrapper = null;
  this._index = null;
  this._paths = new Array();
  this._middlewares = new Array();
}

/**
 * Register 'get' route
 * @method
 * 
 * @param {string} path - route path
 * @param {Function} callback - pushed state callback
 * @param {Array} middlewares - middlewares
 */
Router.prototype.get = function(path, callback, middlewares) {
  this._paths.push({
    path: path,
    params: callback,
    method: 'get',
    middlewares : middlewares || new Array()
  });
}

/**
 * Register 'post' route
 * @method
 * 
 * @param {string} path - route path
 * @param {Function} callback - 'post' URL request callback
 * @param {Array} middlewares - middlewares
 */
Router.prototype.post = function(path, callback, middlewares) {
  this._paths.push({
    path: path,
    params: callback,
    method: 'post',
    middlewares : middlewares || new Array()
  });
}

/**
 * init history-router Router
 * @method
 * 
 * @param {object} options - Router init options
 */

/**
 * OPTIONS
 * 
 * base - base path
 * el - wrapper element
 */

Router.prototype.init = function(options) {
  this._wrapper = document.querySelector(options.el);
  /** history.js */ 
  this.history = createHistory({
    basename: '/'
  });
  /** Tags */
  Tag.form(this); Tag.anchor(this);
  /** history.listen */
  Core.listen(this);
  /** index */
  if(((location.pathname).split('?'))[0] == '/') {
    Method.get(this, this._paths.find(
      function(route) {
        return route.path == '/'
      }), 
    '/', null);
  }
}

/**
 * Register 'middleware'
 * @method
 * 
 * @param {Function} callback - callback
 */
Router.prototype.middleware = function(callback) {
  this._middlewares.push(callback);
}

/**
 * Combine router with base path
 * @method
 * 
 * @param {string} base - base path
 * @param {object} router - history-router Router
 */
Router.prototype.use = function(base, router) {
  let
    _self = this
  ;
  /** Paths */
  router._paths.forEach(function(route, i) {
    route.path = path.join(base, route.path);
    _self._paths.push(route);
  });
  /** Middlewares */
  router._middlewares.forEach(function(middleware) {
    _self._middlewares.push(middleware);
  });
}

module.exports = Router;