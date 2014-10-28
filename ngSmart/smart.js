/** angular-cookies **/
(function (e, t, n) {
    "use strict";
    t.module("ngCookies", ["ng"]).factory("$cookies", ["$rootScope", "$browser",
        function (e, r) {
            var i = {},
                s = {},
                o, u = !1,
                a = t.copy,
                l = t.isUndefined;
            r.addPollFn(function () {
                var t = r.cookies();
                o != t && (o = t, a(t, s), a(t, i), u && e.$apply())
            })();
            u = !0;
            e.$watch(function () {
                var e, o, u;
                for (e in s) l(i[e]) && r.cookies(e, n);
                for (e in i) o = i[e], t.isString(o) || (o = "" + o, i[e] = o), o !== s[e] && (r.cookies(e, o), u = !0);
                if (u)
                    for (e in o = r.cookies(), i) i[e] !== o[e] && (l(o[e]) ? delete i[e] : i[e] = o[e])
            });
            return i
        }]).factory("$cookieStore", ["$cookies",
        function (e) {
            return {
                get: function (n) {
                    return (n = e[n]) ? t.fromJson(n) : n
                },
                put: function (n, r) {
                    e[n] = t.toJson(r)
                },
                remove: function (t) {
                    delete e[t]
                }
            }
        }])
})(window, window.angular)

/** angular-base64.js **/
! function () {
    "use strict";
    angular.module("base64", []).constant("$base64", function () {
        function e(e, t) {
            var n = s.indexOf(e.charAt(t));
            if (-1 == n) throw "Cannot decode base64";
            return n
        }

        function t(t) {
            t = "" + t;
            var n, r, s, o = t.length;
            if (0 == o) return t;
            if (0 != o % 4) throw "Cannot decode base64";
            n = 0, t.charAt(o - 1) == i && (n = 1, t.charAt(o - 2) == i && (n = 2), o -= 4);
            var u = [];
            for (r = 0; o > r; r += 4) s = e(t, r) << 18 | e(t, r + 1) << 12 | e(t, r + 2) << 6 | e(t, r + 3), u.push(String.fromCharCode(s >> 16, 255 & s >> 8, 255 & s));
            switch (n) {
            case 1:
                s = e(t, r) << 18 | e(t, r + 1) << 12 | e(t, r + 2) << 6, u.push(String.fromCharCode(s >> 16, 255 & s >> 8));
                break;
            case 2:
                s = e(t, r) << 18 | e(t, r + 1) << 12, u.push(String.fromCharCode(s >> 16))
            }
            return u.join("")
        }

        function n(e, t) {
            var n = e.charCodeAt(t);
            if (n > 255) throw "INVALID_CHARACTER_ERR: DOM Exception 5";
            return n
        }

        function r(e) {
            if (1 != arguments.length) throw "SyntaxError: Not enough arguments";
            var t, r, o = [];
            e = "" + e;
            var u = e.length - e.length % 3;
            if (0 == e.length) return e;
            for (t = 0; u > t; t += 3) r = n(e, t) << 16 | n(e, t + 1) << 8 | n(e, t + 2), o.push(s.charAt(r >> 18)), o.push(s.charAt(63 & r >> 12)), o.push(s.charAt(63 & r >> 6)), o.push(s.charAt(63 & r));
            switch (e.length - u) {
            case 1:
                r = n(e, t) << 16, o.push(s.charAt(r >> 18) + s.charAt(63 & r >> 12) + i + i);
                break;
            case 2:
                r = n(e, t) << 16 | n(e, t + 1) << 8, o.push(s.charAt(r >> 18) + s.charAt(63 & r >> 12) + s.charAt(63 & r >> 6) + i)
            }
            return o.join("")
        }
        var i = "=",
            s = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/";
        return {
            encode: r,
            decode: t
        }
    }())
}()


/**
 *
 * S.M.A.R.T Connect
 * A library to help developers integrate your solutions created with angularjs
 * on SMARTAPPS plataform.
 *
 * @author  José Wilker <jose.wilker@smartapps.com.br>
 * @date 	2014-08-09
 *
 * @note The autentication is checked when you try connect on plataform.
 *
 * Basic usage:
 *
 * -> Get data -> SMARTAPI.getData('form[/args]')->then(function(res){});
 * -> Send data exec method -> SMARTAPI.execMethod('[post/get]', method_name, params) [all args is string]
 *
 * To get more info about args and methods you can use, check the S.D.K API docs.
 *
 */
angular.module('smart', ['base64'])

.value('DEFAULT_SETTINGS', {

    // development info
    'api_url'	: 'http://www.smartapps.com.br/api/fp/',
    'api_user'	: false,
    'api_key'	: false,

    // global vars
    'node': 'from',
    'app': '{APP_NAME}'
})

.factory('SMARTAPI', function ($q, $http, $base64, $cookies, $cookieStore, DEFAULT_SETTINGS) {

    _settings = DEFAULT_SETTINGS;

    return {

        // metódo responsável por ceder o conteúdo armazenado no storage.
        _getStorageItem: function (item) {

            r = window.localStorage.getItem(item);
            return r;
        },

        // metódo disponível para setar um item no storage
        _setStorageItem: function (item, val) {
            window.localStorage[item] = val;
            return true;
        },

        // metódo disponível para remover um item do storage
        _removeStorageItem: function (item) {
            delete window.localStorage[item];
            return true;
        },

        //Método responsável por validar a APIConnectKey do usuário
        _validadeApiKeys: function () {
            return (this._getStorageItem('auth.api_user') != undefined || this._getStorageItem('auth.api_key') != undefined);
        },

        // metódo responsável por limpar os dados
        _clear: function () {

            var deferred = $q.defer();

            this
                ._call('close', true)
                .then(function (response) {

                    delete window.localStorage['auth.sessionName'];
                    delete window.localStorage['auth.sessionId'];
                    delete window.localStorage['smart.schema'];

                    $cookieStore.remove('PHPSESSID');

                })

            return deferred.promise;

        },

        // metódo responsável por realizar as requests na API
        _call: function (urlOptionStr, method) {


            urlData = (method == undefined) ? _settings.api_url + "/" + _settings.node + "/" + _settings.app + "/" + urlOptionStr : _settings.api_url + "/" + urlOptionStr;
            urlConn = _settings.api_url + "/from/" + _settings.app;

            clearBeforeSend = this._getStorageItem('data.clearBeforeSend');
            var APIConnectKey = this._getStorageItem('auth.api_user') + ':' + this._getStorageItem('auth.api_key');

            // check if the user is connected
            if (this.check()) {

                // connect the user
                sessionId = this._getStorageItem('auth.sessionId');
                sessionName = this._getStorageItem('auth.sessionName');

                $cookieStore.put(sessionName, sessionId);

                return $http
                    .get(urlData, {
                        headers: {
                            "Authorization": "Basic " + $base64.encode(APIConnectKey),
                            "Set-Cookie": sessionName + "=" + sessionId
                        },
                        withCredentials: true
                    })
                    .success(function (data, status, headers, config) {
                        //$cookieStore.remove(sessionName);
                        objData = data.data;
                        return objData;

                    });

            } else {

                objThis = this;

                $cookieStore.remove('PHPSESSID');

                // connect the user
                return $http
                    .get(urlConn, {
                        headers: {
                            "Authorization": "Basic " + $base64.encode(APIConnectKey),
                            "Set-Cookie": ""
                        },
                        withCredentials: true
                    })
                    .then(function (response) {
                        data = response.data;
                        objData = data.data;

                        if ((objThis._getStorageItem('auth.sessionId') == undefined || objThis._getStorageItem('auth.sessionId') == null) && objData.id != undefined) {

                            window.localStorage['auth.sessionId'] = objData.id;
                            window.localStorage['auth.sessionName'] = objData.name;
                            window.localStorage['auth.authKey'] = "Basic " + $base64.encode(APIConnectKey);
                            $cookieStore.put(objData.name, objData.id);

                            // connect the user
                            sessionId = objData.id;
                            sessionName = objData.name;

                            return $http
                                .get(urlData, {
                                    headers: {
                                        "Authorization": "Basic " + $base64.encode(APIConnectKey),
                                        "Set-Cookie": sessionName + "=" + sessionId
                                    },
                                    withCredentials: true
                                })
                                .success(function (data2, status, headers, config) {

                                    $cookieStore.remove(sessionName);
                                    if (data2.data[0] != undefined) {
                                        window.localStorage['smart.schema'] = data2.data[0];
                                    } else {
                                        window.localStorage['smart.schema'] = data2;
                                    }
                                });
                        } else {
                            return response;
                        }
                    })
            }
        },

        /**
         * Metódo disponível para enviar informações para o server
         * @return {[type]} [description]
         */
        _exec: function (urlOptionStr, type, params) {

            urlData = _settings.api_url + "/exec/json/" + _settings.app + "/" + urlOptionStr;

            clearBeforeSend = this._getStorageItem('data.clearBeforeSend');

            // session data
            sessionId = this._getStorageItem('auth.sessionId');
            sessionName = this._getStorageItem('auth.sessionName');
            var APIConnectKey = this._getStorageItem('auth.api_user') + ':' + this._getStorageItem('auth.api_key');

            // check if the user is connected
            if (this.check()) {
                if (type == "get") {

                    return $http
                        .get(urlData, {
                            headers: {
                                "Authorization": "Basic " + $base64.encode(APIConnectKey),
                                "Set-Cookie": sessionName + "=" + sessionId
                            },
                            withCredentials: true
                        })
                        .then(function (response) {
                            data = response;
                            objData = data.data;
                            return objData;
                        });

                } else if (type == "post") {

                    $cookieStore.put(sessionName, sessionId);

                    return $http
                        .post(urlData, params, {
                            headers: {
                                "Authorization": "Basic " + $base64.encode(APIConnectKey),
                                'Content-Type': 'application/x-www-form-urlencoded',
                                "Set-Cookie": sessionName + "=" + sessionId
                            },
                            withCredentials: true
                        })
                        .then(function (response) {

                            //$cookieStore.remove(sessionName);
                            data = response;
                            objData = data.data;
                            return objData;
                        });
                }
            }
        },

        // método que registra o device
        registerDevice: function (email, pincode) {

            if (email == undefined || pincode == undefined) {
                return;
            };
            var basicAuth = $base64.encode(email + ':' + pincode);
            return $http({
                method: 'POST',
                url: _settings.api_url + '/audl',
                headers: {
                    'Authorization': 'Basic ' + basicAuth
                }
            });
        },

        /**
         * Metódo para realizar a sincronia das informações que está na lista de espera.
         * @return {[type]} [description]
         */
        async: function (fields, method) {

            // obtem a quantidade de registros disponíveis para realizar a sincronia
            itens = _getStorageItem('_smSyncKeysLength');
            syncKey = _getStorageItem('_smSyncKey');

            if (syncKey == undefined) {
                syncKey = 1;
            }

            if (itens == 0) {
                return false;
            }

            // passeia no array disponível
            arrayRecords = new Array;
            arrayLength = new Array;
            for (i = 1; i <= itens; i++) {
                arrayRecords[i] = new Array;
                arrayLength[i] = 0;
                for (x = 0; x < fields.length; x++) {
                    arrayRecords[i][x] = new Array;
                    arrayRecords[i][x]["field"] = fields[x];
                    arrayRecords[i][x]["value"] = _getStorageItem("async-" + i + "." + fields[x]);
                    arrayLength[i] = Number(arrayLength[i] + 1);
                }
                syncKey++;
            }

            if (arrayRecords.length >= 1) {

                // cria a string dos dados
                strParams = "";
                for (i = 1; i <= arrayRecords.length; i++) {
                    for (x = 0; x < arrayLength[i]; x++) {
                        strParams = strParams + arrayRecords[i][x].field + "[]=" + arrayRecords[i][x].value;
                        strParams = strParams + "&";
                    }
                }

                strCall = method;
                strParams = strParams + "tmd=1";

                r = this.execMethod('post', strCall, strParams).then(function (response) {

                    var countSuccess = itens;

                    //Remove todos os syncs com sucesso
                    for (i = 0; i < itens; i++) {
                        if(response.data[i].request.status == 'sucess'){
                           for (x = 0; x < fields.length; x++) {
                               delete window.localStorage["async-" + (i + 1) + "." + fields[x]];

                            }
                            countSuccess--;
                        } else {
                          // não remover  - Adquirir alguma tomada de ação (como mensagem por exemplo)
                          // deixa armazenado para enviar novamente depois.
                        }

                    }

                    _setStorageItem('_smSyncKeysLength', countSuccess);
                    _setStorageItem('_smSyncKey', countSuccess);

                });

                return true;

            } else {

                return false;

            }

        },

        // metódo de configuração para limpar após o envio.
        setClearBeforeSend: function (status) {
            window.localStorage['data.clearBeforeSend'] = 1;
        },

        // metódo para verifica se o usuário possui uma conexão ativa
        check: function () {

            authSessionName = window.localStorage.getItem('smart.schema');

            if (authSessionName == undefined || authSessionName == null) {
                return false;
            } else {
                return true;
            }

        },

        // metódo disponível para pegar os schemas disponíveis
        getSchemas: function () {

            s = this._call('_schemas');
            return s;

        },

        // metódo disponível para pegar conteúdo
        getData: function (strCall) {

            sch = this._getStorageItem('smart.schema');

            if (sch != undefined && sch != null) {

                schema = sch;
                strCall = schema + "/" + strCall;
                gd = this._call(strCall);

                return gd;

            } else {

                objThis = this;
                objBaseSchemas = this.getSchemas();
                getDataContent = objBaseSchemas.then(function (response) {
                    data = response.data;

                    if (objThis._getStorageItem('smart.schema') != undefined && objThis._getStorageItem('smart.schema') != null) {
                        return objThis.getData(strCall);
                    }
                });
                return getDataContent;

            }

        },

        // metódo disponível para enviar informações através do metódo exec.
        execMethod: function (type, strCall, params) {

            sch = this._getStorageItem('smart.schema');

            if (sch != undefined && sch != null) {

                schema = sch;
                strCall = schema + "/" + strCall;
                gd = this._exec(strCall, type, params);

                return gd;

            } else {

                objThis = this;
                objBaseSchemas = this.getSchemas();
                getDataContent = objBaseSchemas.then(function (response) {
                    data = response.data;

                    if (objThis._getStorageItem('smart.schema') != undefined && objThis._getStorageItem('smart.schema') != null) {
                        return objThis.execMethod(type, strCall, params);
                    }
                });

                return getDataContent;

            }

        },

        // metódo disponível para enviar dados de uma forma direta
        sendTo: function (strCall, params) {
            // @TODO create function to call directly with db app.
        }

    }

});