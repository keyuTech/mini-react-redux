import { connect } from "../../src/index.jsx";

const userSelector = (state) => {
  return {user: state.user}
}

const userDispatch = (dispatch) => {
  return {
    updateUser: (payload) => {
      dispatch({type: 'updateUser', payload})
    }
  }
}

export const userConnect = connect(userSelector, userDispatch)
