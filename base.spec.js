describe('Base', function () {

    beforeEach(module('angularBase', function ($angularBaseConfigProvider, $provide) {
        // Mock constants here
        $angularBaseConfigProvider.config({
            api:"http://localhost:8081/",
            cache:false
        });
        // Mock a service implementation
        $provide.service('Apple', function (Base) {
            function UserService() {
                this.ctrl = "apple/";
            }

            UserService.prototype = new Base();
            return new UserService();
        });
    }));

    it('should have a defined controller', inject(function (Apple) {
        expect(Apple.ctrl).toBeDefined();
    }));

    // Base.all()
    describe('all()', function () {

        it('should return a promise', inject(function (Apple) {
            expect(Apple.all().then).toBeDefined();
        }));

        it('should throw an extends error', inject(function (Apple) {
            var copy = angular.copy(Apple);
            Apple.ctrl = "";

            expect(function () {
                Apple.all()
            }).toThrow(new Error("If your class extends the base service is must have this.ctrl defined"));

            // Restore to normal
            Apple.ctrl = copy.ctrl;
        }));
    });

    // Base.get()
    describe('get()', function () {

        it('should return a promise', inject(function (Apple) {
            expect(Apple.get(1).then).toBeDefined();
        }));

        it('should throw an id error', inject(function (Apple) {
            expect(function () {
                Apple.get()
            }).toThrow(new Error("id must be defined"));
        }));

        it('should throw an extends error', inject(function (Apple) {
            var copy = angular.copy(Apple);
            Apple.ctrl = "";

            expect(function () {
                Apple.get(1)
            }).toThrow(new Error("If your class extends the base service is must have this.ctrl defined"));

            // Restore to normal
            Apple.ctrl = copy.ctrl;
        }));
    });

    // Base.where()
    describe('where()', function () {

        it('should return a promise', inject(function (Apple) {
            expect(Apple.where({}).then).toBeDefined();
        }));

        it('should throw a where error', inject(function (Apple) {
            expect(function () {
                Apple.where()
            }).toThrow(new Error("where must be defined"));
        }));

        it('should throw an extends error', inject(function (Apple) {
            var copy = angular.copy(Apple);
            Apple.ctrl = "";

            expect(function () {
                Apple.where({})
            }).toThrow(new Error("If your class extends the base service is must have this.ctrl defined"));

            // Restore to normal
            Apple.ctrl = copy.ctrl;
        }));
    });

    // Base.fill()
    describe('fill()', function () {
        it('should fill correctly', inject(function (Apple) {
            var filler = {name: 'tester', id: '1234'};
            Apple.fill(filler);
            expect(Apple.data).toBe(filler);
            delete Apple.data;
        }));

        it('should throw fill undefined error', inject(function (Apple) {
            expect(function () {
                Apple.fill()
            }).toThrow(new Error("_fill must be defined"));
        }));

        it('should throw fill wrong type error', inject(function (Apple) {
            expect(function () {
                Apple.fill("f")
            }).toThrow(new Error("_fill must be of type 'object'"));
            expect(function () {
                Apple.fill(1)
            }).toThrow(new Error("_fill must be of type 'object'"));
        }));

    });

    // Base.create()
    describe('create()', function () {
        it('should return a promise', inject(function (Apple) {
            Apple.fill({});
            expect(Apple.create().then).toBeDefined();
            delete Apple.data;
        }));

        it('should throw has not been filled error', inject(function (Apple) {
            expect(function () {
                Apple.create()
            }).toThrow(new Error("You must call fill on this object"));
        }));

        it('should throw an extends error', inject(function (Apple) {
            var copy = angular.copy(Apple);
            Apple.ctrl = "";
            Apple.fill({});
            expect(function () {
                Apple.create()
            }).toThrow(new Error("If your class extends the base service is must have this.ctrl defined"));

            // Restore to normal
            Apple.ctrl = copy.ctrl;
            delete Apple.data;
        }));
    });

    // Base.update()
    describe('create()', function () {
        it('should return a promise', inject(function (Apple) {
            Apple.fill({});
            expect(Apple.update(1).then).toBeDefined();
            delete Apple.data;
        }));

        it('should throw has not been filled error', inject(function (Apple) {
            expect(function () {
                Apple.update()
            }).toThrow(new Error("You must call fill on this object"));
        }));

        it('should throw an extends error', inject(function (Apple) {
            var copy = angular.copy(Apple);
            Apple.ctrl = "";
            Apple.fill({});
            expect(function () {
                Apple.update()
            }).toThrow(new Error("If your class extends the base service is must have this.ctrl defined"));

            // Restore to normal
            Apple.ctrl = copy.ctrl;
            delete Apple.data;
        }));

        it('should throw id undefined error', inject(function (Apple) {
            Apple.fill({});
            expect(function () {
                Apple.update()
            }).toThrow(new Error("id must be defined"));
            delete Apple.data;
        }));
    });

    // Base.delete()
    describe('delete()', function () {
        it('should return a promise', inject(function (Apple) {
            expect(Apple.delete(1).then).toBeDefined();
            delete Apple.data;
        }));

        it('should throw id undefined error', inject(function (Apple) {
            expect(function () {
                Apple.delete()
            }).toThrow(new Error("id must be defined"));
        }));

        it('should throw an extends error', inject(function (Apple) {
            var copy = angular.copy(Apple);
            Apple.ctrl = "";
            expect(function () {
                Apple.delete(1)
            }).toThrow(new Error("If your class extends the base service is must have this.ctrl defined"));

            // Restore to normal
            Apple.ctrl = copy.ctrl;
        }));
    });

    // Base.request()
    describe('request()', function () {
        it('should return a promise', inject(function (Apple, $q) {
            expect(Apple.request('GET', null, "/someurl", {}, $q.defer()).then).toBeDefined();
        }));

        it('should throw a method error', inject(function (Apple, $q) {
            expect(function () {
                Apple.request('GETf', null, "/someurl", {}, $q.defer())
            }).toThrow(new Error("'method' must be defined"));
        }));

        it('should throw a url error', inject(function (Apple, $q) {
            expect(function () {
                Apple.request('GET', null, "", {}, $q.defer())
            }).toThrow(new Error("'url' must be defined"));
        }));

        it('should throw a q error', inject(function (Apple) {
            expect(function () {
                Apple.request('GET', null, "/someurl", {}, {})
            }).toThrow(new Error("'q' must be defined"));
        }));

        it('should pass a header object', inject(function (Apple, $q) {
            Apple.request('GET', {}, "/someurl", {}, $q.defer())
        }));

        it('should throw an http error', inject(function (Apple, $q, $httpBackend) {
            $httpBackend.expectGET('/someerrorurl').respond(500, '');
            Apple.request('GET', {}, "/someerrorurl", {}, $q.defer())
            $httpBackend.flush();
        }));

        it('should not throw an http error', inject(function (Apple, $q, $httpBackend) {
            $httpBackend.expectGET('/someerrorurl').respond(200, '');
            Apple.request('GET', {}, "/someerrorurl", {}, $q.defer())
            $httpBackend.flush();
        }));

    });
});
