'use strict';

angular.module('angularBase', []);

angular.module('angularBase').provider('$angularBaseConfig', [function () {

    this.$get = function () {
        return this;
    };

    this.config = function (obj) {
        for (var i in obj) {
            this[i] = obj[i];
        }
    };

}]);

angular.module('angularBase').service('Base', ['$rootScope', '$http', '$q', '$angularBaseConfig',
    function Base($rootScope, $http, $q, $angularBaseConfig) {
        function BaseService() {

            // Object Serializer
            /* istanbul ignore next */
            var serialize = function (obj, prefix) {
                var str = [];
                for (var p in obj) {
                    if (obj.hasOwnProperty(p)) {
                        var k = prefix ? prefix + "[" + p + "]" : p, v = obj[p];
                        str.push(typeof v == "object" ?
                            serialize(v, k) :
                        encodeURIComponent(k) + "=" + encodeURIComponent(v));
                    }
                }
                return str.join("&");
            };

            // Expose Serializer
            this.serialize = serialize;

            // Config Options
            this.config = $angularBaseConfig;

            this.errors = {
                "ctrl-defined": "If your class extends the base service is must have this.ctrl defined",
                "id-defined": "id must be defined",
                "key-value-defined": "where must be defined",
                "fill-first": "You must call fill on this object",
                "fill-defined": "_fill must be defined",
                "fill-type-object": "_fill must be of type 'object'",
                "method-defined": "'method' must be defined",
                "url-defined": "'url' must be defined",
                "q-defined": "'q' must be defined",
                "$angularBaseConfigProvider_error": "$angularBaseConfigProvider.api & " +
                "$angularBaseConfigProvider.cache are not set"
            };

            // $angularBaseConfigProvider Error
            if (!this.config || !this.config.api || typeof this.config.cache == 'undefined') {
                throw new Error(this.errors["$angularBaseConfigProvider_error"]);
            }

            this.all = function (paginated) {
                var url, pag;
                if (!this.ctrl) {
                    throw new Error(this.errors["ctrl-defined"]);
                }

                this.config = ($angularBaseConfig.hasOwnProperty('modelConfig') && $angularBaseConfig.modelConfig.hasOwnProperty(this.ctrl))
                    ? $angularBaseConfig.modelConfig[this.ctrl] : $angularBaseConfig;

                pag = typeof paginated == 'object' && Object.keys(paginated).length > 0;

                url = this.config.api + ((pag) ? '/' + this.ctrl :
                    '/' + this.ctrl) + ((pag) ? '?' + serialize(paginated) : "");
                return this.request('GET', null, url, null, $q.defer());
            };

            this.get = function (id) {
                if (!id) {
                    throw new Error(this.errors["id-defined"]);
                }
                if (!this.ctrl) {
                    throw new Error(this.errors["ctrl-defined"]);
                }
                this.config = ($angularBaseConfig.hasOwnProperty('modelConfig') && $angularBaseConfig.modelConfig.hasOwnProperty(this.ctrl))
                    ? $angularBaseConfig.modelConfig[this.ctrl] : $angularBaseConfig;

                return this.request('GET', null, this.config.api + '/' + this.ctrl + '/' + id, null, $q.defer());
            };

            this.where = function (where) {
                if (!where) {
                    throw new Error(this.errors["key-value-defined"]);
                }
                if (!this.ctrl) {
                    throw new Error(this.errors["ctrl-defined"]);
                }
                this.config = ($angularBaseConfig.hasOwnProperty('modelConfig') && $angularBaseConfig.modelConfig.hasOwnProperty(this.ctrl))
                    ? $angularBaseConfig.modelConfig[this.ctrl] : $angularBaseConfig;

                return this.request('GET', null, this.config.api + '/' + this.ctrl + '/' + "?where=" + angular.toJson(where), null,
                    $q.defer());
            };

            this.fill = function (_fill) {
                if (!_fill) {
                    throw new Error(this.errors["fill-defined"]);
                }
                if (typeof _fill !== "object") {
                    throw new Error(this.errors["fill-type-object"]);
                }
                this.config = ($angularBaseConfig.hasOwnProperty('modelConfig') && $angularBaseConfig.modelConfig.hasOwnProperty(this.ctrl))
                    ? $angularBaseConfig.modelConfig[this.ctrl] : $angularBaseConfig;
                this.data = _fill;
            };

            this.create = function () {
                if (!this.data) {
                    throw new Error(this.errors["fill-first"]);
                }
                if (!this.ctrl) {
                    throw new Error(this.errors["ctrl-defined"]);
                }
                this.config = ($angularBaseConfig.hasOwnProperty('modelConfig') && $angularBaseConfig.modelConfig.hasOwnProperty(this.ctrl))
                    ? $angularBaseConfig.modelConfig[this.ctrl] : $angularBaseConfig;
                return this.request('POST', null, this.config.api + '/' + this.ctrl + '/', this.data, $q.defer());
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
                this.config = ($angularBaseConfig.hasOwnProperty('modelConfig') && $angularBaseConfig.modelConfig.hasOwnProperty(this.ctrl))
                    ? $angularBaseConfig.modelConfig[this.ctrl] : $angularBaseConfig;
                return this.request('PUT', null, this.config.api + '/' + this.ctrl + '/' + id, this.data, $q.defer());
            };

            this.delete = function (id) {
                if (!id) {
                    throw new Error(this.errors["id-defined"]);
                }
                if (!this.ctrl) {
                    throw new Error(this.errors["ctrl-defined"]);
                }
                this.config = ($angularBaseConfig.hasOwnProperty('modelConfig') && $angularBaseConfig.modelConfig.hasOwnProperty(this.ctrl))
                    ? $angularBaseConfig.modelConfig[this.ctrl] : $angularBaseConfig;
                return this.request('DELETE', null, this.config.api + '/' + this.ctrl + '/' + id, null, $q.defer());
            };

            this.request = function (method, header, url, data, q) {
                if (!method || (method != "POST" && method != "GET" && method != "PUT" && method != "DELETE")) {
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
                    cache: this.config.cache
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
    }]);