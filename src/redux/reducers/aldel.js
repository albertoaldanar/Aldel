import { SET_ALDEL } from "../actions/aldel";

const initialState = {
  // user: "CONSULTOR"
  user: "CLIENT"
}

function aldel(state = initialState, action) {
    switch (action.type) {
      case SET_ALDEL: {
        return {...state, ...action.payload}
      }
      default:
        return state
    }
  }
  
  export default aldel;
