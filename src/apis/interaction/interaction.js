
import API from '../url';

class Api {

    async createInteractionRequest(data, currentUser, dateTime, requestDescription, aboutUser) {
        const conf = {
            method: 'POST',
            headers: {
                Accept: 'application/json',
                'Content-Type': 'application/json',
            },
            timeout: 30000,
            body: JSON.stringify({
                id_usuario_consultor: data.idUsuario,
                id_usuario_cliente: currentUser,
                fecha_hora: dateTime,
                descripcion: requestDescription,
                respuestas: data.preguntas,
                acerca_de_cliente: aboutUser
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

        console.log('url',`${API}consulta/solicitud/nueva`)
        console.log('conf', conf)
 
        await fetch(`${API}consulta/solicitud/nueva`, conf)
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

    async acceptDeclineInteraction(request, estatus, stars, comment, clientStars, clientComment) {
        const conf = {
            method: 'PUT',
            headers: {
                Accept: 'application/json',
                'Content-Type': 'application/json',
            },
            timeout: 30000,
            body: JSON.stringify({ 
                id_consulta: request.id_consulta,
                id_usuario_consultor: request.consultor.id_usuario, 
                id_usuario_cliente: request.cliente.id_usuario, 
                fecha_hora: request.consultor.fecha_hora, 
                descripcion: request.descripcion, 
                estrellas_consultor: stars || request.consultor.estrellas, 
                comentario_consultor: comment || request.consultor.comentario, 
                estrellas_cliente: clientStars || request.cliente.estrellas, 
                comentario_cliente: clientComment || request.cliente.comentario,
                estatus: estatus, 
                acerca_de_cliente: "Mi nombre es Santiago de la pena y soy muy buena gente"
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

        console.log('url',`${API}consultas/actualizar`)
        console.log('conf', conf)
 
        await fetch(`${API}consultas/actualizar`, conf)
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

    async getInteractionConsultor(id) {
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

        console.log('url',`${API}consultas/solicitud/consultor/${id}`)
        console.log('conf', conf)
 
        await fetch(`${API}consultas/solicitud/consultor/${id}`, conf)
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

    async getInteractionClient(id) {
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

        console.log('url',`${API}consultas/solicitud/cliente/${id}`)
        console.log('conf', conf)
 
        await fetch(`${API}consultas/solicitud/cliente/${id}`, conf)
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

    async setNewLastMessage(idConsulta, userType, message, messageType, unlocked, idFirebase) {
        const conf = {
            method: 'PUT',
            headers: {
                Accept: 'application/json',
                'Content-Type': 'application/json',
            },
            timeout: 30000,
            body: JSON.stringify({ 
                id_consulta: idConsulta,
                tipo_usuario: userType,
                texto_ultimo_mensaje: message, 
                tipo_ultimo_mensaje: messageType, 
                desbloqueado: unlocked, 
                id_firebase: idFirebase
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

        var query = { }

        console.log('url',`${API}consultas/ultimo/mensaje`)
        console.log('conf', conf)
 
        await fetch(`${API}consultas/ultimo/mensaje`, conf)
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

    async cleanUnreadedMessagesClient(idConsulta, action ) {
        const conf = {
            method: 'PUT',
            headers: {
                Accept: 'application/json',
                'Content-Type': 'application/json',
            },
            timeout: 30000,
            body: JSON.stringify({ 
                id_consulta: idConsulta,
                accion: action
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

        var query = { }

        // console.log('url',`${API}consultas/mensajes/cliente/recientes`)
        // console.log('conf', conf)
 
        await fetch(`${API}consultas/mensajes/cliente/recientes`, conf)
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

    async cleanUnreadedMessagesConsultor(idConsulta, action) {
        const conf = {
            method: 'PUT',
            headers: {
                Accept: 'application/json',
                'Content-Type': 'application/json',
            },
            timeout: 30000,
            body: JSON.stringify({ 
                id_consulta: idConsulta,
                accion: action
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

        var query = { }

        console.log('url',`${API}consultas/mensajes/consultor/recientes`)
        console.log('conf', conf)
 
        await fetch(`${API}consultas/mensajes/consultor/recientes`, conf)
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