
import API from '../url';

class Api {

    //CHANNELS  -------------------------------------------------- CHANNELS

    async createChannels(channelsArray) {
        const conf = {
            method: 'POST',
            headers: {
                Accept: 'application/json',
                'Content-Type': 'application/json',
            },
            timeout: 30000, 
            body: JSON.stringify({
                "interacciones": channelsArray.data
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

        console.log('url',`${API}usuarios/${id}/interacciones/predeterminadas`)
        console.log('conf', conf)
 
        await fetch(`${API}usuarios/${id}/interacciones/predeterminadas`, conf)
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

    async getChannels(id) {
        const conf = {
            method: 'GET',
            headers: {
                Accept: 'application/json',
                'Content-Type': 'application/json',
            },
            timeout: 30000
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

        console.log('url',`${API}usuarios/${id}/interacciones/predeterminadas`)
        console.log('conf', conf)
 
        await fetch(`${API}usuarios/${id}/interacciones/predeterminadas`, conf)
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

    async updateChannels(channelUpdateArray) {
        const conf = {
            method: 'PUT',
            headers: {
                Accept: 'application/json',
                'Content-Type': 'application/json',
            },
            timeout: 30000, 
            body: JSON.stringify({
                "interacciones": channelUpdateArray.data,
                "id_interaccion_predeterminada": 0,
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

        console.log('url',`${API}interacciones/predeterminadas/actualizar/multiple`)
        console.log('conf', conf)
 
        await fetch(`${API}interacciones/predeterminadas/actualizar/multiple`, conf)
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
    

    //FORMULARIOS  -------------------------------------------------- FORMULARIOS
    async getQuestions(id) {
        const conf = {
            method: 'GET',
            headers: {
                Accept: 'application/json',
                'Content-Type': 'application/json',
            },
            timeout: 30000
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

        console.log('url',`${API}formularios/preguntas/consultor/${id}`)
        console.log('conf', conf)
 
        await fetch(`${API}formularios/preguntas/consultor/${id}`, conf)
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

    async createQuestion(id, question) {
        const conf = {
            method: 'POST',
            headers: {
                Accept: 'application/json',
                'Content-Type': 'application/json',
            },
            timeout: 30000,
            body: JSON.stringify({
                id_usuario_consultor: id, 
                pregunta: question, 
                estatus: 1
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

        console.log('url',`${API}formularios/preguntas/nuevo`)
        console.log('conf', conf)
 
        await fetch(`${API}formularios/preguntas/nuevo`, conf)
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


    async updateQuestion(data, user) {
        const conf = {
            method: 'PUT',
            headers: {
                Accept: 'application/json',
                'Content-Type': 'application/json',
            },
            timeout: 30000,
            body: JSON.stringify({
                id_pregunta_formulario: data.id_pregunta_formulario, 
                id_usuario_consultor: user, 
                pregunta: data.pregunta, 
                estatus: 0
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

        console.log('url',`${API}formularios/preguntas/actualizar`)
        console.log('conf', conf)
 
        await fetch(`${API}formularios/preguntas/actualizar`, conf)
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

    async deleteQuestion(id) {
        const conf = {
            method: 'DELETE',
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

        console.log('url',`${API}formularios/preguntas/eliminar/${id}`)
        console.log('conf', conf)
 
        await fetch(`${API}formularios/preguntas/eliminar/${id}`, conf)
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

     //CATEGORIES  -------------------------------------------------- CATEGORIES

     async getCategories(id) {
        const conf = {
            method: 'GET',
            headers: {
                Accept: 'application/json',
                'Content-Type': 'application/json',
            },
            timeout: 30000
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

        console.log('url',`${API}usuarios/${id}/categorias/subcategorias`)
        console.log('conf', conf)
 
        await fetch(`${API}usuarios/${id}/categorias/subcategorias`, conf)
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

    async updateCategories(user, categories) {
        const conf = {
            method: 'POST',
            headers: {
                Accept: 'application/json',
                'Content-Type': 'application/json',
            },
            timeout: 30000,
            body: JSON.stringify({
                id_usuario: user, 
                mis_categorias: categories
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

        console.log('url',`${API}usuarios/categorias/subcategorias/guardar`)
        console.log('conf', conf)
 
        await fetch(`${API}usuarios/categorias/subcategorias/guardar`, conf)
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

    //VERIFY USER  -------------------------------------------------- VERIFY USER

    async verifyUser(user, userMedia, date, video, image) {
        const conf = {
            method: 'POST',
            headers: {
                Accept: 'application/json',
                'Content-Type': 'application/json',
            },
            timeout: 30000,
            body: JSON.stringify({
                id_usuario_verificador: user,
                id_usuario: user, 
                descripcion: userMedia, 
                fecha: date, 
                url_video: video,
                url_imagen: image,
                estatus: 1
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

        console.log('url',`${API}usuarios/verificaciones/nuevo`)
        console.log('conf', conf)
 
        await fetch(`${API}usuarios/verificaciones/nuevo`, conf)
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
}

export default new Api();
