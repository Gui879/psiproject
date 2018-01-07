angular.module('app')
.controller('teachercoursesCtrl',['$scope','$http','userSvc','dataSvc',function($scope,$http,userSvc,dataSvc){
    var config ={
        "headers":{
            "auth-token":userSvc.token
        }
    }
    
    
    
    $scope.teachercoursesList;
    $scope.teachername;


    $scope.listteacherCourses=function(userid){
        var requestedData={
            'userid':userid
        }
        $http.post("/secure/api/user/coursesListbyTeacher",requestedData,config).then(function(response){
            console.log("Teacher class found!");
            $scope.teachercoursesList=response.data.data;
            console.log($scope.teachercoursesList);
            if(response.data.data.length==0){
                $("#menu>#warning").css("display","block");
                $("#searchBar").css("display","none");
            }else{
                $("#menu>#warning").css("display","none");
                $("#searchBar").css("display","inline-block");
            }
        },function(err){
            console.log("Teacher class not found!");
        })
        
    }
    
    $("#searchBar>input").focusin(function(){
        $("#searchBar").css("background-color","rgba(92,102,108,0.7)");
    });
    $("#searchBar>input").focusout(function(){
        $("#searchBar").css("background-color","rgba(92,102,108,0.3)");
    });
    
    $scope.teachernam=function(teacherid){
        var requesteduserid={
            'teacherid':teacherid
        }
        $http.post("/secure/api/user/teachername",requesteduserid,config).then(function(response){
            console.log("Teacher Name Found!");
            $scope.teachername=response.data.data;
            console.log($scope.teachername);


        },function(err){
            console.log("Teacher name not found!");
        })
    }

    $scope.popupshow = function(){
        $(document).ready(function(){
                $("#menuDark").css("display", "block");
            });
    }
    $scope.popuphide = function(){
        $(document).ready(function(){
                $("#menuDark").css("display", "none");
            });
    }
    $scope.user_id;
    $scope.listteacherCourses(JSON.parse(localStorage.getItem('user')).IDUSER);
    $scope.teachernam(JSON.parse(localStorage.getItem('user')).IDUSER);

}])