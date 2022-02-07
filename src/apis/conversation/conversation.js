import API from '../url';

class Api {

    async getConversationConfig(consultorID, currentUser, idConversation) {
        const conf = {
            method: 'POST',
            headers: {
                Accept: 'application/json',
                'Content-Type': 'application/json',
            },
            timeout: 30000,
            body: JSON.stringify({
                id_usuario_consultor: consultorID,
                id_usuario: currentUser, 
                id_consulta: idConversation
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

        // console.log('url',`${API}consultas/revisar/precios/saldo`)
        // console.log('conf', conf)
 
        await fetch(`${API}consultas/revisar/precios/saldo`, conf)
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

    async createTransaction(consultaData, price, message, sender, interactionType, idFirebase) {
        const conf = {
            method: 'POST',
            headers: {
                Accept: 'application/json',
                'Content-Type': 'application/json',
            },
            timeout: 30000,
            body: JSON.stringify({
                "id_consulta": consultaData.id_consulta, 
                "id_usuario_emisor": sender, 
                "id_usuario_cliente": consultaData.cliente.id_usuario, 
                "id_usuario_consultor": consultaData.consultor.id_usuario, 
                "valor": price, 
                "descripcion": message, 
                "id_tipo_interaccion": interactionType,
                "id_firebase": idFirebase
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

        console.log('url',`${API}interaccion/transaccion/nueva`)
        console.log('conf', conf)
 
        await fetch(`${API}interaccion/transaccion/nueva`, conf)
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