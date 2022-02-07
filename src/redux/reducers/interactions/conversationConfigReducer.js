import { SET_CONVERSATION_CONFIG } from "../../actions/interactions/conversationConfigActions";

const initialState = {
    data: {
      "Llamada": {
          costo: "00.00",
          estatus: 0
      }, 
      "Mensaje": {
          costo: "0.00",
          estatus: 0
      }, 
      "Notas de Voz": {
          costo: "00.00",
          estatus: 0
      }, 
      "Videollamada": {
          costo: "00.00",
          estatus: 0
      },
      "Imagenes": {
        costo: "00.00",
        estatus: 0
      },
     "Videos": {
        costo: "00.00",
        estatus: 0
      }
    }
}

export default function(state = initialState, action) {
    switch (action.type) {
      case SET_CONVERSATION_CONFIG: {
        return {...state, ...action.payload}
      }
      default:
        return state
    }
}
