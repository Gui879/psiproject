angular.module('app')
.controller('userCtrl',['$scope','$state','$http','userSvc',function($scope,$state,$http,userSvc){
    if(JSON.parse(localStorage.getItem('user'))==null){
        $state.go('home');
    }
     //Connects with side menu
    var label=localStorage.getItem('statelabel');
    $("#lateralMenu .option").data('clicked',false);
    $("#lateralMenu .option").css("background-color","transparent");
    $("#lateralMenu .option").css("border-left","0");
    $("#lateralMenu .option").css("width","100%");
    $('#' + label).css("border-left","10px solid rgb(96,198,208)");
    $('#' +label).css("background-color","rgba(96,198,208,0.2)");
    $('#' +label).css("width","calc(100% - 10px)");
    $('#' +label).data('clicked',true);  
    
    $scope.username = JSON.parse(localStorage.getItem('user')).USERNAME;
    $scope.source="/client/profilepics/"+userSvc.user.USERNAME+".png";
    $scope.useradmin;
     if(userSvc.user.USERNAME.charAt(0) == 'a'){
        $scope.useradmin=true;
    }else if(userSvc.user.USERNAME.charAt(0) == 'p'){
        $scope.useradmin=false;
    }
    $scope.imageExists=function(image_url){
        var http = new XMLHttpRequest();
        http.open('HEAD', image_url, false);
        http.send();
        console.log("satus");
        return http.status != 404;
    }
    
    
    if(!$scope.imageExists($scope.source)){
       $scope.source="/client/profilepics/default.png"; 
    }
    
    
     var config ={
        "headers":{
            "auth-token":userSvc.token
        }
    }
    
    $scope.logout = function(){
        localStorage.setItem('token',null);
        localStorage.setItem('user',null);
        $state.go("home");
    }
    
    $scope.changeState = function(state,label){
        $state.go(state).then(function(){
            localStorage.setItem('statelabel',label);
            $("#lateralMenu .option").data('clicked',false);
            $("#lateralMenu .option").css("background-color","transparent");
            $("#lateralMenu .option").css("border-left","0");
            $("#lateralMenu .option").css("width","100%");
            $('#' + label).css("border-left","10px solid rgb(96,198,208)");
            $('#' +label).css("background-color","rgba(96,198,208,0.2)");
            $('#' +label).css("width","calc(100% - 10px)");
            $('#' +label).data('clicked',true);  
        });
        
    }
    
    $scope.hoverCss=function(){
        $("#lateralMenu .option").hover(function(){
            $(this).css("border-left","10px solid rgb(96,198,208)");
            $(this).css("background-color","rgba(96,198,208,0.2)");
            $(this).css("width","calc(100% - 10px)");
        },function(){
            if($(this).data('clicked')==false){
                $(this).css("border-left","0");
                $(this).css("background-color","transparent");
                $(this).css("width","100%");   
            }
        })
        
    };
    
    $scope.hoverCss();
    
    
    $("#notifIcon").click(function(e){
        e.stopPropagation();
        $("#notWindow").toggle();
            if( $("#notWindow").css('display') == 'none'){
                for(var i=0; i<$scope.newNotifications.length; i++){
                    if($scope.newNotifications[i].DATAVISITADO==null){
                        var requestedData={
                            id:$scope.newNotifications[i].IDNOTIFCACAO
                        }
                        $http.post("/secure/api/user/changeDate",requestedData,config).then(function(response){
                            console.log("changed");
                            $scope.notifications.unshift(response.data.data[0]);
                            console.log($scope.notifications);
                        },function(err){

                        })
                    }
                }
                $scope.newNotifications=[];
            }else{
                $("#notContent").scrollTop(0,0);
            }
    });
    
    $(document).ready(function(){
        $("#content").click(function(){
            if( $("#notWindow").css('display') == 'block'){
                for(var i=0; i<$scope.newNotifications.length; i++){
                    if($scope.newNotifications[i].DATAVISITADO==null){
                        var requestedData={
                            id:$scope.newNotifications[i].IDNOTIFCACAO
                        }
                        $http.post("/secure/api/user/changeDate",requestedData,config).then(function(response){
                            console.log("changed");
                            $scope.notifications.unshift(response.data.data[0]);
                            console.log($scope.notifications);
                        },function(err){

                        })
                    }
                }
                $scope.newNotifications=[];
            }
            $("#notWindow").css("display","none");
        });
        
    });
    
    $scope.username = JSON.parse(localStorage.getItem('user')).USERNAME;
    
    $scope.notifications=[];
    $scope.getNotifications=function(){
        var requestedData={
            numinst:$scope.username
        }
        $http.post("/secure/api/user/getNotifications",requestedData,config).then(function(response){
            for(var i=response.data.data.length-1; i>=0; i--){
                $scope.notifications.push(response.data.data[i]);
            }        
        },function(err){
            
        })
    }
    $scope.newNotifications=[];
    
    $scope.getNewNotifications=function(){
        var requestedData={
            numinst:$scope.username
        }
        $http.post("/secure/api/user/getNewNotifications",requestedData,config).then(function(response){
            $scope.newNotifications=response.data.data;
        },function(err){
            
        })
    }
    
    $scope.getNotifications();
    $scope.getNewNotifications();
    if($scope.notifications.length==0 && $scope.newNotifications.length==0){
         $("#notContent>#warning").css("display","block");
    }else{
        $("#notContent>#warning").css("display","none");
    }
    setInterval(function(){
        $scope.getNewNotifications();
    },5000);
    
    console.log($scope.notifications);
    console.log($scope.newNotifications);
    console.log($scope.notifications.length!=0 || $scope.newNotifications.length!=0)
    
}]);