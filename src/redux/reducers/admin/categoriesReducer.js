import { SET_CATEGORIES_DATA } from "../../actions/admin/categories";

const initialState = {
  categories: [],
  myCategories: []
}

export default function(state = initialState, action) {
    switch (action.type) {
      case SET_CATEGORIES_DATA: {
        return {...state, ...action.payload}
      }
      default:
        return state
    }
}
