angular_base
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
    
##CRUD Opperations:
####Create
    User.fill({name:"Bob"});
    User.create().then(function(res){
    	   // Created
    });
 
####Retrieve all
    
    User.all().then(function(res){
    	   // All
    });
 
####Retrieve 

    User.get(id).then(function(res){
    	   // Get By Id
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
    angular.module('myApp')
    .constant('REQUEST_CACHE', false)
    .constant('PATHS', {
        host: host,
        api_host: hosts[host].api_host
    });
    
    
