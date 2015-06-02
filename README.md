angular_base [ Website ](http://carlospliego.github.io/angular_base/)
============
#This is a base service class that allows for modal creation in angularJs
This allows you to take advantage of the base class without having to re-write a bunch of CRUD code. Here is how you implement it.

Define a service: **services/user.js**

    'use strict';

    app.service('User', function User(Base) {

        function UserService() {
            this.ctrl = "user/";
        }

        UserService.prototype = new Base();
        return new UserService();
    });
    
####Override $angularBaseConfigProvider in a model
    
    app.service('User', function User(Base) {
        var U;
        function UserService() {
            this.ctrl = "user/";
        }

        UserService.prototype = new Base();
        U = new UserService();
        U.setConfig({
            api: "http://localhost:9000/",
            cache: true
        });
        return U;
    });
    
##CRUD Operations:
####Create
    User.fill({name:"Bob"});
    User.create().then(function(res){
    	   // Created
    });
 
####Retrieve all
    
    User.all().then(function(res){
    	   // All
    });
    
####Retrieve all paginated
    
Paginated object can be anything you want and will converted to a query string.
For example: ?page=2&limit=4&per_page=4
    
    User.all({page:2, limit:4, per_page: 4}).then(function(res){
           // All
    });
 
####Retrieve 

    User.get(id).then(function(res){
    	   // Get By Id
    });
 
####Where 

    User.where({key:value,..}).then(function(res){
    	   // Get By value pair
    });

####Update
    User.fill({name:"Carrie"});
    User.update(id).then(function(res){
    	   // Updated
    });
    
####Delete
    User.delete(id).then(function(res){
    	   // Deleted
    });
    
##Installation :

    bower install --save angular-base
    <script src="path/to/bower/angular-base/base.js"></script>

#### Inject Module    
    angular.module('myApp', ['angularBase'])
    
####Implement Constants
    $angularBaseConfigProvider.config({
       api:"http://localhost:8081/",
       cache:false
    });

---

##Development :

    npm install
    bower install
    
#### Gulp
    test
    test-coverage
    build
    

