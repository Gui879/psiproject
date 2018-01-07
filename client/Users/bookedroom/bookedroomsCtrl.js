angular.module('app')
.controller('bookedroomsCtrl',['$scope','$http','userSvc','dataSvc',function($scope,$http,userSvc,dataSvc){
    var config ={
        "headers":{
            "auth-token":userSvc.token
        }
    }
    
    
    $scope.dateNow=new Date();
    $scope.selectedDay=$scope.dateNow.getDate();
    $scope.month=$scope.dateNow.getMonth();
    $scope.year=$scope.dateNow.getFullYear();
    $scope.monthNames = ["January","February","March","April","May","June","July","August","September","October","November", "December"];
    
    
    
    
    
    $scope.rooms;
    $scope.events=[];
    var eventsToHTML=[];
    var rooms;
    var hours;
    
    $scope.getEventsList = function(){
        console.log("dayy----"+$scope.selectedDay);
        $http.get("/secure/api/user/getRooms",config).then(function(response){
            $scope.rooms=response.data.data;
            rooms=response.data.data;
            console.log("rooms found!!");
            
            $http.get("/secure/api/user/getHours",config).then(function(response){
                hours=response.data.data;
                console.log("hours found!!");
                
                
                
                for(var i=0; i<hours.length; i++){
                    eventsToHTML[i]=[];
                    for(var j=0; j<rooms.length;j++){
                       eventsToHTML[i][j]=0;
                   } 
                }
                
                
               for(var i=0; i<hours.length; i++){
                   eventsToHTML[i][0]=hours[i];
                    for(var j=0; j<rooms.length;j++){
                        var filter={
                            'day':$scope.selectedDay,
                            'month':$scope.month+1,
                            'year':$scope.year,
                            'hour':hours[i].IDHORA,
                            'room':rooms[j].IDSALA,
                        }
                        var expectedCalls = hours.length*rooms.length;
                        
                        $scope.getEvents(filter,i,j+1,expectedCalls);
                    }

                }
                
                
                
                
                
                
            },function(err){
                $scope.result = "Error!"
                console.log(err);
            });
            
        },function(err){
            $scope.result = "Error!"
            console.log(err);
        });
        
    };
    
    var calls = 0;
   
    
    $scope.getEvents = function(filter,i,j,expectedCalls){
        
    
     $http.post("/secure/api/user/getEvents",filter,config).then(function(response){
            calls =calls+1;
            
            if(expectedCalls == calls) {
                eventsToHTML[i][j]= response.data.data;
                $scope.events= eventsToHTML;
                $scope.setWidth();
                calls= 0;
            }else{
                eventsToHTML[i][j] = response.data.data;
            }
            
        },function(err){
            
            console.log(err);
        });
        
    };
    
      $scope.nextDay = function(){
        $scope.events = [];
        var FebNumberOfDays=0;
        if ($scope.month == 1 || $scope.month == 2 || $scope.month == 3){
            if ( ($scope.year%100!=0) && ($scope.year%4==0) || ($scope.year%400==0)){
              FebNumberOfDays = 29;
            }else{
              FebNumberOfDays = 28;
            }
         }

         // names of months and week days.
         var dayPerMonth = ["31", ""+FebNumberOfDays+"","31","30","31","30","31","31","30","31","30","31"];
        
        if($scope.selectedDay==dayPerMonth[$scope.month]){
            if($scope.month==11){
                $scope.month=0;
                $scope.year++;
            }else{
                $scope.month++;
            }
            $scope.selectedDay=1; 
        }else{
           $scope.selectedDay++; 
        }
          
        
        $scope.getEventsList();
        
    };
    
    $scope.prevDay = function(){
        $scope.events = [];
        var FebNumberOfDays=0;
        if ($scope.month == 1 || $scope.month == 2 || $scope.month == 3){
            if ( ($scope.year%100!=0) && ($scope.year%4==0) || ($scope.year%400==0)){
              FebNumberOfDays = 29;
            }else{
              FebNumberOfDays = 28;
            }
         }

         // names of months and week days.
         var dayPerMonth = ["31", ""+FebNumberOfDays+"","31","30","31","30","31","31","30","31","30","31"];
        
        if($scope.selectedDay==1){
            if($scope.month==0){
                $scope.month=11;
                $scope.year--;
            }else{
                $scope.month--;
            }
            $scope.selectedDay=dayPerMonth[$scope.month]; 
        }else{
           $scope.selectedDay--; 
        }
          
        
        $scope.getEventsList();
        
    };
    
    $scope.getEventsList();
    
    $scope.setWidth = function(){
        console.log(rooms.length);
        $(".event").css("width","calc((100% - 105px) / "+rooms.length+");")
        
    }
    
}])