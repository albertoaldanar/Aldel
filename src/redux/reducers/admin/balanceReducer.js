import { SET_BALANCE_DATA } from "../../actions/admin/balanceActions";

const initialState = {
    balance: "0.00"
}

export default function(state = initialState, action) {
    switch (action.type) {
      case SET_BALANCE_DATA: {
        return {...state, ...action.payload}
      }
      default:
        return state
    }
}
