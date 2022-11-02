import { connect, createStore, Provider } from "../src/index.jsx";
import React from "react";
import { userConnect } from "./connecters/userConnecter.js";

const state = {
  user: {name: 'aaa', age: 1},
  group: 'group'
}
const reducer = (state, {type, payload}) => {
  if (type === 'updateUser') {
    return {
      ...state,
      user: {
        ...state.user,
        ...payload
      }
    }
  } else {
    return state
  }
}

const store = createStore(state, reducer)

function App() {
  return (
    <Provider value={store}>
      <Component1/>
      <Component2/>
      <Component3/>
    </Provider>
  )
}

const Component1 = () => {
  console.log(1);
  return <section>第一个组件: <User/></section>
}
const Component2 = () => {
  console.log(2);
  return <section>第二个组件: <UserModifier/></section>
}
const Component3 = connect(state => {
  return {group: state.group}
})(({group}) => {
  console.log(3);
  return <section>第三个组件: {group}</section>
})


const User = userConnect(({user}) => {
  console.log('user');
  return <span>user: {user.name} 111</span>
});

const ajax = () => {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      resolve({data: {name: '3s后'}})
    }, 3000)
  })
}

const fetchUser = (dispatch) => {
  ajax().then((data) => {
    dispatch({type: 'updateUser', payload: data.data})
  })
}

// const UserModifier = userConnect(({user, updateUser, children}) => {
//   console.log('userModifier');
//   const onChange = (e) => {
//     updateUser({name: e.target.value})
//   }
//   return <>
//     {children}
//     <input type="text" value={user.name} onChange={onChange}/>
//   </>
// });
const UserModifier = connect(null, null)(({state, dispatch, children}) => {
  console.log('userModifier');
  const onClick = (e) => {
    // dispatch(fetchUser)
    dispatch({type: 'updateUser', payload: ajax().then(response => response.data)})
  }
  return <>
    {children}
    <button onClick={onClick}>异步action</button>
  </>
});

export default App

