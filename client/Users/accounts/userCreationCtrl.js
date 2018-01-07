angular.module('app')
.controller('userCreationCtrl',['$scope','$http','userSvc','dataSvc',function($scope,$http,userSvc,dataSvc){
    var config ={
        "headers":{
            "auth-token":userSvc.token
        }
    }
    
    $scope.user ={
        "type":"a"
    }
      
    $scope.listCourses = function(){
        $http.get("/secure/api/user/listCourses",config).then(function(response){
            $scope.courseList = response.data.data;
        }, function(err){
            console.log(err);
        })
    }
    $scope.createUser = function(user){
        //validate input
        $http.post("/secure/api/user/createUser",user,config).then(function(response){
            $scope.result = "User created sucessfully!"
        },function(err){
            $scope.result = "Error!"
            console.log(err);
        });
        
    };
    
    
    $scope.listCourses();
    
}])