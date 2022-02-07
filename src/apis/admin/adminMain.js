
import API from '../url';

class Api {

    async userMainData(id) {
        const conf = {
            method: 'GET',
            headers: {
                Accept: 'application/json',
                'Content-Type': 'application/json',
          
            },
            timeout: 30000,
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

        var query = {}

        console.log('url',`${API}usuarios/${id}`)
        console.log('conf', conf)
 
        await fetch(`${API}usuarios/${id}`, conf)
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

    async clientMainData(id) {
        const conf = {
            method: 'GET',
            headers: {
                Accept: 'application/json',
                'Content-Type': 'application/json',
          
            },
            timeout: 30000,
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

        var query = {}

        console.log('url',`${API}usuarios/clientes/${id}`)
        console.log('conf', conf)
 
        await fetch(`${API}usuarios/clientes/${id}`, conf)
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
                } else {
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

    async updateUserData(userData, foto, video) {

        const { 
                email, idUsuario, iDtipoUsuario, password, rfc, nombre, 
                apellidoMaterno, apellidoPaterno, fechaNacimiento, fotoPerfil, 
                videoPerfil, telefono, resumen, descripcion, estatus, pais 
            } = userData;

        const conf = {
            method: 'PUT',
            headers: {
                'Accept': '*/*',
                'Content-Type': 'application/json',
            },
            timeout: 30000,
            body: JSON.stringify({
                id_usuario:idUsuario,
                id_tipo_usuario: iDtipoUsuario,
                apellido_paterno:apellidoPaterno,
                apellido_materno:apellidoMaterno,
                fecha_nacimiento:fechaNacimiento,
                foto_perfil: foto || fotoPerfil,
                video_perfil: video || videoPerfil,
                email:email,
                rfc:rfc,
                nombre:nombre,
                telefono:telefono,
                resumen: resumen,
                descripcion:descripcion, 
                pais: pais
            })
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

        var query = {}

        console.log('url',`${API}usuarios/actualizar`)
        console.log('conf', conf)
 
        await fetch(`${API}usuarios/actualizar`, conf)
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
