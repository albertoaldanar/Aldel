import { SET_QUESTIONS_DATA } from "../../actions/admin/questionsActions";

const initialState = {
  data: [
  ]
}

export default function(state = initialState, action) {
    switch (action.type) {
      case SET_QUESTIONS_DATA: {
        return {...state, ...action.payload}
      }
      default:
        return state
    }
}
