import { SET_INTERACTIONS_LIST } from "../../actions/interactions/interactionsActions";

const initialState = {
  allConversation: [],
  accepted: [], 
  wating: []
}
export default function(state = initialState, action) {
    switch (action.type) {
      case SET_INTERACTIONS_LIST: {
        return {...state, ...action.payload}
      }
      default:
        return state
    }
}
