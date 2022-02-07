import { SET_ADMIN_DATA } from "../../actions/admin/adminActions";

const initialState = {
      apellidoMaterno: "",
      apellidoPaterno: "",
      descripcion: "",
      email: "",
      fechaNacimiento: "",
      fotoPerfil: "",
      iDtipoUsuario: null,
      idUsuario: null,
      nombre: "",
      resumen: "",
      password: "",
      rfc: "",
      telefono: "",
      videoPerfil: null, 
      verified: null, 
      pais: '',
}

export default function(state = initialState, action) {
    switch (action.type) {
      case SET_ADMIN_DATA: {
        return {...state, ...action.payload}
      }
      default:
        return state
    }
}
