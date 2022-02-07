import { SET_CONSULTORS_LIST } from "../../actions/search/search";

const initialState = {
    data: [

    ]
}

export default function(state = initialState, action) {
    switch (action.type) {
      case SET_CONSULTORS_LIST: {
        return {...state, ...action.payload}
      }
      default:
        return state
    }
}
