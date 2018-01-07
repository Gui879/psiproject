angular.module('app')
.controller('programMainCtrl',['$scope','$state',function($scope,$state){
    
    $scope.selectedProgram;
    var array= localStorage.getItem('openedTabs');
    if(array != null){
        array = JSON.parse(localStorage.getItem('openedTabs')).array;
        $scope.tabs=array;
        
    }else{
        $scope.tabs=[];
    }
    
    var tabwidthcalc = function(){
        var div= $scope.tabs.length+2;
        var widthTab = 100/div;
        $scope.tabStyle={
            'width':"-webkit-calc("+widthTab+"% - 7px)"
        }
    };
    
     var setlocalarray = function(){
         var item = {
            'array':$scope.tabs
        }
        localStorage.setItem('openedTabs',JSON.stringify(item));
    };
    
     $scope.changeview=function(program,index){
         console.log("called changeview");
        $scope.selectedProgram = program;
         var params ={
             'name':program.NOME,
             'index':index
         }
        localStorage.setItem('index',index);
        $state.go('user.programs.program',params);
    };
    
    $scope.checkTab = function(program){
        console.log("pass2");
        for(var i = 0;i < $scope.tabs.length;i++){
            if($scope.tabs[i].ID_CURSO == program.ID_CURSO){
                $scope.changeview(program,i);
                return;
            }
        }
        newtab(program);
    };
    
    var newtab=function(program){
       $scope.tabs.push(program);
        console.log(program);
        $scope.changeview(program,$scope.tabs.length-1);
       setlocalarray();
       // tabwidthcalc();
    };
    
    $scope.closeTab= function(index,tab){
        
        if($scope.selectedProgram == tab){
            console.log("It is the same");
            $state.go('user.programs.list');
        }
        $scope.tabs.splice(index,1);
        setlocalarray();
    };
    
  
}])