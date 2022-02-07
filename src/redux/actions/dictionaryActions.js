export const SET_DICTIONARY_DATA = 'SET_DICTIONARY_DATA';

export default function setDictionary(object) {
    return {
      type: SET_DICTIONARY_DATA,
      payload: object
    }
}
