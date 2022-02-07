export const SET_MESSAGES_LIST = 'SET_MESSAGES_LIST';

export default function setMessagesList(object) {
    return {
      type: SET_MESSAGES_LIST,
      payload: object
    }
}
