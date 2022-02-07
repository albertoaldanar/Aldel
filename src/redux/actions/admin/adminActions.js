export const SET_ADMIN_DATA = 'SET_ADMIN_DATA';

export default function changeAdminState(object) {
    return {
      type: SET_ADMIN_DATA,
      payload: object
    }
}
