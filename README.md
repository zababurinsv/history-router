# history-router

Router for history

## Installation

```bash
npm install --save history-router
```

## Basic usage

```javascript
import HistoryRouter from 'history-router'

const router = new HistoryRouter()

/** Route '/user' with parameters */
router.when('/user/:id', ({ params }) => {
  // 32
  console.log(params.id)
})

/** https://github.com/ReactTraining/history */
router.history.push('/user/32')
```

## Properties

|Name|description|
-----|-----------|
|history|<https://github.com/ReactTraining/history>|

## Methods

### HistoryRouter(hash: Boolean = true)

Create HistoryRouter Instance

|Name|description|
-----|-----------|
|hash|Using hash mode|

```javascript
const router = new HistoryRouter(false)
```

### HistoryRouter.when(path: string, callback: Function, middlewares: Array = []): void

Register Route

|Name|description|
-----|-----------|
|path|<https://github.com/RasCarlito/url-composer>|
|callback|**Callback** after URL change|
|middlewares|Route **middlewares**|

#### Callback

|Name|description|
-----|-----------|
|to|<https://github.com/ReactTraining/history#properties>|
|from|<https://github.com/ReactTraining/history#properties>|
|params|URL **parameters**|
|response|middleware **response**|

```javascript
/** Route '/user' with parameters */
router.when('/user/:id', ({ to, from, params, response }) => {
  /**
   * Don't using 'state' with Hash mode
   *
   * params.id => 42
   * to.state.name => 'foo'
   * response => 'Hello, world'
   */
  console.log(response)
},
[
  /** Route middleware */
  ({ to, from, response }) => {
    /**
     * response => 'Hello, world'
     */
    return 'Hello, world'
  }
])
```

### HistoryRouter.middleware(callback: Function): void

Register global middleware

|Name|description|
-----|-----------|
|callback|Global **middleware** callback|

#### Callback

|Name|description|
-----|-----------|
|to|<https://github.com/ReactTraining/history#properties>|
|from|<https://github.com/ReactTraining/history#properties>|
|response|last Middleware **response**|

```javascript
/** Global middleware */
router.middleware(({ to, from, response }) => {
  /**
   * First middleware
   *
   * '/' => '/user/42'
   */
  return 'Hello, world'
})
router.middleware(({ to, from, response }) => {
  /**
   * response => 'Hello, world'
   */
  return response
})
```

## License

[MIT](https://github.com/pronist/history-router/blob/master/LICENSE)

Copyright 2018-2020. [SangWoo Jeong](https://github.com/pronist). All rights reserved.
