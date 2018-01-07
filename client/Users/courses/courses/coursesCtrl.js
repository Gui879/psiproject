angular.module('app')
.controller('coursesCtrl',['$scope','$http','userSvc','dataSvc',function($scope,$http,userSvc,dataSvc){
    var config ={
        "headers":{
            "auth-token":userSvc.token
        }
    }
    
    $scope.coursesList;
    $scope.selectedTeacher;

    $scope.listCourses=function(){               
        $http.get("/secure/api/user/coursesList",config).then(function(response){
            console.log("Programs List founded!");
            $scope.coursesList=response.data.data;
            
        },function(err){
            console.log("Programs List not founded!");
        })
        
    }
    
    $scope.popupshow = function(){
        $("#menuDark").css("display", "block");
        //THIS IS VERY WRONG
    }
    
    $scope.popuphide = function(){
        $(document).ready(function(){
                $("#menuDark").css("display", "none");
            });
        $("#courseName").css("background-color","rgba(92,102,108,0.3)");
        $("#teacherId").css("background-color","rgba(92,102,108,0.3)");
        $("#courseTime").css("background-color","rgba(92,102,108,0.3)");
        $scope.course={};
        $scope.teacherimg="/client/profilepics/default.png";
    }
    
    $scope.listCourses();
    
    $scope.course={};
    
    $scope.teachersList;
    
    $scope.getTeacherList=function(){
        $http.get("/secure/api/user/teachersList",config).then(function(response){
            console.log("Programs List founded!");
            $scope.teachersList=response.data.data;
            console.log($scope.teachersList);
            console.log("teacher" + $scope.teachersList[0].NAME);
        },function(err){
            console.log("Programs List not founded!");
        })
    }
    
    $scope.teacherName;
    $scope.teacherimg="/client/profilepics/default.png";
    $scope.getTeacherName=function(){
        for (var i=0; i<$scope.teachersList.length;i++){
            if($scope.teachersList[i].IDPROFESSOR==$scope.course.teacherid){
                $scope.teacherName=$scope.teachersList[i].NAME;
                $scope.teacherimg="/client/profilepics/" + $scope.teachersList[i].NUMINST +".png";
                if(!$scope.imageExists($scope.teacherimg)){
                   $scope.teacherimg="/client/profilepics/default.png"; 
                }
                    return $scope.teachersList[i].NAME;
            }
        }
    }
    
    $scope.imageExists=function(image_url){

        var http = new XMLHttpRequest();

        http.open('HEAD', image_url, false);
        http.send();
        console.log("satus");
        return http.status != 404;

    }
    
    $scope.getTeacherList(); 
    
    $scope.createCourse = function(course){
        $("#courseName").css("background-color","rgba(92,102,108,0.3)");
        $("#teacherId").css("background-color","rgba(92,102,108,0.3)");
        $("#courseTime").css("background-color","rgba(92,102,108,0.3)");
        if(course.name==undefined || course.teacherid==undefined || course.time==undefined){
            if(course.name==undefined){
                $("#courseName").css("background-color","rgba(255,0,0,0.5)");
            }
            if(course.teacherid==undefined){
                $("#teacherId").css("background-color","rgba(255,0,0,0.5)");
            }
            if(course.time==undefined){
                $("#courseTime").css("background-color","rgba(255,0,0,0.5)");
            }
        }else{
            $http.post("/secure/api/user/createCourse",course,config).then(function(response){
                $scope.result = "User created sucessfully!"
                $scope.coursesList.push({
                    'TEACHER':$scope.getTeacherName(),
                    'NAME':course.name
                });
                $scope.popuphide();
                $scope.course=null;
            },function(err){
                $scope.result = "Error!"
                console.log(err);
            });
        }
    };
    
}])