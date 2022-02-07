export const SET_QUESTIONS_DATA = 'SET_QUESTIONS_DATA';

export default function changeQuestionsState(object) {
    return {
      type: SET_QUESTIONS_DATA,
      payload: object
    }
}
