# history-router

Router for history

# Installation

with **Node.js**

```bash
npm install --save history-router
```

# Basic usage

```html
<div id="app">
  <a href="/user" data-role="router-link">user</a>
  <div data-role="router-view"></div>
</div>
```

```javascript
const historyRouter = require('history-router');

/** history-router Router **/
const Router = new historyRouter.Router();
// ...

Router.get('/', ({ done }) => {
  done('<h1>INDEX</h1>');
});

Router.init({ el: '#app' });
```

# Methods

### Router

#### Router.init(options: object, callback: Function, middlewares: Array)

You must call ```Router.init``` for initialing Router.

##### Parameters

* options: object - Router init options.

##### Options

* el: string - wrapper element

##### Usage

```html
<div id="app"></div>
```

```javascript
Router.init({ el: '#app' });
```

#### Router.get(path: string, callback: Function, middlewares: Array)

**It's not real http request**

##### Parameters

* path: Route path.
* callback: Route Callback.
* middlewares: Route **middlewares**.

##### Usage

```javascript
Router.get('/user', ( /** Parameters */ ) => {
  // ...
}, [ /* middleware: Function */ ])
```

#### Router.post(path: string, callback: Function, middlewares: Array)

**It's not real http request**

##### Parameters

* path: Route path.
* callback: Callback after **request**.
* middlewares: Route **middlewares**. 

##### Usage

```javascript
Router.post('/user/create', ( /** Parameters */ ) => {
  // ...
}, [ /* middleware: Function */ ])
```

#### Router.use(path: string, router: historyRouter.Router)

##### Parameters

* path: Route base path.
* router: The router which will be combined.

##### Usage

```javascript
const user = require('./user');

// path.join('/user', __ROUTE_PATH__)
Router.use('/user', user);
```

#### Router.middleware(callback: Function)

Setting **global** middleware. \
You can use **parameters** such as ```formData```, ```redirect```. \
must call ```next``` function for next middleware.

##### Parameters

* callback: middleware before Rouing.

##### Usage

```javascript
Router.middleware(({ next }) => {
  // ...

  next(true);
})
```

# Parameters

### params 

#### usage

For ```get``` request

```html
<!-- http://__DOMAIN__/user?name=foo -->
<a href="/user?name=foo" data-role="router-link">user</a>
```

```javascript
Router.get('/user', ({ params }) => {
  // { name: foo }
  console.log(params);
});
```

For ```post``` request

```html
<!-- http://__DOMAIN__/__BASE__/user?name=foo -->
<a href="/user" data-method="post" data-params='{"name":"foo"}' data-role="router-link">user</a>
```

```javascript
Router.post('/user', ({ params }) => {
  // { name: foo }
  console.log(params);
});
```

### formData

#### usage

```html
<!-- form -->
<form method="get" action="/user" data-role="router-form">
  <input type="text" placeholder="search..." name="search">
  <input type="submit">
</form>
```

```javascript
// formData
Router.get('/user', ({ formData }) => {
  // { search: __VALUE__ }
  console.log(formData);
});
```

### redirect 

#### usage

```javascript
// redirect
Router.get('/user', function({ redirect }) {
  redirect('/', null);
});
```

### state 

#### usage

```javascript
Router.get('/user', ({ redirect }) => {
  // redirect
  redirect('/user/list', { /** .. */ })
});

Router.get('/user/list', ({ state }) => {
  /** ... */
  console.log(state)
})
```

### request 

#### usage

```javascript
Router.get('/user', ({ request }) => {
  request({
    url: '/user/profile',
    method: 'post',
    params: {
      name: 'foo'
    }
  }).then((res) => {
    // object
    console.log(res)
  })
})

Router.post('/user/profile', ({ done, params }) => {
  // Parameters
  console.log(params);
  done({ /* Response */ })
})
```

### done 

#### usage

```javascript
/** post */
Router.post('/user', ({ done }) => {
  done({
    name: 'foo'
  });
});

/** get */
Router.get('/user', ({ request, done }) => {
  request({
    url: '/user',
    method: 'post'
  }).then((res) => {
    // <h1>foo</h1>
    done(`<h1>${res.name}</h1>`);
  });
});
```

# License

MIT

Copyright (c) Mansu Jeong. All rights reserved.