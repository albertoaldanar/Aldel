
import { SET_PROFILE_DATA, UPDATE_QUESTIONS_PROFILE } from "../../actions/profile/profileActions";

const initialState = {
    idUsuario: null,
    iDtipoUsuario: null,
    email: "",
    rfc: "",
    nombre: "",
    apellidoPaterno: "",
    apellidoMaterno: "",
    fechaNacimiento: "",
    fotoPerfil: null,
    videoPerfil: null,
    telefono: "",
    resumen: "",
    descripcion: "",
    estatus: 0,
    verificado: false,
    nuevo: false,
    notificationID: null,
    pais: '',
    categorias: {

    },
    reviews: [

    ],
    preguntas: [

    ],
    interaccionesPredeterminadas: [
      
    ]
}

export default function(state = initialState, action) {
    switch (action.type) {
      case SET_PROFILE_DATA: {
        return {...state, ...action.payload}
      }
      case UPDATE_QUESTIONS_PROFILE: {
        return { 
          ...state, 
          preguntas: state.preguntas.map( 
              question => question.id_pregunta_formulario === action.payload.index ? 
                  {...question, respuesta: action.payload.value}                 
                : 
                  question
          )
        }
      } 
      default:
        return state
    }
}
