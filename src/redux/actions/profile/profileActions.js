export const SET_PROFILE_DATA = 'SET_PROFILE_DATA';
export const UPDATE_QUESTIONS_PROFILE = 'UPDATE_QUESTIONS_PROFILE';

export function setProfileState(object) {
    return {
      type: SET_PROFILE_DATA,
      payload: object
    }
}

export function updateQuestionsProfile(object) {
  console.log("object => ", object);
  
  return {
    type: UPDATE_QUESTIONS_PROFILE,
    payload: object
  }
}
