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
      router = new HistoryRouter(true)
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

# Properties

|Name|description|
-----|-----------|
|middlewares|Registered **global middlewares**|
|routes|Registered **routes**|
|history|<https://github.com/ReactTraining/history>|

# Methods

### HistoryRouter(hash: Boolean)

Create HistoryRouter Instance

|Name|description|
-----|-----------|
|hash|Using hash mode|

#### Usage

```javascript
let router = new HistoryRouter(false);
```

### HistoryRouter.when(path: string, callback: Function, middlewares: Array): HistoryRouter

Register Route

|Name|description|
-----|-----------|
|path|<https://github.com/RasCarlito/url-composer>|
|callback|**Callback** after URL change|
|middlewares|Route **middlewares**|

#### Usage

```javascript
let userMiddleware = () => {
  /** ... */
  return true;
}
/** Route '/user' with parameters */
router.when('/user/:id', ({ params }) => console.log(params.id), [ userMiddleware ]);
```

### HistoryRouter.middleware(callback: Function): HistoryRouter

Register global middleware

|Name|description|
-----|-----------|
|callback|Global **middleware** callback|

#### Usage

```javascript
let globalMiddleware = () => {
  /** ... */
  return true;
}
router.middleware(globalMiddleware);
```

# How to use

### Route

|Name|description|
-----|-----------|
|location|<https://github.com/ReactTraining/history#properties>|
|params|URL **parameters**|
|response|middleware **response**|

#### Usage

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
}, [ () => 'foo' ]);

/** push, or replace */
router.history.push('/user/42', {
  name: 'foo'
})
```

### Middleware

|Name|description|
-----|-----------|
|to|<https://github.com/ReactTraining/history#properties>|
|from|<https://github.com/ReactTraining/history#properties>|
|response|last Middleware **response**|

#### Usage

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
    console.log(response);
  }, 
  [
    /** Route middleware */
    ({ to, from, response }) => { 
      /**
       * response => 'Hello, world'
       */
      return response;
    } 
  ])
  /** Global middleware */
  .middleware(({ to, from, response }) => {
    /** 
     * First middleware
     * 
     * '/' => '/user/42'
     */
    return 'Hello, world';
  })
  .middleware(({ to, from, response }) => {
    /**
     * response => 'Hello, world'
     */
    return response;
  })
;
/** push, or replace */
router.history.push('/user/42', {
  name: 'foo'
})
```

# License

MIT

Copyright (c) Mansu Jeong. All rights reserved.