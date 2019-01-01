import { createHashHistory, createBrowserHistory } from 'history';
import url from 'url-composer';

/**
 * Run middlewares
 * 
 * @param {Array} middlewares 
 */
function middleware(middlewares, { from, to }, response = null) {
	let next = (data) => response = data instanceof Function? data(): data;
	/** assert Middleware */
	if(middlewares.length) {
		for(let i=0; i<middlewares.length; i++) {
			middlewares[i]({ to, from, next, response });
			if(!response) return false;
		}
		/** Passed all middlewares */
		return response;
	}
	/** Midlewares are empty */
	else return true;
}

/**
 * Assert
 * 
 * @param {HistoryRouter} router
 * @param {Location} to
 */
function assert(router, to) {
	/** Initialize */
	let response = false,
			path = `${to.pathname}${to.search}${to.hash}`,
			where = { 
				to, 
				from: router.history.location 
			};
	;
	for(let i=0; i<router.routes.length; i++) {
		/** Current Route */
		let route = router.routes[i],
		 		is = url.test(router.options.hash 
					? { path: `/#/${route.path}`, url: `/#/${path}` }
					: { path: route.path, url: path }
				)
		;
		if(is) {
			/** Global middlewares */
			if(response = middleware(router.middlewares, where)) {
				/** Route middlewares */
				if(route.middlewares.length) {
					response = middleware(route.middlewares, where, response);
				}
			}
			return response
				? (location) => route.callback({
						location, 
						params: url.parse({ path, definition: route.path, object: true }), 
						response 
					})
				: false;
		}
	};
}

/**
 * Register history event handlers
 * 
 * @param {HistoryRouter} router 
 */
async function init(router) {
	let response = false;
	/** Blocking */
	router.history.block((location) => response = assert(router, location));
	/** Listening */
	await router.history.listen((location) => response? response(location): null)
	/** init: 'when('/' ...)' */
	router.history.replace('/');
}

class HistoryRouter {

	/**
	 * Create Router Instance
	 * 
	 * @param {Object} options 
	 */
	 constructor(options = {}) {

		/** Default */
		this.options = {
			hash: options.hasOwnProperty('hash')
				? options.hash
				: true,
			history: options.hasOwnProperty('history')
				? options.history
				: {}
		};

		/** Global middlewares */
		this.middlewares = new Array(); 

		/** Registered routes */
		this.routes = new Array(); 

		/** History */
		this.history = this.options.hash
			? createHashHistory(this.options.history)
			: createBrowserHistory(this.options.history)
		;

		/** Register history event handlers */
		init(this);
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
		this.routes.push({ path, callback, middlewares });
		return this;
	}

	/**
	 * Register global middleware
	 * 
	 * @param {Function} callback 
	 */
	middleware(callback) {
		/** Global middleware */
		this.middlewares.push(callback);
		return this;
	}
}

/** Only for CDN, or Bower */
window.HistoryRouter = HistoryRouter;

export default HistoryRouter;