angular.module('app')
.controller('teachercourseTabCtrl',['$scope','$http','userSvc','dataSvc','$stateParams',function($scope,$http,userSvc,dataSvc,$stateParams){
    var config ={
        "headers":{
            "auth-token":userSvc.token
        }
    }
    
    var index = localStorage.getItem('index');
    var tCourse = JSON.parse(localStorage.getItem('openedtcTabs')).array[index];
    $scope.setCourse(tCourse);
    $scope.courseName=$stateParams.name;
    $scope.sourceresp;
    $scope.imageExists=function(image_url){

        var http = new XMLHttpRequest();

        http.open('HEAD', image_url, false);
        http.send();
        return http.status != 404;

    } 
    $scope.details =true;
    $scope.slidename="Student's List";
    $scope.slideChange = function(){
        console.log($scope.details);
        $scope.details = !$scope.details;
        if($scope.details){
            $scope.slidename="Student's List";
        }
        else{
            $scope.slidename ="Timetable";
        }
        
    }
    
    $scope.studentsList;
    
    $scope.getStudents = function(){
        var requestedData={
            'courseName':$scope.courseName
        }
        $http.post("/secure/api/user/getStudenstByCourse",requestedData,config).then(function(response){
            $scope.studentsList = response.data.data;
            console.log("aqui");
            console.log(response.data.data);
        },function(err){
            console.log(err);
        });
    };
    $scope.getStudents();
    
    $scope.classes=[];
    
    $scope.loadCalendar=function(){
        var hours;
        var classesTemp=[];
        $http.get("/secure/api/user/getHours",config).then(function(response){
            hours=response.data.data;
            
            for(var i=0; i<hours.length; i++){
                classesTemp[i]=[];
                //5 dias da semana +1 para horas
                for(var j=0; j<6;j++){
                   classesTemp[i][j]={
                       'haveClass':false
                   };
               } 
            }
            
            for(var i=0; i<hours.length; i++){
                classesTemp[i][0]=hours[i];
            }
            
            var requestedData={
                'courseName':$scope.courseName
            }

            $http.post("/secure/api/user/getScheduleClasses",requestedData,config).then(function(response){
                
                var temp=response.data.data;
                var line=0;
                for(var i=0; i<temp.length; i++){
                    while(temp[i].IDHORA!=classesTemp[line][0].IDHORA){
                        line++;
                    }
                    classesTemp[line][temp[i].WD-1]=temp[i];
                    classesTemp[line][temp[i].WD-1].haveClass=true;
                }
                
                
                console.log(classesTemp);
                console.log(Object.keys(classesTemp[0][2]).length == 0);
                $scope.classes=classesTemp;

            },function(err){

            });
            
        },function(err){
            
        });
    }
    $scope.loadCalendar();
    
}])