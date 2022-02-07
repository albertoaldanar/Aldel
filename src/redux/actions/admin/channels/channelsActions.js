export const SET_CHANNELS_DATA = 'SET_CHANNELS_DATA';
export const CHANGE_CHANNELS_DATA = 'CHANGE_CHANNELS_DATA';

export function setChannels(object) {
  return {
    type: SET_CHANNELS_DATA,
    payload: object
  }
}

export function changeChannelsState(object) {
  return {
    type: CHANGE_CHANNELS_DATA,
    payload: object
  }
}
