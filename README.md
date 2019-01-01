# history-router

Router for history

# Installation

```bash
bower install history-router --save
```

or,

```bash
npm install --save history-router
```

# Includes

with **bower**

```html
<body>
  <script src="bower_components/history-router/dist/history-router.js"></script>
</body>
```

or **cdn**

```html
<script src="https://unpkg.com/history-router"></script>
```

with **Bundlers** webpack etc.

```javascript
import HistoryRouter from 'history-router'
```

# Basic usage

```html
<a href="#">Link to somewhere</a>

<script src="https://unpkg.com/history-router"></script>
<script>
  let link = document.getElementsByTagName('a')[0],
      router = new HistoryRouter({
        hash: false // default: true
      })
  ;
  /** Route '/user' with parameters */
  router.when('/user/:id', ({ params }) => console.log(params.id));
  
  link.addEventListener('click', (e) => {
    e.preventDefault();

    /** https://github.com/ReactTraining/history */
    router.history.push('/user/32');
  });
</script>
```

```javascript
const HistoryRouter = require('history-router');

/** history-router Router **/
const router = new HistoryRouter({ hash: false });
// ...

/** Route '/user' with parameters */
router.when('/user/:id', ({ params }) => console.log(params.id));
```

# Properties

|Name|default|description|
-----|-------|-----------|
|options|{}|History Options|
|middlewares|[]|Registered **global middlewares**|
|routes|[]|Registered **routes**|
|history|?|<https://github.com/ReactTraining/history>|

# Methods

### HistoryRouter(options: object)

Create HistoryRouter Instance

|Name|default|description|
-----|-------|-----------|
|hash|true|Using hash mode|
|history|{}|<https://github.com/ReactTraining/history>|

#### Usage

```javascript
let router = new HistoryRouter({ hash: false });
```

### HistoryRouter.when(path: string, callback: Function, middlewares: Array): HistoryRouter

Register Route

|Name|default|description|
-----|-------|-----------|
|path|?|<https://github.com/RasCarlito/url-composer>|
|callback|?|**Callback** after URL change|
|middlewares|[]|Route **middlewares**|

#### Usage

```javascript
let userMiddleware = ({ next }) => {
  /** ... */
  next(true);
}
/** Route '/user' with parameters */
router.when('/user/:id', ({ params }) => console.log(params.id), [ userMiddleware ]);
```

### HistoryRouter.middleware(callback: Function): HistoryRouter

Register global middleware

|Name|default|description|
-----|-------|-----------|
|callback|?|Global **middleware** callback|

#### Usage

```javascript
let globalMiddleware = ({ next }) => {
  /** ... */
  next(true);
}
router.middleware(globalMiddleware);
```

# How to use

## Route

|Name|description|
-----|-----------|
|location|<https://github.com/ReactTraining/history#properties>|
|params|URL **parameters**|
|response|middleware **response**|

### Usage

```javascript
/** Route '/user' with parameters */
router.when('/user/:id', ({ location, params, response }) => {
  /**
   * Don't using 'state' with Hash mode
   * 
   * params.id => 42 
   * location.state.name => 'foo'
   * response => 'foo'
   */
}, [ ({ next }) => next('foo') ]);

/** push, or replace */
router.history.push('/user/42', {
  name: 'foo'
})
```

## Middleware

## Route

|Name|description|
-----|-----------|
|to|<https://github.com/ReactTraining/history#properties>|
|from|<https://github.com/ReactTraining/history#properties>|
|next|Go to next middleware, or rotue callback|
|response|last Middleware **response**|

### Usage

```javascript
/** Route '/user' with parameters */
router
  .when('/user/:id', ({ location, params, response }) => {
    /** 
     * Don't using 'state' with Hash mode
     * 
     * params.id => 42 
     * location.state.name => 'foo'
     * response => 'Hello, world'
     */
  }, [ ({ response, next }) => next(response) ])
  .middleware(({ to, from, next, response }) => {
    /** 
     * '/' => '/user/42'
     * 
     * to.location.pathname => '/user/42'
     * to.params.id => 42
     * from.location.pathname => '/'
     */
    next('Hello, world');
  })
  .middleware(({ response, next }) => next(response))
;
/** push, or replace */
router.history.push('/user/42', {
  name: 'foo'
})
```

# Advanced

### Next

```javascript
route.middleware(({ next }) => {
  /**
   * next(false) => Failed
   * next(<Somthing without 'false'>): next('foo')
   * next(<Function>): next(() => true)
   */ 
});
```

### Async Function

```javascript
import axios from 'axios';

router
  /** Global middleware */
  .middleware(({ next }) => {
    /** 'next' with Promise */
    next(() => axios.get('...'));
  })
  .when('/', async ({ response }) => console.log(await response))
```

# License

MIT

Copyright (c) Mansu Jeong. All rights reserved.