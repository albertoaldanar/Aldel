
import API from '../url';

class Api {

    async signUp(data, userType, notificationID) {
        const typ = userType === 3 ? "consultor" : 'client' 
        const conf = {
            method: 'POST',
            headers: {
                Accept: 'application/json',
                'Content-Type': 'application/json',
            },
            timeout: 30000,
            body: JSON.stringify({
                "tipo_usuario": userType,
                "email": data.email,
                "password": data.password,
                "nombre": data.nombre,
                "apellido_paterno": data.apellidoPaterno,
                "apellido_materno": "",
                "fecha_nacimiento": "",
                "notificacion_id": notificationID, 
                "pais": "MX"
            }),
        }

        function checkStatus(response) {
            if (response.status >= 200 && response.status < 300 || response.status == 422) {
                return response
            } else {
                var error = new Error(response.statusText)
                error.response = response
                throw error
            }
        }
        function parseJSON(response) {
            return response.json()
        }

        var query = { }

        console.log('url',`${API}register`)
        console.log('conf', conf)
 
        await fetch(`${API}register`, conf)
            .then(checkStatus)
            .then(parseJSON)
            .then(function (data) {
                query = data
            }).catch(function (error) {
                if (error.message == 'Network request failed') {
                    query = {
                        meta: {
                            status: 'ERROR',
                            error: {
                                title: 'Error de conexión',
                                mesagge: 'Por favor revise su conexión a internet y vuelva a intentarlo mas tarde'
                            }
                        }
                    }
                }
                else {
                    query = {
                        meta: {
                            status: 'ERROR',
                            error: {
                                title: 'Ups...',
                                mesagge: 'Por el momento este servicio no esta disponible, vuelva a intentarlo mas tarde,'
                            }
                        }
                    }
                }

                return query

            });
        return query
    }
}

export default new Api();
