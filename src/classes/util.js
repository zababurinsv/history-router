/**
 * @author Mansu Jeong <pronist@naver.com>
 * @copyright Copyright (C) 2017 - 2018 Mansu Jeong. All rights reserved.
 * @license MIT
 */

/** 
 * history-router Util
 * @class
 */
function Util() {
  /** emtpy */
}

/**
 * Parsing query string
 * @static
 * 
 * @param {string} url - URL Query string
 * 
 * @return {object} - parsed Object
 */
Util.parseQueryString = function(url) {
  let
    result = {},
    searchIndex = url.indexOf("?")
  ;
  if (searchIndex == -1 ) {
    return result;
  } 
  let 
    sPageURL = url.substring(searchIndex +1),
    sURLVariables = sPageURL.split('&'),
    sParameterName = new Array()
  ;
  for (let i = 0; i < sURLVariables.length; i++) {       
    sParameterName = sURLVariables[i].split('=');
    result[sParameterName[0]] = sParameterName[1];
  }
  return result;
}


/**
 * Getting path without domain
 * @static
 * 
 * @param {string} _path - URL full path
 * 
 * @return {string} - path
 */
Util.getPathWithoutDomain = function(_path) {
  let
    _location = null,
    _regex = /https?:\/\/[^\/]*/
  ;
  if(_path.search(_regex) > -1) {
    _location = _path.split(_regex)[1]
  }   
  let _url = _location !== undefined && _location 
    ? _location
    : _path
  ;
  return _url;
}


/**
 * Check Element
 * @static
 * 
 * @param {object} object - anything
 */
Util.isElement = function(o) {
  return (
    typeof HTMLElement === "object" ? o instanceof HTMLElement : //DOM2
    o && typeof o === "object" && o !== null && o.nodeType === 1 && typeof o.nodeName==="string"
  );
}

module.exports = Util;