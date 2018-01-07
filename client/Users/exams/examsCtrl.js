angular.module('app')
.controller('examsCtrl',['$scope','$http','userSvc','dataSvc',function($scope,$http,userSvc,dataSvc){
    var config ={
        "headers":{
            "auth-token":userSvc.token
        }
    } 
    
    $scope.dateNow=new Date();;
    $scope.month=$scope.dateNow.getMonth();
    $scope.year=$scope.dateNow.getFullYear();
    $scope.monthNames = ["January","February","March","April","May","June","July","August","September","October","November", "December"];
    
    $scope.dayFilter;
    
    var previousSelected;
    $scope.setFilter=function(day){
        if(previousSelected!=null){
            previousSelected.selected=false;
        }
        $scope.events=day.events;
        if($scope.events.length==0){
            $("#list>#warning").css("display","block");
        }else{
            $("#list>#warning").css("display","none");
        }
        day.selected=true;
        previousSelected=day;
        console.log($scope.calendarDays);
    }
    $scope.day={
            'day':0,
            'month':$scope.month,
            'year':$scope.year,
            'currentDay':false,
            'selected':false,
            'monthDay':false,
            'thereisEvent':false,
            'events':[]
    };
    
    $scope.events;
    
    $scope.calendarDays=[];
    
    for(var i=0; i<6; i++){
        $scope.calendarDays[i]=[];
        for(var j=0; j<7; j++){
            $scope.calendarDays[i][j]=$scope.day;
        }
    }
    
    $scope.loadCalendar=function(month,year){
        
         
        
        var date={
                'teacherid':JSON.parse(localStorage.getItem('user')).IDUSER,
                'month':$scope.month+1,
                'year':$scope.year
            }
        
        $http.post("/secure/api/user/getEventsByMonthAndYear",date,config).then(function(response){
            console.log("Event found!");
            
            $scope.events=response.data.data;
            
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
                    'selected':false,
                    'monthDay':false,
                    'thereisEvent':false,
                    'events':[]
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
                         'selected':true,
                         'monthDay':true,
                        'thereisEvent':false,
                        'events':[]
                    };
                     $scope.dayFilter=counter;
                 }else{
                     $scope.calendarDays[row][column]={
                        'day':counter,
                        'month':(month+1),
                        'year':year,
                        'currentDay':false,
                         'selected':false,
                         'monthDay':true,
                        'thereisEvent':false,
                        'events':[]
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
                    'selected':false,
                    'monthDay':false,
                    'thereisEvent':false,
                    'events':[]
                };


                 column++;
                 writtenDays++;
                weekdays2++;
                restDays++;
             }
            var eventsToDisplay=[];
            var present;
            for(var i =0; i<$scope.calendarDays.length;i++){
                for(var j=0; j<$scope.calendarDays[i].length;j++){
                    if($scope.calendarDays[i][j].month==($scope.month+1)){
                        for(var w=0; w<$scope.events.length; w++){
                            if($scope.calendarDays[i][j].day==$scope.events[w].DAY){
                                $scope.calendarDays[i][j].thereisEvent=true;
                                $scope.calendarDays[i][j].events.push($scope.events[w]);
                                if($scope.calendarDays[i][j].currentDay){
                                    eventsToDisplay.push($scope.events[w]);
                                }
                            }                        
                        }
                    }
                    if($scope.calendarDays[i][j].currentDay==true){
                        present=$scope.calendarDays[i][j];
                    }
                }
            }
            
            $scope.setFilter(present);
            
                   
        },function(err){
            console.log("Events not found!");
        })
    
        
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
    
    
    
    $scope.popuphide = function(){
        $(document).ready(function(){
                $("#menuDark").css("display", "none");
            });
    }
    $scope.popupshowDelete = function(){
        $(document).ready(function(){
                $("#menuDark").css("display", "block");
            });
        setTimeout(function(){
            $(document).ready(function(){
                $("#menuDark").css("display", "none");
            });
        },5000);
            
    }
    
}]);