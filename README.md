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

### HistoryRouter.when(path: string, callback: Function, middlewares: Array)

Register Route

|Name|default|description|
-----|-------|-----------|
|path|?|<https://github.com/RasCarlito/url-composer>|
|callback|?|**Callback** after URL change|
|middlewares|[]|Route **middlewares**|

#### Usage

```javascript
let userMiddleware = () => {
  /** ... */
  return true;
}
/** Route '/user' with parameters */
router.when('/user/:id', ({ params }) => console.log(params.id), [ userMiddleware ]);
```

### HistoryRouter.middleware(callback: Function)

Register global middleware

|Name|default|description|
-----|-------|-----------|
|callback|?|<https://github.com/ReactTraining/history>|

#### Usage

```javascript
router.middleware(() => console.log('Global middleware'));
```

## Callback Parameters

|Name|description|
-----|-----------|
|state|push, or replace **state**|
|params|URL **parameters**|

### Usage

```javascript
/** Route '/user' with parameters */
router.when('/user/:id', ({ params, state }) => {
  /** 
   * Don't using 'state' with Hash mode
   * 
   * params.id => 42 
   * state.name => 'foo'
   */
});
/** push, or replace */
router.history.push('/user/42', {
  name: 'foo'
})
```

# License

MIT

Copyright (c) Mansu Jeong. All rights reserved.