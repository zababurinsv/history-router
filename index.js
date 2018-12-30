import { createHashHistory, createBrowserHistory } from 'history';
import url from 'url-composer';

/**
 * Run middlewares
 * 
 * @param {Array} middlewares 
 */
function middleware(middlewares) {
  let isPassed = false;
  /** assert Middleware */
  if(middlewares.length) {
    for(let i=0; i<middlewares.length; i++) {
      isPassed = middlewares[i]();
      if(!isPassed) return false;
    }
    return isPassed;
  }
  else return true;
}

/**
 * Assert
 * 
 * @param {HistoryRouter} router
 * @param {String} path
 * @param {Object} state
 */
function assert(router, path, state = undefined) {
  for(let i=0; i<router._routes.length; i++) {
    let route = router._routes[i],
        isHit = url.test(router._options.hash 
          ? { path: `/#/${route.path}`, url: `/#/${path}` }
          : { path: route.path, url: path }
        )
    ;
    if(isHit) {
      let isPassed = false;
      /** Global middlewares */
      if(middleware(router._middlewares)) {
        /** Route middlewares */
        isPassed = middleware(route.middlewares);
      };
			/** It's passed all middlewares? */
      if(isPassed) {
        return {
          callback: route.callback,
          state,
          params: url.parse({ path, definition: route.path, object: true })
        };
      }
      else return false;
    }
  };
}

class HistoryRouter {

	/**
	 * Create Router Instance
	 * 
	 * @param {Object} options 
	 */
	 constructor(options = {}) {

		/** 
		 * private
		 */
		this._options = {
			hash: options.hasOwnProperty('hash')? options.hash: true,
			history: options.hasOwnProperty('history')? options.history: {}
		};
		this._routes = new Array();
		this._middlewares = new Array();

		/** 
		 * public
		 */

		this.history = this._options.hash
			? createHashHistory(this._options.history)
			: createBrowserHistory(this._options.history)
		;

		let self = this,
				isVerified = false
		;
		/** Assert before ... */
		this.history.block((location) => {
			/** Check routed path whether middleware is passed */
			return isVerified = assert(self, `${location.pathname}${location.search}${location.hash}`, location.state);
		});
		(async function(self) {
			/** Listening */
			await self.history.listen((location) => {
				if(isVerified) {
					isVerified.callback({ state: isVerified.state, params: isVerified.params });
				}
			});
			/** init: 'when('/' ...)' */
			self.history.replace('/');
		})(this);
	}

	/**
	 * Register Route
	 * 
	 * @param {String} path 
	 * @param {Function} callback 
	 * @param {Array} middlewares 
	 */
	when(path, callback, middlewares = []) {
		/** Route */
		this._routes.push({ path, callback, middlewares });
		return this;
	}

	/**
	 * Register global middleware
	 * 
	 * @param {Function} callback 
	 */
	middleware(callback) {
		/** Global middleware */
		this._middlewares.push(callback);
		return this;
	}
}

/** Only for CDN, or Bower */
window.HistoryRouter = HistoryRouter;

export default HistoryRouter;