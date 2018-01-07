angular.module('app')
.controller('adminCtrl',['$scope','$http','userSvc','dataSvc','$state',function($scope,$http,userSvc,dataSvc,$state){
    var config ={
        "headers":{
            "auth-token":userSvc.token
        }
    };
}]);