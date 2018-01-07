angular.module('app')
.controller('teachercoursesMainCtrl',['$scope','$state',function($scope,$state){

    $scope.selectedCourse;
    $scope.index=localStorage.getItem('index');
    $scope.tabBoolean=false;
    var array= localStorage.getItem('openedtcTabs');
    if(array != null){
        array = JSON.parse(localStorage.getItem('openedtcTabs')).array;
        $scope.tabs=array;
        
    }else{
        $scope.tabs=[];
    }
    
     var setlocalarray = function(){
         var item = {
            'array':$scope.tabs
        }
        localStorage.setItem('openedtcTabs',JSON.stringify(item));
    };
    
     $scope.changeview=function(course,index){
         console.log("called changeview");
        $scope.selectedCourse = course;
         var params ={
             'name':course.NOME,
             'index':index
         }
        localStorage.setItem('index',index);
        $scope.index=localStorage.getItem('index');
         findCurrentTab();
         console.log($scope.index);
        $state.go('user.teachercourses.teachercoursetab',params);
        
    };
    
    $scope.checkTab = function(course){
        console.log(course);
        for(var i = 0;i < $scope.tabs.length;i++){
            if($scope.tabs[i].NOME == course.NOME){
                $scope.changeview(course,i);
                return;
            }
        }
        newtab(course);
    };
    
    var newtab=function(course){
        console.log(course);
       $scope.tabs.push(course);
        console.log("New Tab Opened");
        $scope.changeview(course,$scope.tabs.length-1);
       setlocalarray();
    };
    
    $scope.closeTab= function(index,tab){
        console.log($scope.selectedCourse)
        console.log(tab);
        if($scope.selectedCourse){
            if($scope.selectedCourse.NOME == tab.NOME){
                console.log("It is the same");
                $state.go('user.teachercourses.list');
            }
        }
        
        $scope.tabs.splice(index,1);
        setlocalarray();
    };
    
    $scope.setCourse= function(course){
        $scope.selectedCourse =course;
    }
    
    $scope.setIndex = function(index){
        $scope.index = index;
    }
    
    var findCurrentTab = function(){
        for(var i =0; i < $scope.tabs.length;i++){
            i=i+1;
            console.log('hEREASD');
            if(i == $scope.index){
                console.log('HEREMASD');
                $('.tab:nthchild('+i+')').css("background-color","aqua");
            }
        }
    }
    findCurrentTab();
  
}])