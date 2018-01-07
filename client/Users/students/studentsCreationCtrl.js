
angular.module('app')
.controller('studentsCreationCtrl',['$scope','$http','userSvc','dataSvc','Upload','$state',function($scope,$http,userSvc,dataSvc,Upload,$state){
    var config ={
        "headers":{
            "auth-token":userSvc.token
        }
    }
    
    var requestData = {
        "idcurso":-1
    }
    
    $scope.cursoList;
    $scope.selectedCurso;
    $scope.cadeirasList=[];
    
    
    $scope.listCursos = function(){
        $http.get("/secure/api/user/listCursos",config).then(function(response){
            $scope.cursoList = response.data.data;
        },function(err){
            console.log(err);
        });
        
    };
    
    $scope.listCadeiras = function(){
        console.log("aqui" + $scope.selectedCurso);
        requestData.idcurso = $scope.selectedCurso;
        $http.post("/secure/api/user/listCadeiras",requestData,config).then(function(response){
            var sem="Spring";
            var index=-1;
            $scope.cadeirasList=[];
            for(var i=0; i<response.data.data.length;i++){
                if(sem!=response.data.data[i].SEMESTRE){
                    sem=response.data.data[i].SEMESTRE
                    index++;
                    $scope.cadeirasList.push([]);
                }
                $scope.cadeirasList[index].push(response.data.data[i]);
            }
            $scope.calculateCredits();
            console.log($scope.cadeirasList);
        },function(err){
            console.log(err);
        });
    };
    
    $scope.Math = window.Math;
    
    var lastusername=0;
    var getLastStudentId=function(){
        $http.get('secure/api/user/studentNumInst',config).then(function(response){
                lastusername = response.data.data[0];
                console.log(lastusername);
                $scope.submit();
        }, function(err){
            console.log(err);
        })
    }
    
    $scope.createStudent = function(user){
        user.idcurso=$scope.selectedCurso;
        console.log(user);
        
        $http.post("/secure/api/user/createStudent",user,config).then(function(response){
            $scope.result = "User created sucessfully!";
            getLastStudentId();
            
            
        },function(err){
            $scope.result = "Error!"
            console.log(err);
        });
    };
    
    $("#imgClass").click(function(){
        $("#uploadFoto").trigger('click');
        $("#fake").css("display","none");
    });
    
    $scope.submit = function(){ //function to call on form submit     
        upload($scope.file); //call upload function
                
        }
    var upload = function (file) {
        console.log(file);
        console.log(lastusername);
        var params={
            'filename':lastusername.NUMINST,
        }
            $http.post('/upload/setimgstorage',params).then(function(response){
                
                    
                 Upload.upload({
                    url: '/upload/img', //webAPI exposed to upload the file
                    data:{file:file} //pass file as data, should be user ng-model
                }).then(function(resp) { //upload function returns a promise
                    if(resp.data.error_code === 0){ //validate success
                         $("#menuDark").css("display","block");
                    setTimeout(function(){
                        $state.go('user.students');
                    },2500);
                    } else {
                    }
                },function(err){
                     console.log(err);
                 });
            },function(err){
                console.log(err);
            })
           
        };
    $scope.goBack=function(){
        $state.go('user.students');
    }
    
    $scope.calculateCredits=function(){
        $scope.credits=[];
        for(var i=0;i<$scope.cadeirasList.length;i++){
            var count=0;
            for(var j=0;j<$scope.cadeirasList[i].length;j++){
                count+=$scope.cadeirasList[i][j].creditos;
            }
            $scope.credits.push(count);
        }
        console.log($scope.credits);
    }
    
    $scope.listCursos();
    
}])