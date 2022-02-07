export const SET_CONSULTORS_LIST = 'SET_CONSULTORS_LIST';

export default function setListData(object) {
    return {
      type: SET_CONSULTORS_LIST,
      payload: object
    }
}
