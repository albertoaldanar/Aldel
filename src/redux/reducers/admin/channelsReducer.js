import { SET_CHANNELS_DATA, CHANGE_CHANNELS_DATA } from "../../actions/admin/channels/channelsActions";

const initialState = [
  
];

export default function(state = initialState, action) {
    switch (action.type) {
      case SET_CHANNELS_DATA: {
        return {...state, ...action.payload}
      }
      case CHANGE_CHANNELS_DATA: {
        return { 
          ...state, 
          data: state.data.map(
              (channel, i) => channel.id_tipo_interaccion === action.payload.index ? 
                  {...channel, [action.payload.type]: action.payload.value}                 
                : 
                  channel
          )
        }
      } 
      default:
        return state
    }
}
