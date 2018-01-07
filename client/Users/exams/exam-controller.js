angular.module('app')
.controller('examCtrl',['$scope','$http','userSvc',function($scope,$http,userSvc){
    var config ={
        "headers":{
            "auth-token":userSvc.token
        }
    }
    $scope.listExams = function(){
        $http.get('/secure/api/user/listExams',config).then(function(response){
        
        }, function(err){
            console.log(err);
        })
    }
    
    $scope.listExams();
    
    
}])