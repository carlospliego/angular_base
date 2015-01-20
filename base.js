'use strict';

angular.module('angularBase', []);
angular.module('angularBase').service('Base', function Base($rootScope, $http, $q, PATHS, REQUEST_CACHE) {
    function BaseService() {

        var defined = "must be defined";
        this.errors = {
            "ctrl-defined": "If your class extends the base service is must have this.ctrl defined",
            "id-defined": "id " + defined,
            "key-value-defined": "wher " + defined,
            "fill-first": "You must call fill on this object",
            "fill-defined": "_fill " + defined,
            "fill-type-object": "_fill must be of type 'object'",
            "method-defined": "'method' " + defined,
            "url-defined": "'url' " + defined,
            "q-defined": "'q' " + defined
        };

        this.all = function () {
            if (!this.ctrl) {
                throw new Error(this.errors["ctrl-defined"]);
            }
            return this.request('GET', null, PATHS.api_host + this.ctrl, null, $q.defer());
        };

        this.get = function (id) {
            if (!id) {
                throw new Error(this.errors["id-defined"]);
            }
            if (!this.ctrl) {
                throw new Error(this.errors["ctrl-defined"]);
            }
            return this.request('GET', null, PATHS.api_host + this.ctrl + id, null, $q.defer());
        };

        this.where = function (where) {
            if (!where) {
                throw new Error(this.errors["key-value-defined"]);
            }
            if (!this.ctrl) {
                throw new Error(this.errors["ctrl-defined"]);
            }
            return this.request('GET', null, PATHS.api_host + this.ctrl + "?where="+angular.toJson(where), null, $q.defer());
        };

        this.fill = function (_fill) {
            if (!_fill) {
                throw new Error(this.errors["fill-defined"]);
            }
            if (typeof _fill !== "object") {
                throw new Error(this.errors["fill-type-object"]);
            }
            this.data = _fill;
        };

        this.create = function () {
            if (!this.data) {
                throw new Error(this.errors["fill-first"]);
            }
            if (!this.ctrl) {
                throw new Error(this.errors["ctrl-defined"]);
            }
            return this.request('POST', null, PATHS.api_host + this.ctrl, this.data, $q.defer());
        };

        this.update = function (id) {
            if (!this.data) {
                throw new Error(this.errors["fill-first"]);
            }
            if (!this.ctrl) {
                throw new Error(this.errors["ctrl-defined"]);
            }
            if (!id) {
                throw new Error(this.errors["id-defined"]);
            }
            return this.request('PUT', null, PATHS.api_host + this.ctrl + id, this.data, $q.defer());
        };

        this.delete = function (id) {
            if (!id) {
                throw new Error(this.errors["id-defined"]);
            }
            if (!this.ctrl) {
                throw new Error(this.errors["ctrl-defined"]);
            }
            return this.request('DELETE', null, PATHS.api_host + this.ctrl + id, null, $q.defer());
        };

        this.request = function (method, header, url, data, q) {
            if (!method || (method!="POST" && method!="GET" && method!="PUT" && method!="DELETE")) {
                throw new Error(this.errors["method-defined"]);
            }
            if (!url) {
                throw new Error(this.errors["url-defined"]);
            }
            if (!q || !q.promise) {
                throw new Error(this.errors["q-defined"]);
            }

            $http({
                method: method,
                url: url,
                data: data,
                header: (header) ? header : "{Content-Type: application/json}",
                cache: REQUEST_CACHE
            }).success(function (data, status, headers) {
                var results = {};
                results.data = data;
                results.headers = headers;
                results.status = status;
                q.resolve(results);
            }).error(function (data, status, headers) {
                var results = {};
                results.data = data;
                results.headers = headers;
                results.status = status;
                q.resolve(results);
            });
            return q.promise;
        };
    }

    return BaseService;
});


angular.module('angularBase').service('Auth', function AuthService(Base, $q, $window, $rootScope, $location, PUBLIC_ROUTES, PATHS) {

    function TokenHelper() {
        this.remove = function () {
            delete $window.sessionStorage.token;
            $.cookie('token', null);
            $.cookie('force_out', true);
        };
        this.create = function (token, remember) {
            $.cookie('force_out', null);
            if (remember) {
                $.cookie('token', token, {expires: 365});
            }
            $window.sessionStorage.token = token;
        };
    }

    function LocationEvaluator() {
        this.evaluate = function (url) {
            // Evaluate current location (synchronous)
            if (!inArray(url, PUBLIC_ROUTES)) {
                if ($rootScope.auth === false) {
                    return $location.path("#/");
                }
            }
        };
    }

    function validateToken(token) {
        base.request('POST', null, PATHS.api_host + ctrl + 'validatetoken', {token: token}, $q.defer()).then(function (res) {
            if (res.data.success) {
                $window.sessionStorage.token = token;
                $rootScope.auth = true;
                $rootScope.user = res.data.user[0];
            } else {
                th.remove();
                $rootScope.auth = false;
                if ($rootScope.hasOwnProperty('user')) {
                    delete $rootScope.user;
                }
            }
        });
    }

    function Auth() {
        this.login = function (user, remember) {
            var r = base.request('POST', null, PATHS.api_host + ctrl + 'login', user, $q.defer());
            r.then(function (res) {
                if (res.data.success) {
                    th.create(res.data.token, remember);
                    $rootScope.auth = true;
                    $rootScope.user = res.data.user[0];
                } else {
                    th.remove();
                    $rootScope.auth = false;
                    if ($rootScope.hasOwnProperty('user')) {
                        delete $rootScope.user;
                    }
                }
            });
            return r;
        };

        this.logout = function () {
            th.remove();
            $rootScope.auth = false;
            le.evaluate($location.url());
            if ($rootScope.hasOwnProperty('user')) {
                delete $rootScope.user;
            }
        };

        this.resolved = function () {
            // Responds with an authentication resolution when available.
            var d = $q.defer(), w;
            // Wait for authentication then resolve the forms
            w = $rootScope.$watch('auth', function () {
                if (typeof $rootScope.auth != 'undefined') {
                    return d.resolve(true);
                    w();
                }
            });
            return d.promise;
        };

        this.resolveToken = function (data) {
            th.create(data.token, true);
            $rootScope.auth = true;
            $rootScope.user = data.user[0];
        };

        this.loadPersistedToken = function () {
            var cookie_token = ($.cookie("token") == 'null') ? null : $.cookie("token");
            var remember_me = (cookie_token != null) ? true : false;
            // If remember me
            if (remember_me) {
                th.create(false);
                validateToken(cookie_token);
            } else {
                var force_out = ($.cookie("force_out") == 'null') ? null : $.cookie("force_out");
                if (force_out) {
                    // If forced out by other tab
                    th.remove();
                    $rootScope.auth = false;
                    if ($rootScope.hasOwnProperty('user')) {
                        delete $rootScope.user;
                    }
                } else {
                    if ($window.sessionStorage.hasOwnProperty('token') && $window.sessionStorage.token) {
                        th.create(false);
                        validateToken(cookie_token);
                    } else {
                        th.remove();
                        $rootScope.auth = false;
                        if ($rootScope.hasOwnProperty('user')) {
                            delete $rootScope.user;
                        }
                    }
                }
            }
        };

        this.loadLocationInterceptor = function () {
            // This function loads a watcher and evaluates the current route against authentication.
            var w = $rootScope.$watch('auth', function () {
                if ($rootScope.hasOwnProperty('auth')) {
                    // Evaluate future location changes (asynchronous)
                    $rootScope.$on('$locationChangeStart', function (event, next, current) {
                        return le.evaluate($location.url());
                    });

                    le.evaluate($location.url());
                    w();
                }
            });
        };
    }

    var th = new TokenHelper();
    var le = new LocationEvaluator();
    var ctrl = 'auth/';
    var base = new Base();

    return new Auth();
});