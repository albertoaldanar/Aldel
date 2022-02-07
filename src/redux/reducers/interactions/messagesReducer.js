import { SET_MESSAGES_LIST } from "../../actions/interactions/messagesActions";

const initialState = [{title: "", data:[] }];

export default function(state = initialState, action) {
    switch (action.type) {
      case SET_MESSAGES_LIST: {
        return {...state, ...action.payload}
      }
      default:
        return state
    }
}
