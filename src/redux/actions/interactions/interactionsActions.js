export const SET_INTERACTIONS_LIST = 'SET_INTERACTIONS_LIST';

export default function setInteractionsData(object) {
    return {
      type: SET_INTERACTIONS_LIST,
      payload: object
    }
}
