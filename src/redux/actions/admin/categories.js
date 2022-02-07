export const SET_CATEGORIES_DATA = 'SET_CATEGORIES_DATA';

export default function setCategoriesData(object) {
    return {
      type: SET_CATEGORIES_DATA,
      payload: object
    }
}
