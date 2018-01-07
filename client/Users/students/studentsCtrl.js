angular.module('app')
.controller('studentsCtrl',['$scope','$http','userSvc','dataSvc',function($scope,$http,userSvc,dataSvc){
    var config ={
        "headers":{
            "auth-token":userSvc.token
        }
    };
    
    $scope.studentList;
    $scope.selectedStudent;
    $scope.coursefinishdate;

    $scope.getcoursefinishdate = function(IDEXAME,IDALUNO){
        var requestedData={
            'IDEXAME':IDEXAME,
            'IDALUNO':IDALUNO
        }
        $http.get("/secure/api/user/coursefinishdate",requestedData,config).then(function(response){
            console.log("DATE found!");
            $scope.coursefinishdate=response.data.data;
            console.log("aqui");
            console.log(response.data.data);
        },function(err){
            console.log("date not found!");
        })



    };
    $scope.listPrograms;
    $scope.getPrograms=function(){
        $http.get("/secure/api/user/listPrograms",config).then(function(response){
            $scope.listPrograms=response.data.data;
            console.log($scope.listPrograms);
        },function(err){
            
        })
    }
    $scope.getPrograms();   
    
    $scope.sortList=function(sortFilter){
        if($scope.sortFilter=="-"+sortFilter){
            $scope.sortFilter=sortFilter;
        }else if($scope.sortFilter==sortFilter){
            $scope.sortFilter="-"+sortFilter; 
        }else{
            $scope.sortFilter=sortFilter;
        }
    }
    
    $("#searchBar>input").focusin(function(){
        $("#searchBar").css("background-color","rgba(92,102,108,0.7)");
    });
    $("#searchBar>input").focusout(function(){
        $("#searchBar").css("background-color","rgba(92,102,108,0.3)");
    });
    
    $scope.getcoursefinishdate(2,1)
    $scope.listStudents = function(){
            if(dataSvc.getStudents() == null){
                $http.get("/secure/api/user/listStudents",config).then(function(response){
                    dataSvc.set(response.data.data);
                    $scope.studentList = dataSvc.getStudents();
                    console.log(response.data.data);
                },function(err){
                    console.log(err);
                });
            }else{
                $scope.studentList=dataSvc.getStudents();
            }
    };
     $scope.tabAdjust = function(){
        $(document).ready(function(){
                var numTab= $(".tab").length;
                var widthTab = 100/numTab;
                $(".tab").css("width", "-webkit-calc("+widthTab+"% - 4px)");
            });
    };
    $scope.imageExists=function(image_url){

        var http = new XMLHttpRequest();

        http.open('HEAD', image_url, false);
        http.send();
        console.log("satus");
        return http.status != 404;

    }
    $scope.popupshow = function(student){
        $(document).ready(function(){
                $("#menuDark").css("display", "block");
            });
        $scope.selectedStudent = student;
        $scope.courseid=student.ID_CURSO;
        console.log($scope.selectedStudent);
        $scope.models =[];
        $scope.getProgramCourses();
       console.log(student); $scope.selectedStudent.img='/client/profilepics/'+$scope.selectedStudent.NUMBER+'.png';
        if(!$scope.imageExists($scope.selectedStudent.img)){
            $scope.selectedStudent.img='/client/profilepics/default.png';
        }
        $scope.showDivs(1);
        $scope.getCredits();
    };
    $scope.popuphide = function(){
        $(document).ready(function(){
                $("#menuDark").css("display", "none");
            });
        $scope.editdone="Edit";
        $scope.editmode=false;
    };
    $scope.popuphide3 = function(id){
        $(document).ready(function(){
                $("#menuDark3").css("display", "none");
            });
    };
    $scope.tabAdjust();
    
    
    $scope.listStudents();
    
    $scope.slideIndex = 1;
    
    $scope.plusDivs=function(n){
        $scope.showDivs($scope.slideIndex += n);
    };
    $scope.showDivs=function(n){
        var i;
      $scope.x = document.getElementsByClassName("slide");
        console.log($scope.x);
      if (n > $scope.x.length) {$scope.slideIndex = 1}    
      if (n < 1) {$scope.slideIndex = $scope.x.length}
      for (i = 0; i < $scope.x.length; i++) {
         $scope.x[i].style.display = "none";  
      }
      $scope.x[$scope.slideIndex-1].style.display = "block"; 
    };
  
    
    //$scope.showDivs($scope.slideIndex);
    
    $scope.enrolledCourses;
    $scope.getEnrolledCourses = function(numinst){
        //validate input
        $scope.enrolledCourses=[];
        var requiredData={"numinst":numinst};
        $http.post("/secure/api/user/getEnrolledCourses",requiredData,config).then(function(response){
            
            $scope.enrolledCourses=response.data.data;
                 
                var requestedData={
                    'numinst':numinst
                }
                
                for(var j=0;j<$scope.enrolledCourses.length;j++){
                    $scope.enrolledCourses[j].exams=[];
                    $scope.enrolledCourses[j].opened=false;
                }
                
                
                $http.post("/secure/api/user/getGrades",requestedData,config).then(function(response){
                    console.log(response.data.data);
                    for(var i=0;i<response.data.data.length;i++){
                        for(var j=0;j<$scope.enrolledCourses.length;j++){
                            if(response.data.data[i].IDCADEIRA==$scope.enrolledCourses[j].IDCADEIRA){
                                $scope.enrolledCourses[j].exams.push(response.data.data[i]);
                                console.log($scope.enrolledCourses[j].exams);
                            }
                        }
                    }
                    console.log($scope.enrolledCourses);
                },function(err){
                    $scope.result = "Error!";
                    console.log(err);
                })

            
            
        console.log($scope.enrolledCourses); 
            
        },function(err){
            $scope.result = "Error!";
            console.log(err);
        });
        
    };
    
    $scope.toggleExams=function(course){
        course.opened=!course.opened;
        console.log($scope.enrolledCourses);
    }
    $scope.deletePopup = function(){
        $(document).ready(function(){
            $("#menuDark3").children().css("display", "none");
            $("#menuDark3").css("display", "block");
            $("#menuDark3>#deletepopup").css("display", "block");
        });

    };
    
    $scope.editPopup = function(){
        $(document).ready(function(){
            $("#menuDark3").children().css("display", "none");
            $("#menuDark3").css("display", "block");
            $("#menuDark3>#editpopup").css("display", "block");
        });

    };
    
    $scope.sucessPopup=function(){
        $(document).ready(function(){
            $("#menuDark3").children().css("display", "none");
            $("#menuDark3").css("display", "block");
            $("#menuDark3>#deletesucess").css("display", "block");
        });
    }
    
    $scope.sucessPopup2=function(){
        $(document).ready(function(){
            $("#menuDark3").children().css("display", "none");
            $("#menuDark3").css("display", "block");
            $("#menuDark3>#editsucess").css("display", "block");
        });
    }

    $scope.editdone="Edit";
    $scope.editmode=false;
    $scope.changeButton = function(){
        $scope.editmode=!$scope.editmode;
        if(!$scope.editmode){
            $scope.editdone= 'Edit';
            //Save changes
            $scope.editPopup();
        }else{
            $scope.editdone ='Done';
            console.log($scope.selectedStudent);
            $scope.userChange={
                'primeironome':$scope.selectedStudent.PRIMEIRONOME,
                'ultimonome':$scope.selectedStudent.ULTIMONOME,
                'numinst':$scope.selectedStudent.NUMBER,
                'numtelefone':$scope.selectedStudent.NUM_TELEFONE,
                'email':$scope.selectedStudent.EMAIL
            }
        }
    }
    $scope.nameProgram;
    $scope.applyChanges=function(){
        console.log($scope.selectedStudent);

        
         var requestedData={
            'numinst':$scope.selectedStudent.NUMBER
        }

        $http.post('/secure/api/user/deleteProgramInsc',requestedData,config).then(function(response){
            var data={
                'numinst':$scope.selectedStudent.NUMBER,
                'programId':$scope.courseid
            }
            $http.post('/secure/api/user/insertProgram',data,config).then(function(response){
                $scope.selectedStudent.ID_CURSO=$scope.courseid;
                for(var i=0;i<$scope.listPrograms.length;i++){
                    console.log($scope.courseid);
                    if($scope.listPrograms[i].ID_CURSO==$scope.courseid){
                        $scope.selectedStudent.PROGRAM=$scope.listPrograms[i].NOME;
                        $scope.getProgramCourses();
                        $scope.getCredits();
                        break;
                    }
                }
            }, function(err){
                console.log(err);
            })

        }, function(err){
            console.log(err);
        })
        $http.post('/secure/api/user/updateStudent',$scope.userChange,config).then(function(response){
                $scope.selectedStudent.NAME=$scope.userChange.primeironome+" "+$scope.userChange.ultimonome;
                $scope.selectedStudent.PRIMEIRONOME=$scope.userChange.primeironome;
                $scope.selectedStudent.ULTIMONOME=$scope.userChange.ultimonome;
                $scope.selectedStudent.EMAIL=$scope.userChange.email;
                $scope.selectedStudent.NUM_TELEFONE=$scope.userChange.numtelefone;            
                $scope.sucessPopup2();
                setTimeout(function(){
                    $scope.popuphide3();
                    $scope.popuphide();
                },2500);
            }, function(err){
                $http.post('/secure/api/user/updateStudent2',$scope.userChange,config).then(function(response){
                    $scope.selectedStudent.NAME=$scope.userChange.primeironome+" "+$scope.userChange.ultimonome;
                    $scope.selectedStudent.PRIMEIRONOME=$scope.userChange.primeironome;
                    $scope.selectedStudent.ULTIMONOME=$scope.userChange.ultimonome;
                    $scope.selectedStudent.EMAIL=$scope.userChange.email;
                    $scope.selectedStudent.NUM_TELEFONE=$scope.userChange.numtelefone;            
                    $scope.sucessPopup2();
                    setTimeout(function(){
                        $scope.popuphide3();
                        $scope.popuphide();
                    },2500);
                }, function(err){

                })
            })

       
    }
    $scope.deleteStudent = function(){
        var requiredData ={"numinst":$scope.selectedStudent.NUMBER};
        $http.post("/secure/api/user/deleteStudent",requiredData,config).then(function(response){

            var index=$scope.studentList.indexOf($scope.selectedStudent);
                $scope.studentList.splice(index,1);
            $scope.sucessPopup();
            setTimeout(function(){
                $scope.popuphide3();
                $scope.popuphide();
            },2500);


        },function(err){
            $scope.result = "Error!";
            console.log(err);
        });


    }
    
    
        $scope.loadInitialModel=function(){
            $scope.models = {
                selected: null,
                lists:[]
            }
            for(var i=0; i< $scope.studyPlan.length;i++){
                $scope.models.lists.push($scope.studyPlan[i]);
            }
            
            
            console.log($scope.models);
        
    }
    
    $scope.data;
    $scope.studyPlan=[];
    $scope.initialStudyPlan=[];
    $scope.loadStudyPlan=function(){
        $scope.studyPlan=[];
        var year=-1;
        var semester="spring";
        var index=-1;
        for(var i=0; i<$scope.data.length;i++){
            if($scope.data[i].ANO!=year){
                year=$scope.data[i].ANO;
            }
            if($scope.data[i].SEMESTRE!=semester){
                semester=$scope.data[i].SEMESTRE;
                index++;
                $scope.studyPlan.push([]);
            }
            var course={
                id:$scope.data[i].IDCADEIRA,
                label: $scope.data[i].NOME,
                horasensino:$scope.data[i].HORASENSINO,
                creditos:$scope.data[i].CREDITOS,
                fundamental:$scope.data[i].FUNDAMENTAL
            }
            $scope.studyPlan[index].push(course);
            
        }
        console.log($scope.studyPlan);
        $scope.loadInitialModel();
    }
    
    $scope.getProgramCourses=function(){
        var data={
            'id':$scope.selectedStudent.ID_CURSO
        };
        $http.post("/secure/api/user/getProgramCourses",data,config).then(function(response){
            $scope.data=response.data.data;
            console.log("hello!");
            $scope.loadStudyPlan();
        }, function(err){
            console.log(err);
        })
    }
    
    $scope.getCredits=function(){
        $scope.avgGrade=$scope.approvedCredits=$scope.disapprovedCredits=0;
        var data={
            'idprogram':$scope.selectedStudent.ID_CURSO,
            'idaluno':$scope.selectedStudent.NUMBER
        };
        $http.post("/secure/api/user/approvedCredits",data,config).then(function(response){
            $scope.approvedCredits=response.data.data[0].CREDITS;
            if(response.data.data[0].CREDITS==null){
                $scope.approvedCredits=0;
            }
        }, function(err){
            console.log(err);
        })
        
        $http.post("/secure/api/user/disapprovedCredits",data,config).then(function(response){
            $scope.disapprovedCredits=response.data.data[0].CREDITS;
            if(response.data.data[0].CREDITS==null){
                $scope.disapprovedCredits=0;
            }
        }, function(err){
            console.log(err);
        })
        
        $http.post("/secure/api/user/grade",data,config).then(function(response){
            $scope.avgGrade=response.data.data[0].nota;
            console.log(response.data.data[0]);
            if(response.data.data[0].nota==null || response.data.data[0].nota==undefined){
                $scope.avgGrade=0;
            }
        }, function(err){
            console.log(err);
        })
    }
    
    
    
    
}]);