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
  Tag = require('../classes/tag')
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
 * @param {Function} callback - Pushed state and onLoad; callback
 * @param {Array} middlewares - Base path route middlewares
 */

/**
 * OPTIONS
 * 
 * base - base path
 * el - wrapper element
 */

Router.prototype.init = function(options, callback, middlewares) {
  this._wrapper = document.querySelector(options.el);
  /** history.js */ 
  this.history = createHistory({
    basename: '/'
  });
  /** Router */
  let 
    _self = this
  ;
  /** Register base */
  _self.get('/', function(params) {
    let view = _self._wrapper.querySelector('*[data-role="router-view"]');
    view.innerHTML = new String();
    callback(params);
  }, middlewares || new Array());
  /** Tags */
  Tag.form(_self); Tag.anchor(_self);
  /** history.listen */
  Core.listen(_self);
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
  router._paths.forEach(function(option, i) {
    option.path = path.join(base, option.path);
    _self._paths.push(option);
  });
  /** Middlewares */
  router._middlewares.forEach(function(middleware) {
    _self._middlewares.push(middleware);
  });
}

module.exports = Router;