# mini-react-redux
只具备最基本功能的React-Redux，继承了React-Redux的相关API并扩展了对函数Action和Promise Action的原生支持。

## API
* createStore() - 初始化一个Store，应用中应该有且只有一个Store
  ```javascript
  import {createStore} from 'index.jsx'
  const store = createStore(state, reducer)
  ```
* Store
  * store.getState() - 获取当前state
  * store.dispatch(action) - 触发state变化
    ```javascript
    store.dispatch({type: 'updateUser', payload: {name: 'keyu', age: 100}})
    ```
  * store.subscribe(fn) - 监听state变化，当state变化时执行fn
* connect(mapStateToProps, mapDispatchToProps) - 连接UI组件和state，将state和dispatch映射到props
  ```javascript
  const connectedComponent = connect(null, null)(() => {
    return <div>connect UI to State</div>
  })
  ```
* Provider - 使组件可以获取state
```javascript
import {Provider, createStore} from 'index.jsx';

const store = createStore(state, reducer);
<Provider store={store}>
  <App/>
</Provider>
```

## 特点
mini-react-redux原生支持函数Action和Promise Action，不必使用类似[redux-thunk](https://github.com/reduxjs/redux-thunk)或
[redux-promise](https://github.com/redux-utilities/redux-promise)的中间件来实现异步Action操作
```javascript
  import {createStore} from 'index.jsx'
  const store = createStore(state, reducer)
  
  const fetchData = () => {
    return new Promise((resolve, reject) => {
      resolve(data)
    })
  } 
  // 可以直接将Promise作为payload
  store.dispatch({type: 'updateData', payload: fetchData().then(response => response)}) 
  // 也可将函数作为action传入dispatch
  const updateData = (dispatch) => {
    return fetchData().then(response => dispatch({type: 'updateData', payload: response}))
  }
  store.dispatch(updateData)
```

## Redux

### 1. 设计思想

> 1. 所有状态都存储在一个对象里
> 2. 一个状态对应一个视图

### 2. 名词解释
* State - 应用中的数据
* Store - 一个对象，全局State存储在Store里，提供`getState`方法来获取State
* Action - 一个对象，用于描述State将被如何改变，一般包含一个`type`用于描述类型，一个 `payload`用于描述将要更新的数据。
* Reducer - 一个函数，接受一个State和一个Action，用于规范如何修改State。Reducer并不会直接修改State，而是生成一个新的State并返回。
* Dispatch - 一个函数，按照规定，更新State的唯一方式是调用 `store.dispatch(action)`，Dispatch接受的参数为一个Action

### 3. 三个原则

> * 单一数据源
> * State是只读的
> * 使用纯函数来修改状态

1. 单一数据源： 所有的全局State都被存储在一个object中，这个object存在Store里，单一数据源原则对应设计思想中的所有状态都存储在一个对象里。
2. State是只读的：唯一改变State的方法就是触发Action。
通过Action修改State 都会生成一个新的State 对象而不是修改原有的State。
3. 使用纯函数修改状态：Reducer就是一个纯函数，只要传入相同的输入，必定会得到相同的输出。

### 4. 数据流
> 单向数据流

由于用户只能接触到View，因此应该由用户发起Action，通过调用dispatch将Action传递给Reducer，Store会自动调用Reducer，传入当前State和Action这两个参数，随着State的变化，Store会调用subscribe以重新渲染View

## React-Redux

React-Redux在Redux的基础上新增了一些API，并且在最新的React-Redux中提供了一些Hooks API。
React-Redux将组件分为Redux组件和UI组件，其中Redux组件负责管理数据和逻辑，而UI组件只负责处理UI的展示，由此React-Redux新增了 
`connect`方法用于将Redux组件和UI组件连接起来，使得UI组件能够根据State渲染并能根据用户操作更新State。

### 新增API
* connect - 用于将Redux和UI组件连接起来
  connect是一个高阶组件，它接收两个参数和一个组件，返回一个处理后的组件
  ```javascript
  import {connect} from 'reac-redux'
  const connectedComponent = connect(mapStateToProps, mapDispatchToProps)((props) => {
    return <div>connect Redux to UI</div>
  })
  ```
* mapStateToProps - 用于将React-Redux中的State映射到UI组件的Props中，方便使用State中的字段
  mapStateToProps是一个函数，用于获取State中的指定字段，并映射到UI组件的Props中
  ```javascript
  const mapStateToProps = (state) => {
    return {userName: state.user.userName}
  }
  ```
  上述例子可以使得UI组件直接在Props中获取 `userName`
* mapDispatchToProps - 用于将React-Redux中的Dispatch映射到UI组件的Props中，方便在UI组件中直接调用对应的Dispatch
  mapDispatchToProps也是一个函数，将Dispatch映射到UI组件的Props中
  ```javascript
  const mapDispatchToProps = (dispatch) => {
    return {
      updateUser: (payload) => {
        diapatch({type: 'updateUser', payload})
      }
    }
  }
  ```
  上述例子可以使得UI组件中直接调用 `updateUser` 方法更新State
* Provider - 用于透传State，使React-Redux组件可以获取State
