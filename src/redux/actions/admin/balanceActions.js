export const SET_BALANCE_DATA = 'SET_BALANCE_DATA';

export default function changeBlanceState(object) {
    return {
      type: SET_BALANCE_DATA,
      payload: object
    }
}
