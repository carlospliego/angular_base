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
            var defined = "must be defined";
            this.errors = {
                "ctrl-defined": "If your class extends the base service is must have this.ctrl defined",
                "id-defined": "id " + defined,
                "key-value-defined": "where " + defined,
                "fill-first": "You must call fill on this object",
                "fill-defined": "_fill " + defined,
                "fill-type-object": "_fill must be of type 'object'",
                "method-defined": "'method' " + defined,
                "url-defined": "'url' " + defined,
                "q-defined": "'q' " + defined,
                "$angularBaseConfigProvider_errors": "$angularBaseConfigProvider.api & $angularBaseConfigProvider.cache are not set"
            };

            if (!$angularBaseConfig || !$angularBaseConfig.api || typeof $angularBaseConfig.cache == 'undefined') {
                throw new Error(this.errors["$angularBaseConfigProvider_errors"]);
            }

            this.all = function () {
                if (!this.ctrl) {
                    throw new Error(this.errors["ctrl-defined"]);
                }
                return this.request('GET', null, $angularBaseConfig.api + this.ctrl, null, $q.defer());
            };

            this.get = function (id) {
                if (!id) {
                    throw new Error(this.errors["id-defined"]);
                }
                if (!this.ctrl) {
                    throw new Error(this.errors["ctrl-defined"]);
                }
                return this.request('GET', null, $angularBaseConfig.api + this.ctrl + id, null, $q.defer());
            };

            this.where = function (where) {
                if (!where) {
                    throw new Error(this.errors["key-value-defined"]);
                }
                if (!this.ctrl) {
                    throw new Error(this.errors["ctrl-defined"]);
                }
                return this.request('GET', null, $angularBaseConfig.api + this.ctrl + "?where=" + angular.toJson(where), null, $q.defer());
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
                return this.request('POST', null, $angularBaseConfig.api + this.ctrl, this.data, $q.defer());
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
                return this.request('PUT', null, $angularBaseConfig.api + this.ctrl + id, this.data, $q.defer());
            };

            this.delete = function (id) {
                if (!id) {
                    throw new Error(this.errors["id-defined"]);
                }
                if (!this.ctrl) {
                    throw new Error(this.errors["ctrl-defined"]);
                }
                return this.request('DELETE', null, $angularBaseConfig.api + this.ctrl + id, null, $q.defer());
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
                    cache: $angularBaseConfig.cache
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
