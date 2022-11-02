import { useEffect, useState } from "react";
import React from "react";

let state = undefined
let reducer = undefined
let listeners = []
const setState = (newState) => {
  state = newState
  listeners.map((fn) => fn(state))
}

const store = {
  getState() {
    return state
  },
  dispatch(action) {
    if (action instanceof Function) {
      action(store.dispatch)
    } else if (action.payload instanceof Promise) {
      action.payload.then(response => {
        store.dispatch({...action, payload: response})
      })
    } else {
      setState(reducer(state, action))
    }
  },
  subscribe(fn) {
    listeners.push(fn)
    return () => {
      const index = listeners.indexOf(fn)
      listeners.splice(index, 1)
    }
  }
}

export const createStore = (_state, _reducer) => {
  state = _state
  reducer = _reducer
  return store
}

const dataUpdated = (oldData, newData) => {
  let updated = false
  for (let oldDataKey in oldData) {
    if (oldData[oldDataKey] !== newData[oldDataKey]) {
      updated = true
    }
  }
  return updated
}

export const connect = (mapStateToProps, mapDispatchToProps) => (Component) => {
  return (props) => {
    const {dispatch, subscribe} = store
    const [, update] = useState({})
    const data = mapStateToProps ? mapStateToProps(state) : {state}
    const dispatchers = mapDispatchToProps ? mapDispatchToProps(dispatch) : {dispatch}
    useEffect(() => {
      return subscribe(() => {
        const newData = mapStateToProps ? mapStateToProps(state) : {state}
        if (dataUpdated(data, newData)) {
          update({})
        }
      })
    }, [mapStateToProps])
    return <Component {...props} {...data} {...dispatchers}/>
  }
}

const appContext = React.createContext(null);

export const Provider = ({store, children}) => {
  return <appContext.Provider value={store}>
    {children}
  </appContext.Provider>
}
