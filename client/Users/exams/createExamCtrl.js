angular.module('app')
.controller('createExamCtrl',['$scope','$http','userSvc','dataSvc',function($scope,$http,userSvc,dataSvc){
    var config ={
        "headers":{
            "auth-token":userSvc.token
        }
    }
    
    $scope.nextSlide=function(actClass,nextClass){
        
        $("#"+actClass).css("display","none");
        $("#"+nextClass).css("display","block");
        $scope.events=[];
        
    }
    
    
    $scope.selectedDay;
    $scope.selectedCourse;
    $scope.selectedHour;
    $scope.selectedRoom;
    
    $scope.dateNow=new Date();;
    $scope.month=$scope.dateNow.getMonth();
    $scope.year=$scope.dateNow.getFullYear();
    $scope.monthNames = ["January","February","March","April","May","June","July","August","September","October","November", "December"];

    
    $scope.selectDay=function(day){
        $scope.selectedDay=day.day;
        $scope.month=day.month-1;
        $scope.year=day.year;
        $scope.getEventsList();
    } 
    
    $scope.selectCourse=function(index){
        $scope.selectedCourse=$scope.coursesList[index];
    }
    
    $scope.day={
            'day':0,
            'month':$scope.month,
            'year':$scope.year,
            'currentDay':false,
            'monthDay':false
    };
    
    $scope.calendarDays=[];
    
    for(var i=0; i<6; i++){
        $scope.calendarDays[i]=[];
        for(var j=0; j<7; j++){
            $scope.calendarDays[i][j]=$scope.day;
        }
    }
    
    $scope.loadCalendar=function(month,year){
        
         var FebNumberOfDays ="";
         var counter = 1;


         var dateNow = new Date();

         var nextMonth = month+1; //+1; //Used to match up the current month with the correct start date.
         var prevMonth = 0;
        var prevYear=0;
        var nextYear=0;
        
        
        


         //Determing if February (28,or 29)  
         if (month == 1 || month == 2 || month == 3){
            if ( (year%100!=0) && (year%4==0) || (year%400==0)){
              FebNumberOfDays = 29;
            }else{
              FebNumberOfDays = 28;
            }
         }

         // names of months and week days.
         var dayNames = ["Sunday","Monday","Tuesday","Wednesday","Thrusday","Friday", "Saturday"];
         var dayPerMonth = ["31", ""+FebNumberOfDays+"","31","30","31","30","31","31","30","31","30","31"]


         // days in previous month and next one , and day of week.
         var nextDate = new Date(nextMonth +' 1 ,'+year);
         var weekdays= nextDate.getDay();
         var weekdays2 = weekdays
         var numOfDays = dayPerMonth[month];
            var writtenDays = 0;
        
            
        
        var row=0;
        var column=0;
         // this leave a white space for days of pervious month.
        if(month==0){
            prevMonth=11;
            prevYear=year-1;
        }
        else{
            prevMonth=month-1;
            prevYear=year;
        }
        var previousDays = dayPerMonth[prevMonth] -  weekdays +1;
        while (weekdays>0){
            $scope.calendarDays[row][column]={
                'day':previousDays,
                'month':(prevMonth+1),
                'year':prevYear,
                'currentDay':false,
                'monthDay':false
            };

         // used in next loop.
            column++; 
            weekdays--;
            previousDays++;
            writtenDays++;
         }

         // loop to build the calander body.
         while (counter <= numOfDays){


             // When to start new line.
            if (weekdays2 > 6){
                weekdays2 = 0;
                row++;
                column=0;
            }
             
             
             if(dateNow.getDate() == counter && month==dateNow.getMonth() && year==dateNow.getFullYear()){
                 $scope.calendarDays[row][column]={
                    'day':counter,
                    'month':(month+1),
                    'year':year,
                    'currentDay':true,
                     'monthDay':true
                };
             }else{
                 $scope.calendarDays[row][column]={
                    'day':counter,
                    'month':(month+1),
                    'year':year,
                    'currentDay':false,
                     'monthDay':true
                };
             }
             
            
             column++;
             writtenDays++;
            weekdays2++;
            counter++;
         }
            var restDays=1;
        if(month==11){
            month=0;
            nextYear=year+1;
        }
        else{
            month++;
            nextYear=year;
        }
         while(writtenDays<42){
             if (weekdays2 > 6){
                weekdays2 = 0;
                row++;
                 column=0;
            }



            $scope.calendarDays[row][column]={
                'day':restDays,
                'month':(month+1),
                'year':nextYear,
                'currentDay':false,
                'monthDay':false
            };


             column++;
             writtenDays++;
            weekdays2++;
            restDays++;
         }
        
        console.log($scope.calendarDays);
    }
    $scope.prevMonth=function(){
    
        if(($scope.month - 1) == -1){
            $scope.month=11;
            $scope.year--;
        }else{
            $scope.month--;
        }
    
        $scope.loadCalendar($scope.month,$scope.year);
    }
    $scope.nextMonth=function(){
        
        console.log("Month1 - "+$scope.month);
        if(($scope.month + 1) == 12){
            console.log("Month2 - "+$scope.month);
            $scope.month=0;
            $scope.year++;
        }else{
            $scope.month++;
        }
    
        $scope.loadCalendar($scope.month,$scope.year);
    }
    $scope.loadCalendar($scope.month,$scope.year);
    
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
                
                $(".event:last-child").css("width","10px");
                
                
                
                
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
    
    $scope.coursesList;
    $scope.listCourses=function(userid){ 
        var requestedData={
            'userid':userid
        }
        $http.post("/secure/api/user/coursesListbyTeacher",requestedData,config).then(function(response){
            console.log("Courses List founded!");
            $scope.coursesList=response.data.data;
            if(response.data.data.length==0){
                $("#courses>#warning").css("display","block");
                $("#searchBar").css("display","none");
            }else{
                $("#courses>#warning").css("display","none");
                $("#searchBar").css("display","inline-block");
            }
        },function(err){
            console.log("Courses List not founded!");
        })
        
    }
    
    $scope.listCourses(JSON.parse(localStorage.getItem('user')).IDUSER);
    
    $scope.index1;
    $scope.index2;
    
    $scope.confirm=function(room,hour,index1,index2){
  
        if($scope.events[index1][index2+1].length==0){
            $scope.selectedRoom=$scope.rooms[room-1];
            $scope.selectedHour=$scope.events[hour-1][0];
            $scope.index1=index1;
            $scope.index2=index2;
            $scope.sucessShow("examPopup");
        }
    }
    
    $("#searchBar>input").focusin(function(){
        $("#searchBar").css("background-color","rgba(92,102,108,0.7)");
    });
    $("#searchBar>input").focusout(function(){
        $("#searchBar").css("background-color","rgba(92,102,108,0.3)");
    });
    
    
    $scope.sucessShow = function(id){
        $("#menuDark").children().css("display", "none");
        $("#menuDark").css("display", "block");
        $("#menuDark>#"+id).css("display", "block");
        
    }
    
    
    $scope.insertExam=function(){
        var exam={
            'room':$scope.selectedRoom.IDSALA,
            'hour':$scope.selectedHour.IDHORA,
            'date':$scope.year+"-"+($scope.month+1)+"-"+$scope.selectedDay,
            'course':$scope.selectedCourse.IDCADEIRA
        }
        
        $http.post("/secure/api/user/createExam",exam,config).then(function(response){
            console.log("Exam inserted!");
            
            var event={
                'NOME':$scope.selectedCourse.NOME,
                'TIPO':'exam'
            }
            $scope.sucessShow('createsucess');
            setTimeout(function(){
                $scope.popuphide();
            },2500);
            
            $scope.events[$scope.index1][$scope.index2+1].push(event);
        
        },function(err){
            $scope.sucessShow('createfail');
            setTimeout(function(){
                $scope.popuphide();
            },2500);
        })
    }

    $scope.popuphide = function(){
        $(document).ready(function(){
                $("#menuDark").css("display", "none");
            });
    }
    
    $scope.setWidth = function(){
        console.log(rooms.length);
        $(".event").css("width","calc((100% - 105px) / "+rooms.length+");")
        
    }
    
    
   
    
}])