angular.module('app')
.controller('evaluationCtrl',['$scope','$http','userSvc','dataSvc','Upload','$window',function($scope,$http,userSvc,dataSvc,Upload,$window){
    var config ={
        "headers":{
            "auth-token":userSvc.token
        }
    } 
    
    $scope.nextSlide=function(actClass,nextClass){
        $("#"+actClass).css("display","none");
        $("#"+nextClass).css("display","block");    
    }
    
    $scope.selectedCourse;
    
    $scope.selectCourse=function(index){
        $scope.selectedCourse=$scope.coursesList[index];
    }
    $scope.teacherName;
    $scope.getTeacherName=function(){
        var requestedData={
            'id':JSON.parse(localStorage.getItem('user')).IDUSER
        }
        $http.post("/secure/api/user/getName",requestedData,config).then(function(response){
            $scope.teacherName=response.data.data;
        },function(err){
            
        })
    }
    
    $("#searchBar>input").focusin(function(){
        $("#searchBar").css("background-color","rgba(92,102,108,0.7)");
    });
    $("#searchBar>input").focusout(function(){
        $("#searchBar").css("background-color","rgba(92,102,108,0.3)");
    });
    
    $scope.getTeacherName();
    $scope.coursesList;
    $scope.listCourses=function(userid){ 
        var requestedData={
            'userid':userid
        }
        $http.post("/secure/api/user/coursesListbyTeacher",requestedData,config).then(function(response){
            console.log("Courses List founded!");
            $scope.coursesList=response.data.data;
            console.log($scope.coursesList.length);
            if(response.data.data.length==0){
                $("#warning").css("display","block");
                $("#searchBar").css("display","none");
            }else{
                $("#warning").css("display","none");
                $("#searchBar").css("display","inline-block");
            }
        },function(err){
            console.log("Courses List not founded!");
        })
        
    };
    
    $scope.listCourses(JSON.parse(localStorage.getItem('user')).IDUSER);
    $scope.isInsert;
    
    $scope.grades=[];
    $scope.studentList;
    $scope.getStudentsListToInsert=function(){
        console.log("HELLO!!");
        $scope.grades=[];
        var course={
            'courseid':$scope.selectedCourse.IDCADEIRA
        }
        $http.post("/secure/api/user/studentsByCourse",course,config).then(function(response){
            console.log("TO INSERT-Students List founded!");
            $scope.studentList=response.data.data;
            console.log("HELLO2!!");
            console.log($scope.grades);
            
    
            for(var i=0; i<$scope.studentList.length; i++){
                var grade={
                    'IDALUNO':$scope.studentList[i].IDALUNO,
                    'NUMINST':$scope.studentList[i].NUMINST,
                    'IDEXAME':$scope.selectedExam.IDEXAME,
                    'NOTA':0,
                    'wrong':false
                }
                $scope.grades.push(grade);
            }
            console.log("HELLO3!!");
            console.log($scope.grades);
            
            $scope.isInsert=true;
            
        },function(err){
            console.log("Students List not founded!");
        })
    }
    
     $scope.getStudentsListToUpdate=function(){
        
        var course={
            'courseid':$scope.selectedCourse.IDCADEIRA,
            'examid':$scope.selectedExam.IDEXAME
        }
        $http.post("/secure/api/user/studentsInExam",course,config).then(function(response){
            console.log("TO UPDATE-Students List founded!");
            $scope.studentList=response.data.data;
            $scope.grades=[];
            for(var i=0; i<$scope.studentList.length; i++){
                var grade={
                    'IDALUNO':$scope.studentList[i].IDALUNO,
                    'NUMINST':$scope.studentList[i].NUMINST,
                    'IDEXAME':$scope.selectedExam.IDEXAME,
                    'NOTA':$scope.studentList[i].NOTA,
                    'wrong':false
                }
                $scope.grades.push(grade);
            }
            
            if($scope.studentList.length==0){
                $scope.getStudentsListToInsert();
            }
            
            $scope.calcStats();
            
            $scope.isInsert=false;
            
            
        },function(err){
            console.log("Students List not founded!");
        })
    }
    
    $scope.exams=[];
    
    $scope.getExamsByCourse=function(){
        var requestedData={
            'courseId':$scope.selectedCourse.IDCADEIRA,
            'iduser':JSON.parse(localStorage.getItem('user')).IDUSER
        }
        $http.post("/secure/api/user/getExamsbyCourse",requestedData,config).then(function(response){
            
            $scope.exams=response.data.data;
            console.log($scope.exams);
            var dateNow=new Date();
            var day=dateNow.getDate();
            var month=dateNow.getMonth();
            var year=dateNow.getFullYear();
            
            
            for(var i=0; i<$scope.exams.length; i++){
                if(day==$scope.exams[i].DIA && (month+1)==$scope.exams[i].MES && year==$scope.exams[i].ANO){
                    $scope.exams[i].ESTADO='EM REALIZAÇÃO';
                }else if(day<$scope.exams[i].DIA && (month+1)<=$scope.exams[i].MES && year<=$scope.exams[i].ANO){
                    $scope.exams[i].ESTADO='NÃO REALIZADO';
                }else{
                    $scope.exams[i].ESTADO='A AGUARDAR AVALIAÇÕES';
                    
                    //CRIAR COPIA DA DATA DE REVISAO
                    if($scope.exams[i].DIAREVISAO!=null){
                        var diarevisao=$scope.exams[i].DIAREVISAO;
                        var mesrevisao=$scope.exams[i].MESREVISAO;
                        var anorevisao=$scope.exams[i].ANOREVISAO;

                        var revisaoMaisDois=new Date(anorevisao,(mesrevisao-1),diarevisao);
                        console.log(revisaoMaisDois);

                        //SOMAR MAIS 2 DIAS UTEIS

                        revisaoMaisDois.setDate(revisaoMaisDois.getDate()+2);
                        while(revisaoMaisDois.getDay()==0 || revisaoMaisDois.getDay()==6){
                            revisaoMaisDois.setDate(revisaoMaisDois.getDate()+1);
                        }

                        diarevisao=revisaoMaisDois.getDate();
                        mesrevisao=revisaoMaisDois.getMonth();
                        anorevisao=revisaoMaisDois.getFullYear();

                        if(day>diarevisao && (month+1)>=mesrevisao && year>=anorevisao){
                            $scope.exams[i].ESTADO='AVALIAÇÕES FECHADAS';
                        }
                    }
                }
            }
            
            
            
            
            
        },function(err){
           
        })
    }
    
    $scope.selectedExam;
    $scope.selectExam=function(exam){
        $scope.selectedExam=exam;
    }
    
    $scope.editGrades=function(){
        console.log($scope.selectedExam);
        if($scope.selectedExam.DIAREVISAO==null && $scope.selectedExam.ESTADO=='A AGUARDAR AVALIAÇÕES'){
            //DEVERÁ MARCAR A DATA DE REVISAO DO TESTE
            $scope.popupShow('revisionDate');
        }else if($scope.selectedExam.ESTADO=='A AGUARDAR AVALIAÇÕES'){
            if($scope.selectedExam.DIAALTERACAO==null){
                $scope.popupShow('remider');
                $scope.getStudentsListToInsert();
                setTimeout(function(){
                    $scope.popuphide();
                    $scope.nextSlide('slide3','slide2'); 
                },2500);
            }else{
                $scope.popupShow('remider');
                $scope.getStudentsListToUpdate();
                setTimeout(function(){
                    $scope.popuphide();
                    $scope.nextSlide('slide3','slide2'); 
                },2500);
            }
        }else if($scope.selectedExam.ESTADO=='AVALIAÇÕES FECHADAS'){
            $scope.getStudentsListToUpdate();
            $scope.nextSlide('slide3','slide4');
        }else{
            $scope.popupShow('noExam');
            setTimeout(function(){
                $scope.popuphide();
            },2500);
        }      
        
    }
    
    $scope.insertRevisionDate=function(date){
        var requestedData={
            'id':$scope.selectedExam.IDEXAME,
            'day':date.getDate(),
            'month':date.getMonth()+1,
            'year':date.getFullYear()
        }
    
        $http.post("/secure/api/user/revisionDate",requestedData,config).then(function(response){
            $scope.selectedExam.DIAALTERACAO=requestedData.day;
            $scope.popuphide();
            $scope.getStudentsListToInsert();
            $scope.nextSlide('slide3','slide2');
            
        },function(err){
            console.log("Revision Date not inserted!");
        })
    }
    
    
    $scope.popuphide = function(){
        $(document).ready(function(){
                $("#menuDark").css("display", "none");
            });
    }
    $scope.revisionDatePopUp = function(){
        $(document).ready(function(){
                $("#menuDark").css("display", "block");
            });
    }
    
    $scope.insertGrades=function(){
            var boolean=true;
            for(var i=0; i<$scope.grades.length;i++){
                
                if($scope.grades[i].NOTA<0||$scope.grades[i].NOTA>20){
                    boolean=false;
                    $scope.grades[i].wrong=true;
                }else{
                    $scope.grades[i].wrong=false;
                }
                console.log($scope.grades[i]);
            }
            if(boolean){
                $scope.insert();
            }
            
    }
    
    $scope.insert=function(){
        console.log("insert");
        console.log($scope.grades);
            if($scope.isInsert){
                for(var i=0; i<$scope.grades.length;i++){
                    console.log($scope.grades[i])
                    if($scope.grades[i].NOTA==null){
                        $scope.grades[i].NOTA=0;
                    }
                    $http.post("/secure/api/user/insertGrade",$scope.grades[i],config).then(function(response){

                    },function(err){
                        console.log("Grade not inserted!");
                    })
                }
                $scope.getExamsByCourse();
                $scope.nextSlide('slide2','slide3');
            }else{
                for(var i=0; i<$scope.grades.length;i++){
                    console.log($scope.grades[i]);
                    $http.post("/secure/api/user/updateGrade",$scope.grades[i],config).then(function(response){

                    },function(err){
                        console.log("Grade not updated!");
                    })
                }
                $scope.getExamsByCourse();
                $scope.nextSlide('slide2','slide3');
            }   
        
    }
    $scope.avgGrade;
    $scope.approveRating;
    $scope.maxGrade;
    $scope.minGrade;
    $scope.calcStats=function(){
        var avg=0;
        var apprCount=0;
        var min=$scope.grades[0].NOTA;
        var max=$scope.grades[0].NOTA;
        console.log($scope.grades);
        for(var i=0; i<$scope.grades.length;i++){
            avg=avg+$scope.grades[i].NOTA;
            if($scope.grades[i].NOTA>9.5){
                apprCount=apprCount+1;
            }
            if(min>$scope.grades[i].NOTA){
                min=$scope.grades[i].NOTA;
            }
            if(max<$scope.grades[i].NOTA){
                max=$scope.grades[i].NOTA;
            }
        }
        $scope.avgGrade=Math.round((avg/$scope.grades.length) * 100) / 100;
        $scope.approveRating=Math.round((apprCount/$scope.grades.length) * 100);
        $scope.maxGrade=max;
        $scope.minGrade=min;
    }
    
    $scope.excelsubmit = function(){
            
            uploadexcel($scope.excelfile);
        }
        var uploadexcel = function(file){
            $http.get('/upload/setexcelstorage').then(function(response){
                
                 Upload.upload({
                    url: '/upload/excel', //webAPI exposed to upload the file
                    data:{file:file} //pass file as data, should be user ng-model
                }).then(function(resp) { //upload function returns a promise
                    if(resp.data.error_code === 0){ //validate success
                        var uploadedGrade=resp.data.data;
                        $window.alert('Success ' + resp.config.data.file.name + 'uploaded. Response: ');
                        
                        
                        for(var i=0; i<$scope.grades.length;i++){
                            for(var j=0; j<uploadedGrade.length; j++){
                                if(uploadedGrade[j].num==$scope.grades[i].NUMINST){
                                    $scope.grades[i].NOTA=parseInt(uploadedGrade[j].nota);
                                    uploadedGrade.splice(j,1);
                                }
                            }
                        }
                        
                    } 
                },function(err){
                     console.log(err);
                 });
            },function(err){
                console.log(err);
            });
        };
    
    
    $scope.popupShow = function(id){
        $("#menuDark").children().css("display", "none");
        $("#menuDark").css("display", "block");
        $("#menuDark>#"+id).css("display", "block");
        
    }
  
    
    
    


    
}])