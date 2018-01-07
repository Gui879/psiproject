angular.module('app')
.controller('programsCtrl',['$scope','$http','userSvc','dataSvc',function($scope,$http,userSvc,dataSvc){
    var config ={
        "headers":{
            "auth-token":userSvc.token
        }
    }
    
    $scope.programsList;
    $scope.degreeTypeList;
    
    
    $scope.typeFilter = {
        "CURSOTIPO":"bachelor degree"
    };
    $(".degreeOption:nth-child(1)").css("background-color","rgba(93, 122, 128,0.6)");
    $(".degreeOption:nth-child(1)").click(function(){
        $scope.typeFilter.CURSOTIPO="bachelor degree";
        $("hr").css("margin-left","0%");
        $(".degreeOption").css("background-color","rgba(92,102,108,0.3)");
        $(this).css("background-color","rgba(93, 122, 128,0.6)");
        
    });
    $(".degreeOption:nth-child(2)").click(function(){
        $scope.typeFilter.CURSOTIPO="postgraduate degree";
        $("hr").css("margin-left","25%");
        $(".degreeOption").css("background-color","rgba(92,102,108,0.3)");
        $(this).css("background-color","rgba(93, 122, 128,0.6)");
    });
    $(".degreeOption:nth-child(3)").click(function(){
        $scope.typeFilter.CURSOTIPO="master degree";
        $("hr").css("margin-left","50%");
        $(".degreeOption").css("background-color","rgba(92,102,108,0.3)");
        $(this).css("background-color","rgba(93, 122, 128,0.6)");
    });
    $(".degreeOption:nth-child(4)").click(function(){
        $scope.typeFilter.CURSOTIPO="doctoral degree";
        $("hr").css("margin-left","75%");
        $(".degreeOption").css("background-color","rgba(92,102,108,0.3)");
        $(this).css("background-color","rgba(93, 122, 128,0.6)");
    });
    
    
    
    
    $scope.change= function(degreeType){
        $scope.typeFilter.CURSOTIPO = degreeType;
    };
    
    $scope.listPrograms=function(){
        $http.get("/secure/api/user/listPrograms",config).then(function(response){
            console.log("Programs List founded!");
            $scope.programsList=response.data.data;
        },function(err){
            console.log("Programs List not founded!");
        })
        
    };
    
      $scope.selectProgram = function(program){
        $scope.selectedProgram = program;
          console.log("pass1");
        $scope.checkTab(program);
    };
    
    
    $scope.listPrograms();
    //tabwidthcalc();
}])