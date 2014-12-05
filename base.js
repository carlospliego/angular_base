'use strict';
angular.module('angularBase', []);
angular.module('angularBase').service('Base', function Base($rootScope, $http, $q, PATHS, REQUEST_CACHE) {
    function BaseService() {

        var defined = "must be defined";
        this.errors = {
            "ctrl-defined": "If your class extends the base service is must have this.ctrl defined",
            "id-defined": "id " + defined,
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