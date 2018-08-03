const
  Util = require('./util'),
  Method = require('./method'),
  serialize = require('form-serialize')
;

function Tag() {
  /** empty */
}


/**
 * Register 'form' Tag for history-router Route
 * @method
 * 
 * @param {Element} router - router
 */
Tag.form = function(router) {
  let 
    forms = document.getElementsByTagName('form')
  ;
  for(let i=0; i < forms.length; i++) {
    forms[i].addEventListener('submit', function(e) {
      let
        _target = e.target,
        _method = _target.getAttribute('method'),
        _path = _target.getAttribute('action'),
        _url = Util.getPathWithoutDomain(_path)
      ;
      for(let i =0; i< router._paths.length; i++ ) {
        let
          option = router._paths[i]
        ;
        /** if same to routed path  */
        if(`${(_url.split('?'))[0]}` == `${option.path}`) {
          e.preventDefault();
          let 
            formData = serialize(_target, { hash: true })
          ;
          /** GET */
          if(option.method == 'get' && _method == 'get') {
            router.history.push(_url, { formData });
            break;
          }
          /** POST */
          else if(option.method == 'post' && _method == 'post') {
            Method.post(router, option, { formData: formData });
          }
        }
      };
    });
  }
}

/**
 * Register 'a' Tag for history-router Route
 * @method
 * 
 * @param {Element} router - router
 */
Tag.anchor = function(router) {
  let
    links = document.getElementsByTagName('a')
  ;
  for(let i=0; i < links.length; i++) {
    /** Getting Attributes */
    let
      _link = links[i].dataset.href == null
        ? links[i].getAttribute('href')
        : links[i].dataset.href
      ,
      _method = links[i].dataset.method == null 
        ? 'get'
        : links[i].dataset.method
      ,
      _params = links[i].dataset.params == null
        ? "{}"
        : links[i].dataset.params
    ;
    /** Click event */
    links[i].addEventListener('click', function(e) {
      e.preventDefault();
      let 
        _url = Util.getPathWithoutDomain(_link)
      ;
      for(let i =0; i< router._paths.length; i++ ) {
        let
          option = router._paths[i]
        ;
        /** if same to routed path  */
        if(`${(_url.split('?'))[0]}` == `${option.path}`) {
          /** GET */
          if(option.method == 'get' && _method == 'get') {
            /** History */
            router.history.push(_url);
            break;
          }
          /** POST */
          else if(option.method == 'post' && _method == 'post') {
            Method.post(router, option, { params: JSON.parse(_params) });
          }
        }
      };
    });
  }
}

module.exports = Tag;