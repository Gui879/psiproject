angular.module('app')
.controller('programCtrl',['$scope','$stateParams','$http','userSvc','$state',function($scope,$stateParams,$http,userSvc,$state){
    var config ={
        "headers":{
            "auth-token":userSvc.token
        }
    }
    var index = localStorage.getItem('index');
    $scope.selectedProgram = JSON.parse(localStorage.getItem('openedTabs')).array[index];
    $scope.teacherList;
    $scope.courseList=[];
    $scope.roomList=[];
    var tempClassMatrix=[];
    $scope.classMatrix=[];
    $scope.initialClassMatrix=[];
    $scope.degreeList=[];
    
    $scope.imageExists=function(image_url){

        var http = new XMLHttpRequest();

        http.open('HEAD', image_url, false);
        http.send();
        return http.status != 404;

    }
    
    var getNuminstID = function(resp){
        var params={
            'responsible':resp
        }
        $http.post('/secure/api/user/getNumInstID',params,config).then(function(response){
            var numinst = response.data.data[0].numinst
            $scope.sourceresp="/client/profilepics/"+ numinst +".png";
            if(!$scope.imageExists($scope.sourceresp)){
               $scope.sourceresp="/client/profilepics/default.png"; 
            }
        }, function(err){
            console.log(err);
        })
        
    }
    
    var listTeachers = function(){
        $http.get('/secure/api/user/listTeachers',config).then(function(response){
            $scope.teacherList = response.data.data;
            setResponsible($scope.selectedProgram.RESPONSAVEL);
            setFormData();
        },function(err){
            console.log(err);
        })
    };
    
    var setResponsible= function(id){
        for (var i = 0; i <$scope.teacherList.length;i++){
            var teacher = $scope.teacherList[i];
            
            if(teacher.IDPROFESSOR == id){
                $scope.selectedProgram.respname=teacher.name;
                return teacher.name;
            }
        }
    };
    
    var setFormData = function(){
        $scope.program={
            'id':$scope.selectedProgram.ID_CURSO,
            'cursotipo':$scope.selectedProgram.CURSOTIPO,
            'duration':$scope.selectedProgram.DURACAO_SEMESTRES,
            'nome':$scope.selectedProgram.NOME,
            'hours':parseInt($scope.selectedProgram.NUM_HORAS_SEMESTRE),
            'responsible':$scope.selectedProgram.RESPONSAVEL,
            'respname':$scope.selectedProgram.respname,
            'vary':$scope.selectedProgram.Y
        }
        $scope.updateProgramTypeLabel();
        $scope.loadSemesterTabs();
    };
    
    $scope.slide=true;
    $scope.slidename="Program Info"
    $scope.slidechange=function(boolean){
        $scope.slide =boolean;
        if($scope.slide){
            $scope.slidename="Program Info";
        }else{
            $scope.slidename="Timetable";
        }
    };
    

    var getHours= function(){
        $http.get('/secure/api/user/getHours',config).then(function(response){
            $scope.hoursList = response.data.data;
        }, function(err){
            console.log(err);
        })
    }
    
    var getRooms= function(){
        $http.get('/secure/api/user/getRooms',config).then(function(response){
            $scope.roomList = response.data.data;
            
        }, function(err){
            console.log(err);
        })
    }
    
    var getCourseByProgram= function(){
        
        var params={
            'idprogram':$scope.selectedProgram.ID_CURSO
        }
        $http.post('/secure/api/user/getCourseByProgram',params,config).then(function(response){
            $scope.courseList = response.data.data;
        }, function(err){
            console.log(err);
        })
    }
    
    $scope.showPopUp = function(weekday,hour,cadeira){
        $scope.weekdayid=weekday;
        $scope.hour=hour;
        $scope.getAvailableRooms(hour.IDHORA,weekday+1);
        $("#menuDark").children().css("display", "none");
        $("#menuDark").css("display","block");
        $("#examPopup").css("display","block");
        if(cadeira==undefined){
            $scope.event={
                'room':null,
                'hour':hour.IDHORA,
                'date':null,
                'course':null,
                'weekday':weekday+1,
                'idcurso':$scope.selectedProgram.ID_CURSO
            };

        }else{
            $scope.event={
                'room':null,
                'hour':hour.IDHORA,
                'date':null,
                'course':null,
                'previousCourse':cadeira.idcadeira,
                'weekday':weekday+1,
                'idcurso':$scope.selectedProgram.ID_CURSO
            };
        }
        if(weekday ==1){
            $scope.event.date = "2017-12-11";
            $scope.weekday="Monday";
        }else if(weekday == 2){
            $scope.event.date = "2017-12-12";
            $scope.weekday="Tuesday";
        }else if(weekday == 3){
            $scope.event.date = "2017-12-13";
            $scope.weekday="Wednesday";
        }else if(weekday == 4){
            $scope.event.date = "2017-12-14";
            $scope.weekday="Thursday";
        }else if(weekday == 5){
            $scope.event.date = "2017-12-15";
            $scope.weekday="Friday";
        }
    };
    
    $scope.showConfirmation = function(){
         $("#menuDark").css("display","block");
        $("#confirmationPopup").css("display","block");
    }
    
     $scope.createClass= function(event){
        console.log("inserted!");
         var aula={
               'data':event.date,
               'sala':findRoom(event.room),
               'hora':findHora(event.hour),
               'cadeira':findCadeira(event.course),
        }
        
         console.log(event.course);
        $scope.classMatrix[$scope.filterIndex][$scope.hour.IDHORA-1][$scope.weekdayid-1]=aula;
         console.log($scope.classMatrix);
        $scope.popuphide();   
    }
    
    $scope.uploadClass= function(){
        console.log("Upload classes!");
        var insert='INSERT INTO EVENTO(IDSALA,IDHORA,DATA,IDSEMESTRE,IDCADEIRA,IDTIPO,ID_CURSO) VALUES ';
        for(var i=0;i<$scope.classMatrix.length;i++){
            for(var j=0;j<$scope.classMatrix[i].length;j++){
                for(var w=0;w<$scope.classMatrix[i][j].length;w++){
                    if($scope.classMatrix[i][j][w]!=0){
                        var date=0;
                        if(w ==0){
                            date = "2017-12-11";
                        }else if(w == 1){
                            date = "2017-12-12";
                        }else if(w == 2){
                            date = "2017-12-13";
                        }else if(w == 3){
                            date = "2017-12-14";
                        }else if(w == 4){
                            date = "2017-12-15";
                        }
                        var requestedData={
                            'idsala':$scope.classMatrix[i][j][w].sala.IDSALA,
                            'idhora':$scope.classMatrix[i][j][w].hora.IDHORA,
                            'data':date,
                            'idsemestre':1,
                            'idcadeira':$scope.classMatrix[i][j][w].cadeira.IDCADEIRA,
                            'idtipo':2,
                            'idcurso':$scope.selectedProgram.ID_CURSO
                        }
                        insert+="("+requestedData.idsala+","+requestedData.idhora+",'"+requestedData.data+"',"+requestedData.idsemestre+","+requestedData.idcadeira+","+requestedData.idtipo+","+requestedData.idcurso+"),";
                    }
                }
            }
        }
        insert=insert.substring(0, insert.length - 1);
        var data={
            'idcurso':$scope.selectedProgram.ID_CURSO
        }
        
        $http.post('/secure/api/user/deleteClasses',data,config).then(function(response){
            var dataToInsert={
                'insert':insert
            }
            if(insert.length>82){
                $http.post('/secure/api/user/createClasses',dataToInsert,config).then(function(response){
                    $scope.sucessShow('editsucess');
                    setTimeout(function(){
                        $scope.popupHide();
                    },2500);
                }, function(err){
                    console.log(err);
                })
            }else{
                $scope.sucessShow('editsucess');
                    setTimeout(function(){
                        $scope.popupHide();
                    },2500);
            }
            
        }, function(err){
            console.log(err);
        })
        
        
        
    }
    
    var getDayOfWeek= function(date) {
      var dayOfWeek = new Date(date).getDay();    
      return isNaN(dayOfWeek) ? null : ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'][dayOfWeek];
    }
    
    $scope.resetClassMatrix=function(){
        tempClassMatrix=[];
        var sem='Fall';
        if(index%2!=0){
           sem='Spring' 
        }
        var params ={
            'idcurso':$scope.selectedProgram.ID_CURSO,
            'ano':Math.round((index+1)/2),
            'semestre':sem
        }
        for(var w =0; w < $scope.models.lists.length-1;w++){
            tempClassMatrix.push([]);
            for(var j =0; j < $scope.hoursList.length;j++){
                tempClassMatrix[w].push([]);
                for(var i = 0; i < 5;i++){
                    tempClassMatrix[w][j].push(0);
                }
            }
        }
        $scope.classMatrix = tempClassMatrix;
    }
    
    $scope.assignWeekDay = function(index){ 
        tempClassMatrix=[];
        var sem='Fall';
        if(index%2!=0){
           sem='Spring' 
        }
        var params ={
            'idcurso':$scope.selectedProgram.ID_CURSO,
            'ano':Math.round((index+1)/2),
            'semestre':sem
        }
        for(var w =0; w < $scope.models.lists.length-1;w++){
            tempClassMatrix.push([]);
            for(var j =0; j < $scope.hoursList.length;j++){
                tempClassMatrix[w].push([]);
                for(var i = 0; i < 5;i++){
                    tempClassMatrix[w][j].push(0);
                }
            }
        }
        
        
        $http.post('/secure/api/user/getClassesByProgram',params,config).then(function(response){
            var semestre='fall';
            var semIndex=0;
            for(var i =0; i<response.data.data.length;i++){
                if(semestre!=response.data.data[i].SEMESTRE){
                    semestre=response.data.data[i].SEMESTRE;
                    semIndex++;
                }
                var event = {
                   'sala':findRoom(response.data.data[i].IDSALA),
                   'hora':findHora(response.data.data[i].idhora),
                   'cadeira':findCadeira(response.data.data[i].IDCADEIRA)
               }
               if(response.data.data[i].weekday==2){
                   tempClassMatrix[semIndex][response.data.data[i].idhora-1][0]=event;
               }else if(response.data.data[i].weekday==3){
                    tempClassMatrix[semIndex][response.data.data[i].idhora-1][1]=event;
               }else if(response.data.data[i].weekday==4){
                    tempClassMatrix[semIndex][response.data.data[i].idhora-1][2]=event;
               }else if(response.data.data[i].weekday==5){
                    tempClassMatrix[semIndex][response.data.data[i].idhora-1][3]=event;
               }else if(response.data.data[i].weekday==6){
                   tempClassMatrix[semIndex][response.data.data[i].idhora-1][4]=event;
               }
           }
            $scope.classMatrix = tempClassMatrix;
            $scope.initialClassMatrix=tempClassMatrix;
            
        }, function(err){
            console.log(err);
        }) 
    }
    
    var findRoom = function(id){
        for(var i = 0; i < $scope.roomList.length;i++){
            if($scope.roomList[i].IDSALA == id){
                return $scope.roomList[i];
            }
        }
    }
    
    var findHora = function(id){
        for(var i = 0; i < $scope.hoursList.length;i++){
            if($scope.hoursList[i].IDHORA == id){
                return $scope.hoursList[i];
            }
        }
    }
    
    var findCadeira = function(id){
        console.log($scope.allCourses);
        for(var i = 0; i < $scope.allCourses.length;i++){
            if($scope.allCourses[i].IDCADEIRA == id){
                return $scope.allCourses[i];
            }
        }
    }
    
    $scope.popuphide = function(){
        $(document).ready(function(){
                $("#examPopup").css("display", "none");
                $("#confirmationPopup").css("display", "none");
                $("#menuDark").css("display", "none");
            });
    }
    $scope.Math = window.Math;
    $scope.editdone="Edit";
    $scope.editmode=false;
    $scope.changeButton = function(program){
        $scope.editmode=!$scope.editmode;
        if(!$scope.editmode){
            $scope.editdone= 'Edit';
            //Save changes
            $(".cadeirasselecionadas").css("width","100%");
            $scope.confirmationShow('editpopup');
        }else{
            $scope.editdone ='Done';
            $(".cadeirasselecionadas").css("width","60%");
            if($scope.models.lists.length==1){
                $scope.resetModel($scope.program.duration);
            }
        }
    }
    
    $scope.applyChanges = function(program){
        var params ={
            'id':program.id,
            'cursotipo':program.cursotipo,
            'duration':program.duration,
            'hours':program.hours,
            'nome':program.nome,
            'responsible':program.responsible,
            'vary':program.vary
        }
        $http.post('secure/api/user/updateProgram',params,config).then(function(response){
            $http.post('secure/api/user/deleteStudyPlan',params,config).then(function(response){
                var idcurso=params.id;
                var insert="insert into CURSOSCADEIRAS(ID_CURSO,IDCADEIRA,CREDITOS,SEMESTRE,ANO,fundamental) values ";
                for(var i=0; i<($scope.models.lists.length-1);i++){
                    for(var j=0; j<$scope.models.lists[i].length;j++){
                        var year=Math.round((i+1)/2);
                        var course={
                            'idcurso':idcurso,
                            'idcadeira':$scope.models.lists[i][j].id,
                            'creditos':$scope.models.lists[i][j].creditos,
                            'semestre':'spring',
                            'ano':Math.round((i+1)/2),
                            'fundamental':0
                        }
                        if(i%2==0){
                            course.semestre='fall';
                        }
                        if($scope.models.lists[i][j].fundamental){
                            course.fundamental=1;
                        }
                        insert+="("+course.idcurso+","+course.idcadeira+","+course.creditos+",'"+course.semestre+"',"+course.ano+","+course.fundamental+"),";
                        
                        
                    }
                    
                    
                }
                
                insert=insert.substring(0, insert.length - 1);
                
                var data={
                    'content':insert
                };

                $http.post("/secure/api/user/createCourseProgram",data,config).then(function(response){
                    $scope.uploadClass();
                }, function(err){
                    console.log(err);
                })
            }, function(err){
                console.log(err);
            })
            
            program.respname= setResponsible(program.responsible);
            //set changes on localstorage
            var index = localStorage.getItem('index');
            var tabArray = JSON.parse(localStorage.getItem('openedTabs'));
            tabArray.array[index] = {
                'CURSOTIPO':program.cursotipo,
                'DURACAO_SEMESTRES':program.duration,
                'NOME':program.nome,
                'NUM_HORAS_SEMESTRE':program.hours,
                'RESPONSAVEL':program.responsible,
                'respname':program.respname,
                'Y':program.vary,
                'ID_CURSO':$scope.selectedProgram.ID_CURSO
            }
            getNuminstID(program.responsible);
            $scope.selectedProgram.NOME = program.nome;
            localStorage.setItem('openedTabs',JSON.stringify(tabArray));
            $scope.updateProgramTypeLabel();
            
            
            
            
        }, function(err){
            console.log(err);
        })
        
    };
    
    $scope.cadeiras;
     $scope.resetModel=function(x){
        if(x<=10 && x>=0){
            $scope.models = {
                selected: null,
                lists:[]
            }
            for(var i=0; i< x;i++){
                $scope.models.lists.push([]);
                $scope.countCredits.push(0);
            }
            $scope.countCredits.push(0);
            var Cadeiras=[];
            $scope.models.lists.push(Cadeiras);
            for (var i = 0; i < $scope.cadeiras.length; i++) {
                $scope.models.lists[$scope.models.lists.length-1].push({label: $scope.cadeiras[i].NOME,id:$scope.cadeiras[i].IDCADEIRA,horasensino:$scope.cadeiras[i].HORASENSINO,creditos:0,fundamental:0});
            }
            
            $scope.resetClassMatrix();
        }else{
            $scope.resetModel(0);
        }
        
    };
    $scope.listCourses = function(){
        getHours();
        getRooms();
        $http.get("/secure/api/user/listCourses",config).then(function(response){
            $scope.cadeiras= response.data.data;
            var courseList = response.data.data;
            $scope.allCourses=[];
            for(var i=0; i<response.data.data.length-1;i++){
                $scope.allCourses.push(response.data.data[i]);
            }
            console.log($scope.allCourses);
            $scope.loadInitialModel();
        }, function(err){
            console.log(err);
        });
    };
    
    $scope.removeItem=function(index,list){
        $scope.onDrop(list, index, $scope.models.lists[$scope.models.lists.length-1], 0,"qua");
        $scope.calculateCredits();
    }

    $scope.createProgram= function(program){
        var isOk=true;
        for(var i=0; i<$scope.models.lists.length-1;i++){
                if($scope.models.lists[i].length==0){
                    isOk=false;
                    break;
                }
        }
        if(isOk){
            var requestedData={
                'name':program.name,
                'vary':program.vary,
                'duration':program.duration,
                'hours':program.hours,
                'responsible':program.responsible,
                'cursotipo':$scope.cursotipo
            }
            $http.post("/secure/api/user/createProgram",requestedData,config).then(function(response){
                var idcurso=response.data.data[0].id_curso;
                var insert="insert into CURSOSCADEIRAS(ID_CURSO,IDCADEIRA,CREDITOS,SEMESTRE,ANO,fundamental) values ";
                for(var i=0; i<($scope.models.lists.length-1);i++){
                    for(var j=0; j<$scope.models.lists[i].length;j++){
                        var year=Math.round((i+1)/2);
                        var course={
                            'idcurso':idcurso,
                            'idcadeira':$scope.models.lists[i][j].id,
                            'creditos':$scope.models.lists[i][j].creditos,
                            'semestre':'fall',
                            'ano':Math.round((i+1)/2),
                            'fundamental':0
                        }
                        if(i%2==0){
                            $scope.models.lists[i][j].semestre='fall';
                        }
                        if($scope.models.lists[i][j].fundamental){
                            course.fundamental=1;
                        }
                        insert+="("+course.idcurso+","+course.idcadeira+","+course.creditos+",'"+course.semestre+"',"+course.ano+","+course.fundamental+"),";
                        
                        
                    }
                    
                    
                }
                
                insert=insert.substring(0, insert.length - 1);

                var data={
                    'content':insert
                };

                $http.post("/secure/api/user/createCourseProgram",data,config).then(function(response){
                    
                }, function(err){
                    console.log(err);
                })

            }, function(err){
                console.log(err);
            })
        }
    };

    $scope.onDrop = function(srcList, srcIndex, targetList, targetIndex,listname) {
        var item = srcList[srcIndex];
        item.fundamental=false;
        targetList.splice(targetIndex, 0, item);
         if (srcList == targetList && targetIndex <= srcIndex) srcIndex++;
        srcList.splice(srcIndex, 1);
        $scope.calculateCredits();
        return true;
    };

    $scope.toogleFundamental=function(index,list){
        if($scope.editmode){
            list[index].fundamental = !list[index].fundamental;
            $scope.calculateCredits();
        }
    }
    $scope.programsList;
    $scope.degreeTypeList;
    $scope.teacherList=[];
    $scope.result="";
    $scope.selectedCourses=[];
    $scope.cursotipo="bachelor degree";
    $scope.countCredits=[];
    $scope.loadInitialModel=function(){
            $scope.models = {
                selected: null,
                lists:[]
            }
            for(var i=0; i< $scope.studyPlan.length;i++){
                $scope.models.lists.push($scope.studyPlan[i]);
                if($scope.studyPlan[i])
                $scope.countCredits.push(0);
            }
            $scope.countCredits.push(0);
            var Cadeiras=[];
            $scope.models.lists.push(Cadeiras);
            for (var w = 0; w < $scope.cadeiras.length; w++){
                var isOkToInsert=true;
                for (var i = 0; i < $scope.models.lists.length; i++){
                    for (var j = 0; j < $scope.models.lists[i].length; j++){
                        if($scope.cadeiras[w].IDCADEIRA==$scope.models.lists[i][j].id){
                            isOkToInsert=false;
                            break;
                        }
                        if(!isOkToInsert){
                            break;
                        }
                    }
                }
                if(isOkToInsert){
                    $scope.models.lists[$scope.models.lists.length-1].push({label: $scope.cadeiras[w].NOME,id:$scope.cadeiras[w].IDCADEIRA,horasensino:$scope.cadeiras[w].HORASENSINO,creditos:0,fundamental:0}); 
                }
            }
        $scope.resetClassMatrix();
        $scope.assignWeekDay(0);    
        $scope.calculateCredits();
        $scope.selectSemester(0);
        
    }
    
    $scope.recoverModel=function(){
            $scope.models = {
                selected: null,
                lists:[]
            }
            for(var i=0; i< $scope.initialStudyPlan.length-1;i++){
                $scope.models.lists.push($scope.initialStudyPlan[i]);
                if($scope.initialStudyPlan[i])
                $scope.countCredits.push(0);
            }
            $scope.countCredits.push(0);
            var Cadeiras=[];
            $scope.models.lists.push(Cadeiras);
            for (var w = 0; w < $scope.cadeiras.length; w++){
                var isOkToInsert=true;
                for (var i = 0; i < $scope.models.lists.length; i++){
                    for (var j = 0; j < $scope.models.lists[i].length; j++){
                        if($scope.cadeiras[w].IDCADEIRA==$scope.models.lists[i][j].id){
                            isOkToInsert=false;
                            break;
                        }
                        if(!isOkToInsert){
                            break;
                        }
                    }
                }
                if(isOkToInsert){
                    $scope.models.lists[$scope.models.lists.length-1].push({label: $scope.cadeiras[w].NOME,id:$scope.cadeiras[w].IDCADEIRA,horasensino:$scope.cadeiras[w].HORASENSINO,creditos:0,fundamental:0}); 
                }
            }
        $scope.assignWeekDay(0);    
        $scope.calculateCredits();
    }
    
    
    $scope.calculateCredits=function(){
        var countTotal=0;
        var count=0;
        for(var i=0; i<$scope.models.lists.length-1;i++){                
            $scope.countCredits[i]=0;
            for(var j=0; j<$scope.models.lists[i].length;j++){
                        if($scope.models.lists[i][j].fundamental){
                            count=Math.round($scope.models.lists[i][j].horasensino/$scope.program.vary)*2;
                        }else{
                            count=Math.round($scope.models.lists[i][j].horasensino/$scope.program.vary);
                        }
                        $scope.models.lists[i][j].creditos=count;
                        $scope.countCredits[i]+=count; 
                    }
        }
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
            $scope.initialStudyPlan=$scope.studyPlan;
    }
    
    $scope.getProgramCourses=function(){
        var data={
            'id':$scope.selectedProgram.ID_CURSO
        };
        $http.post("/secure/api/user/getProgramCourses",data,config).then(function(response){
            $scope.data=response.data.data;
            $scope.loadStudyPlan();
        }, function(err){
            console.log(err);
        })
    }
    $scope.typeLabel;
    $scope.updateProgramTypeLabel=function(){
        if($scope.program.cursotipo=='bachelor degree'){
            $scope.typeLabel="Bachelor";
        }else if($scope.program.cursotipo=='postgraduate degree'){
            $scope.typeLabel="Postgraduate";
        }else if($scope.program.cursotipo=='master degree'){
            $scope.typeLabel="Master";     
        }else if($scope.program.cursotipo=='doctoral degree'){
            $scope.typeLabel="Doctoral";     
                 }
    }
    $scope.getProgramCourses();
    listTeachers();
    $scope.listCourses();
    $scope.enrolledStudents=0;
    $scope.getEnrroledStudents=function(){
        var data={
            'id':$scope.selectedProgram.ID_CURSO
        };
        $http.post("/secure/api/user/getEnrroledStudensProgram",data,config).then(function(response){
            $scope.enrolledStudents=response.data.data;
        }, function(err){
            console.log(err);
        })
    }
    
    $scope.confirmationShow = function(id){
        $("#menuDark").children().css("display", "none");
        $("#menuDark").css("display", "block");
        $("#menuDark>#"+id).css("display", "block");
        
    }
    
    $scope.sucessShow = function(id){
        $("#menuDark").children().css("display", "none");
        $("#menuDark").css("display", "block");
        $("#menuDark>#"+id).css("display", "block");
        
    }
    $scope.failureShow = function(){
        $("#menuDark").children().css("display", "none");
        $("#menuDark").css("display", "block");
        $("#menuDark>#failure").css("display", "block");
        
    }
    
    $scope.popupHide = function(){
        $("#menuDark").css("display", "none");
    }
    
    $scope.deleteProgram=function(){
        var data={
            'id':$scope.selectedProgram.ID_CURSO
        };
        $http.post("/secure/api/user/deleteProgram",data,config).then(function(response){
            $scope.sucessShow('deletesucess');
            setTimeout(function(){
                $scope.closeTab(localStorage.getItem('index'),$scope.selectedProgram);
                $state.go('user.programs.list');
            },2500);
        }, function(err){
            $scope.failureShow();
            setTimeout(function(){
                $scope.popupHide();
            },2500);
            console.log(err);
        })
    }
    
    getNuminstID($scope.selectedProgram.RESPONSAVEL);
    getCourseByProgram();
    listTeachers();
    
    
    
    $scope.semesterTabs=[];
    $scope.loadSemesterTabs=function(){
        $scope.semesterTabs=[];
        for(var i=0; i<$scope.program.duration;i++){
            if(i%2==0){
                $scope.semesterTabs.push({
                    'semestre':'Fall',
                    'ano':Math.round((i+1)/2),
                    'selected':false
                });
            }else{
                $scope.semesterTabs.push({
                    'semestre':'Spring',
                    'ano':Math.round((i+1)/2),
                    'selected':false
                });
            }
            if(i==0){
               $scope.semesterTabs[i].selected=true; 
            }
        }
    }
    $scope.toogleSelectedTab=function(tab){
        for(var i=0; i<$scope.program.duration;i++){
            $scope.semesterTabs[i].selected=false;
        }
        tab.selected=true;
    }
    
    $scope.getNumber = function(num) {
        return new Array(num);   
    }
    
    $scope.getAvailableRooms=function(idhora,weekday){
        var data={
            'idhora':idhora,
            'weekday':weekday
        }
        $http.post("/secure/api/user/availableRooms",data,config).then(function(response){
            $scope.roomList=response.data.data;
        }, function(err){
            
        })
    }
    $scope.filterIndex=0;   
    $scope.selectedSemester;
    $scope.selectSemester=function(index){
        $scope.selectedSemester=$scope.models.lists[index];
        console.log($scope.selectedSemester);
        $scope.filterIndex=index;
    }
    $scope.recoverData=function(){
        setFormData();
        $scope.loadStudyPlan();
        $scope.loadInitialModel();
        $scope.assignWeekDay();
    }
}])