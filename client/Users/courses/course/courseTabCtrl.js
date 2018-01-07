angular.module('app')
.controller('courseTabCtrl',['$scope','$http','userSvc','dataSvc','$stateParams','$state',function($scope,$http,userSvc,dataSvc,$stateParams,$state){
    var config ={
        "headers":{
            "auth-token":userSvc.token
        }
    }
    
    var index = localStorage.getItem('index');
    var idcourse;
    $scope.teachername;
    $scope.sourceresp;
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
    $scope.editmode='Edit';
    $scope.editOption=false;
    $scope.teacherList;
    var setResponsible= function(id){
        for (var i = 0; i <$scope.teacherList.length;i++){
            var teacher = $scope.teacherList[i];
            
            if(teacher.IDPROFESSOR == id){
                $scope.teachername=teacher.name;
                return teacher.name;
            }
        }
    };
    $scope.changeOption=function(){
        
        if(!$scope.editOption){
            $scope.editOption=!$scope.editOption;
            $scope.editmode='Done';
        }else if($scope.editOption){
            showPopup('editpopup');
        }
        console.log($scope.editOption);
    }
    
    var showPopup= function(id){
        $("#menuDark").children().css("display", "none");
        $("#menuDark").css("display", "block");
        $("#menuDark>#"+id).css("display", "block");
    };
    $scope.closePopup=function(){
        $("#menuDark").css("display", "none");
        $scope.editOption=false;
        $scope.editmode='Edit';
    };
    $scope.showDelPopup=function(){
        showPopup('deletepopup');
    }
    $scope.applyChanges=function(){
        var requestedData ={
            'idcadeira':idcourse,
            'nome':$scope.courseName,
            'idprofessor':$scope.teacherid
        }
        $http.post('secure/api/user/updateCourse',requestedData,config).then(function(response){
            var tabs = JSON.parse(localStorage.getItem('openedcTabs')).array;
            $scope.selectedCourse.NAME = $scope.courseName;
            
            tabs[index]=$scope.selectedCourse;
             var params ={
                 'name':$scope.selectedCourse.NAME,
                 'index':index
            }
            
            var item = {
                'array':tabs
            }
            localStorage.setItem('openedcTabs',JSON.stringify(item));
            showPopup('editsucess');
            setResponsible($scope.teacherid);
            setTimeout(function(){
                $scope.closePopup();
                console.log("about to launch");
                $scope.tabs[index] = tabs[index];
                $state.go('user.courses.courseTab',params);
                $state.reload();
            },2500);
            
        }, function(err){
            showPopup('failure');
            setTimeout(function(){
                $scope.closePopup();
            },2500);
        })
    }
    $scope.deleteCourse=function(){
        var data={
            'id':idcourse
        };
        console.log("Deleted");
        $http.post("/secure/api/user/deleteCourse",data,config).then(function(response){
            console.log("Deleted sucess");
            showPopup('deletesucess');
            setTimeout(function(){
                $scope.closeTab(index,$scope.selectedCourse);
                $state.go('user.courses.list');
            },2500);
        }, function(err){
            showPopup('failure');
            setTimeout(function(){
                $scope.closePopup();
            },2500);
            console.log(err);
        })
    }
    $scope.imageExists=function(image_url){

        var http = new XMLHttpRequest();

        http.open('HEAD', image_url, false);
        http.send();
        return http.status != 404;

    } 
    
    $scope.loadData= function(){
        $scope.selectedCourse=JSON.parse(localStorage.getItem('openedcTabs')).array[index];
        $scope.setCourse($scope.selectedCourse);
        $scope.courseName=$scope.selectedCourse.NAME;
         var requestedData={
            'nome':$scope.courseName
        }
        $http.post("/secure/api/user/getcourseID",requestedData,config).then(function(response){
            if(response.data.data.length ==0){
                $scope.closeTab(index,$scope.selectedCourse);
            }else{
                 requestedData={
                    'idcadeira':response.data.data[0].idcadeira
                }
                idcourse= response.data.data[0].idcadeira;
                $http.post('/secure/api/user/getCourse',requestedData,config).then(function(response){
                var cadeira= response.data.data[0];
               
                requestedData={
                    'teacherid':response.data.data[0].IDPROFESSOR
                }
                $scope.teacherid=response.data.data[0].IDPROFESSOR;
                $http.post('/secure/api/user/teachername',requestedData,config).then(function(response){
                $scope.teachername = response.data.data[0].NAME
                     
                     
                 }, function(err){
                     console.log(err);
                 });
                
                requestedData={
                'responsible':response.data.data[0].IDPROFESSOR
                }
                
                listTeachers();
                $http.post('/secure/api/user/getNumInstID',requestedData,config).then(function(response){
                    
                    var numinst = response.data.data[0].numinst;
                    $scope.sourceresp="/client/profilepics/"+ numinst +".png";
                    if(!$scope.imageExists($scope.sourceresp)){
                       $scope.sourceresp="/client/profilepics/default.png"; 
                    }
                }, function(err){
                    console.log(err);
                });
                
            }, function(err){
                console.log(err);
            })
                
                
            }
           
        }, function(err){
            console.log(err);
        })
         
     }
    var listTeachers = function(){
        $http.get('/secure/api/user/listTeachers',config).then(function(response){
            $scope.teacherList = response.data.data;
            
            //setFormData();
        },function(err){
            console.log(err);
        })
    };
    $scope.insertClass=function(row,column){
        var days=[11,12,13,14,15];
        
        var idhora=$scope.classes[row][0].IDHORA;
        var day=days[column];
        
        var requestedData={
            'nome':$scope.courseName
        }
      
        $http.post("/secure/api/user/getcourseID",requestedData,config).then(function(response){
            var cadeira=response.data.data[0].idcadeira;
            console.log(cadeira);
            var dataToSend={
            'day':day,
            'idhora':idhora,
            'idsala':$scope.selectedRoom,
            'idcadeira':response.data.data[0].idcadeira
            };
            $http.post("/secure/api/user/insertClass",dataToSend,config).then(function(response){
                console.log("class created!")

            },function(err){
                console.log(err);
            });
            
        },function(err){
            console.log(err);
        });
        console.log("HELLOOOOOOOO");
    }
    $scope.rooms;
    $scope.selectedRoom;
    $scope.getRooms=function(){
        $http.get("/secure/api/user/getRooms",config).then(function(response){
            $scope.rooms = response.data.data;
            
        },function(err){
            console.log(err);
        });
    }
    
    $scope.getRooms();
    
    $scope.loadCalendar();
    
    $scope.studentsList;
    $scope.loadData();
    $scope.getStudents = function(){
        var requestedData={
            'courseName':$scope.courseName
        }
        $http.post("/secure/api/user/getStudenstByCourse",requestedData,config).then(function(response){
            $scope.studentsList = response.data.data;
            console.log($scope.studentsList);
        },function(err){
            console.log(err);
        });
    };
    $scope.getStudents();
    
}])