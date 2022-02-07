
const API = 'https://onesignal.com/api/v1/notifications';

class Api {

    async sendNotification(players, title, message) {
        const conf = {
            method: 'POST',
            headers: {
                Accept: 'application/json',
                'Content-Type': 'application/json',
            },
            timeout: 30000,
            body: JSON.stringify({
                "app_id": "5b239f1e-4de7-46c9-958b-ce4f80c9249b",
                "include_player_ids": players,
                "headings": {"en": title},
                "contents": {"en": message},
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

        console.log('url',`${API}`)
        console.log('conf', conf)
 
        await fetch(`${API}`, conf)
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

    async incommingCallNotification() {
        const conf = {
            method: 'POST',
            headers: {
                Accept: 'application/json',
                'Content-Type': 'application/json',
            },
            timeout: 30000,
            body: JSON.stringify({
                "app_id": "5b239f1e-4de7-46c9-958b-ce4f80c9249b",
                "include_player_ids": ['2b5e956f-8cc9-45d1-939c-bbb7823fb596'],
                "contents": {"en": 'Llamada entrante'},
                "apns_push_type_override": "voip"
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

        console.log('url',`${API}`)
        console.log('conf', conf)
 
        await fetch(`${API}`, conf)
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