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
    forms = router._wrapper.querySelectorAll('form[data-role="router-form"]')
  ;
  for(let i=0; i < forms.length; i++) {
    let form = {
      method: forms[i].getAttribute('method') || 'get',
      path: forms[i].getAttribute('action') || '/',
    }
    forms[i].addEventListener('submit', function(e) {
      let
        url = Util.getPathWithoutDomain(form.path)
      ;
      for(let i =0; i< router._paths.length; i++ ) {
        let
          route = router._paths[i]
        ;
        /** if same to routed path  */
        if(`${(url.split('?'))[0]}` == `${route.path}`) {
          e.preventDefault();
          let 
            formData = serialize(e.target, { hash: true })
          ;
          /** GET */
          if(route.method == 'get' && form.method == 'get') {
            router.history.push(url, { formData });
            break;
          }
          /** POST */
          else if(route.method == 'post' && form.method == 'post') {
            Method.post(router, route, { formData });
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
    links = router._wrapper.querySelectorAll('a[data-role="router-link"]')
  ;
  for(let i=0; i < links.length; i++) {
    /** Getting Attributes */
    let anchor = {
      link: links[i].dataset.href || links[i].getAttribute('href'),
      method: links[i].dataset.method || 'get',
      params: links[i].dataset.params || '{}'
    }
    /** Click event */
    links[i].addEventListener('click', function(e) {
      e.preventDefault();
      let 
        _url = Util.getPathWithoutDomain(anchor.link)
      ;
      for(let i =0; i< router._paths.length; i++ ) {
        let
          route = router._paths[i]
        ;
        /** if same to routed path  */
        if(`${(_url.split('?'))[0]}` == `${route.path}`) {
          /** GET */
          if(route.method == 'get' && anchor.method == 'get') {
            /** History */
            router.history.push(_url);
            break;
          }
          /** POST */
          else if(route.method == 'post' && anchor.method == 'post') {
            Method.post(router, route, { params: JSON.parse(anchor.params) });
          }
        }
      };
    });
  }
}

module.exports = Tag;