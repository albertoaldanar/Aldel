export const SET_ALDEL = 'SET_ALDEL';

export const changeAldel = (item) => dispatch => {
    dispatch({
        type: SET_ALDEL,
        payload: item
    })
}
