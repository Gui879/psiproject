angular.module('app')
.controller('courseMainCtrl',['$scope','$state',function($scope,$state){
    
   
    
    $scope.selectedCourse;
    var array= localStorage.getItem('openedcTabs');
    if(array != null){
        array = JSON.parse(localStorage.getItem('openedcTabs')).array;
        $scope.tabs=array;
        
    }else{
        $scope.tabs=[];
    }
    
    var tabwidthcalc = function(){
        var div= $scope.tabs.length+1;
        var widthTab = 100/div;
        $scope.tabStyle={
            'width':"-webkit-calc("+widthTab+"% - 7px)"
        }
    };
    
     var setlocalarray = function(){
         var item = {
            'array':$scope.tabs
        }
        localStorage.setItem('openedcTabs',JSON.stringify(item));
    };
    
     $scope.changeview=function(course,index){
         console.log("called changeview");
        $scope.selectedCourse = course;
         var params ={
             'name':course.NAME,
             'index':index
         }
        localStorage.setItem('index',index);
        $state.go('user.courses.courseTab',params);
    };
    
    $scope.checkTab = function(course){
        console.log(course);
        for(var i = 0;i < $scope.tabs.length;i++){
            if($scope.tabs[i].NAME == course.NAME){
                $scope.changeview(course,i);
                return;
            }
        }
        newtab(course);
    };
    
    var newtab=function(course){
       $scope.tabs.push(course);
        console.log("New Tab Opened");
        $scope.changeview(course,$scope.tabs.length-1);
       setlocalarray();
       // tabwidthcalc();
    };
    
    $scope.closeTab= function(index,tab){
        console.log($scope.selectedCourse)
        console.log(tab);
        if($scope.selectedCourse){
            if($scope.selectedCourse.NAME == tab.NAME && $scope.selectedCourse.TEACHER == tab.TEACHER){
                console.log("It is the same");
                $state.go('user.courses.list');
            }
        }
        console.log(index);
        $scope.tabs.splice(index,1);
        setlocalarray();
    };
    
    $scope.setCourse= function(course){
        $scope.selectedCourse =course;
    }
    
  
}])