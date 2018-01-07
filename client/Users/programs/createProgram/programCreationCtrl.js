angular.module('app')
.controller('programCreationCtrl',['$scope','$http','userSvc','dataSvc','$interval','$state',function($scope,$http,userSvc,dataSvc,$interval,$state){
    
    var config ={
        "headers":{
            "auth-token":userSvc.token
        }
    }
    
    $scope.programsList;
    $scope.degreeTypeList;
    $scope.teacherList=[];
    $scope.result="";
    $scope.selectedCourses=[];
    $scope.cursotipo="bachelor degree";
    $scope.countCredits=[];
    
    $scope.resetModel=function(x){
        if(x<=10 && x>=0){
           console.log("heyyy");
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
            console.log($scope.models.lists);
            for (var i = 0; i < $scope.cadeiras.length; i++) {
                $scope.models.lists[$scope.models.lists.length-1].push({label: $scope.cadeiras[i].NOME,id:$scope.cadeiras[i].IDCADEIRA,horasensino:$scope.cadeiras[i].HORASENSINO,creditos:0,fundamental:0});
            }
            
            console.log($scope.models);
        }else{
            $scope.resetModel(0);
        }
        
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
    
    $(".degreeOption:nth-child(1)").css("background-color","rgba(93, 122, 128,0.6)");
    $(".degreeOption:nth-child(1)").click(function(){
        $scope.cursotipo="bachelor degree";
        $("hr").css("margin-left","0%");
        $(".degreeOption").css("background-color","rgba(92,102,108,0.3)");
        $(this).css("background-color","rgba(93, 122, 128,0.6)");
        
    });
    $(".degreeOption:nth-child(2)").click(function(){
        $scope.cursotipo="postgraduate degree";
        $("hr").css("margin-left","25%");
        $(".degreeOption").css("background-color","rgba(92,102,108,0.3)");
        $(this).css("background-color","rgba(93, 122, 128,0.6)");
    });
    $(".degreeOption:nth-child(3)").click(function(){
        $scope.cursotipo="master degree";
        $("hr").css("margin-left","50%");
        $(".degreeOption").css("background-color","rgba(92,102,108,0.3)");
        $(this).css("background-color","rgba(93, 122, 128,0.6)");
    });
    $(".degreeOption:nth-child(4)").click(function(){
        $scope.cursotipo="doctoral degree";
        $("hr").css("margin-left","75%");
        $(".degreeOption").css("background-color","rgba(92,102,108,0.3)");
        $(this).css("background-color","rgba(93, 122, 128,0.6)");
    });

    
    var listTeachers = function(){
        $http.get('/secure/api/user/listTeachers',config).then(function(response){
            console.log(response.data.data);
            $scope.teacherList = response.data.data;
        },function(err){
            console.log(err);
        })
    };
    $scope.cadeiras;
    
    $scope.listCourses = function(){
        $http.get("/secure/api/user/listCourses",config).then(function(response){
            $scope.cadeiras= response.data.data;
            var courseList = response.data.data;
            $scope.resetModel(0);
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
                console.log(insert);
                
                var data={
                    'content':insert
                };

                $http.post("/secure/api/user/createCourseProgram",data,config).then(function(response){
                    console.log("created!");
                    
                    $("#menuDark").css("display","block");
                    setTimeout(function(){
                        $state.go('user.programs.list');
                    },2500);
                    
                }, function(err){
                    console.log(err);
                })

            }, function(err){
                console.log(err);
            })
        }
    };
    
    $scope.Math = window.Math;

    $scope.onDrop = function(srcList, srcIndex, targetList, targetIndex,listname) {
        console.log("target");
        console.log(srcList);
        var item = srcList[srcIndex];
        item.fundamental=false;
        targetList.splice(targetIndex, 0, item);
         if (srcList == targetList && targetIndex <= srcIndex) srcIndex++;
        srcList.splice(srcIndex, 1);
        $scope.calculateCredits();
        return true;
    };

    $scope.toogleFundamental=function(index,list){
        list[index].fundamental = !list[index].fundamental;
        console.log(list[index].fundamental );
        $scope.calculateCredits();
    }
    
 
    listTeachers();
    $scope.listCourses();
    
}])