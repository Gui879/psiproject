angular.module('app')
.controller('usersCtrl',['$scope','$http','userSvc','dataSvc','Upload',function($scope,$http,userSvc,dataSvc,Upload){
    var config ={
        "headers":{
            "auth-token":userSvc.token
        }
    }
    
    $("#searchBar>input").focusin(function(){
        $("#searchBar").css("background-color","rgba(92,102,108,0.7)");
    });
    $("#searchBar>input").focusout(function(){
        $("#searchBar").css("background-color","rgba(92,102,108,0.3)");
    });
    
    
    $scope.sortList=function(sortFilter){
        if($scope.sortFilter=="-"+sortFilter){
            $scope.sortFilter=sortFilter;
        }else if($scope.sortFilter==sortFilter){
            $scope.sortFilter="-"+sortFilter; 
        }else{
            $scope.sortFilter=sortFilter;
        }
    }
    $scope.sortFilter='PRIMEIRONOME';
    $scope.userList;
    $scope.selectedUser;
    $scope.eventsList =[];
    $scope.listUsers = function(){
            if(dataSvc.getUsers() == null){
                $http.get("/secure/api/user/listUsers",config).then(function(response){
                    console.log(response);
                    dataSvc.setUsers(response.data.data);
                    $scope.userList = dataSvc.getUsers();

                },function(err){
                    console.log(err);
                });
            }else{
                $scope.userList=dataSvc.getUsers();
            } 
    }
    $scope.userPopup = function(user){
        $(document).ready(function(){
                $("#menuDark").css("display", "block");
                $("#userPopup").css("display", "block");
                $("#addUser").css("display", "none");
            });
        $scope.selectedUser = user;
        $scope.selectedUser.img='/client/profilepics/'+$scope.selectedUser.NUMINST+'.png';
        if(!$scope.imageExists($scope.selectedUser.img)){
           $scope.selectedUser.img="/client/profilepics/default.png"; 
        }
    }
    $scope.addUserPopup = function(){
        $(document).ready(function(){
                $("#menuDark").css("display", "block");
                $("#userPopup").css("display", "none");
                $("#addUser").css("display", "block");
                $("#fake").css("display","block");  
            });
        $scope.user ={
            "type":"a"
        }
        
        console.log($scope.user.type=="a");
    
        
    }
    
    $scope.imageExists=function(image_url){

        var http = new XMLHttpRequest();

        http.open('HEAD', image_url, false);
        http.send();
        console.log("satus");
        return http.status != 404;

    }
    
	$("#imgClass").click(function(){
        $("#uploadFoto").trigger('click');
        $("#fake").css("display","none");
    });
    
    $scope.popuphide = function(){
        $(document).ready(function(){
                $("#menuDark").css("display", "none");
            });
        $("#right>input").css("background-color","rgba(92,102,108,0.3)");
        upload('default');
        $scope.result=null;
        $scope.editmode=false;
        $scope.editdone= 'Edit';
    }
    
    $scope.confirmationShow = function(){
        $("#menuDark2").css("display", "block");
    }
    
    $scope.confirmationHide = function(){
        $("#menuDark2").css("display", "none");
    }
    
    $scope.listUsers();
    
    $scope.user ={
        "type":"a"
    }
    
    function validateEmail(email) {
      var re = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
      return re.test(email);
    }
    
    
    $scope.createUser = function(user){
        //validate input
        console.log($scope.file);
        $("#right>input").css("background-color","rgba(92,102,108,0.3)");
        if(user.firstname==undefined || user.lastname==undefined || user.phoneNumber==undefined || user.email==undefined){
            if(user.firstname==undefined){
                $("#right>input:nth-child(2)").css("background-color","rgba(255,0,0,0.5)");
            }
            if(user.lastname==undefined){
                $("#right>input:nth-child(4)").css("background-color","rgba(255,0,0,0.5)");     
            }
            if(user.phoneNumber==undefined){
                $("#right>input:nth-child(6)").css("background-color","rgba(255,0,0,0.5)");     
            }
            if(user.mail==undefined){
                $("#right>input:nth-child(8)").css("background-color","rgba(255,0,0,0.5)");
            }
            $scope.result = "Fill out all the form fields!";
        }else{
            console.log(user.phoneNumber);
            if(validateEmail(user.email) && user.phoneNumber>99999999 && user.phoneNumber<1000000000){
                $http.post("/secure/api/user/createUser",user,config).then(function(response){
                    console.log($scope.file);
                    getNuminst();
                    $scope.userList.push(response.data.data[0]);
                    $scope.popuphide();
                    $scope.user=null;
                    $scope.result="";
                    $("#userType label").css("background-color","rgba(92,102,108,0.3)");
                },function(err){
                    $scope.result = "Internal Server Problem! Try later!";
                });
            }else{
                if(!validateEmail(user.email)){
                    $scope.result = "Invalid email address!";
                    $("#right>input:nth-child(8)").css("background-color","rgba(255,0,0,0.5)");
                }else{
                    $("#right>input:nth-child(6)").css("background-color","rgba(255,0,0,0.5)");     
                    $scope.result = "The phone number should have 9 characters!";
                }
                
            }
        }

    };
    
    $scope.coursesByProfessor;
    $scope.noCourses;
    $scope.getCoursesByProfessor = function(numinst){
        //validate input
        var requiredData={"numinst":numinst};
        $http.post("/secure/api/user/getCourses",requiredData,config).then(function(response){
            $scope.result = "User created sucessfully!";
            $scope.coursesByProfessor=response.data.data;
            if($scope.coursesByProfessor.length==0){
                $("#courseCells>#warning").css("display","block");
            }else{
                $("#courseCells>#warning").css("display","none");
            }
            console.log($scope.coursesByProfessor);
        },function(err){
            $scope.result = "Error!"
            console.log(err);
        });
    };
    
   
    $scope.editdone="Edit";
    $scope.editmode=false;
    $scope.changeButton = function(){
        $scope.editmode=!$scope.editmode;
        if(!$scope.editmode){
            $scope.editdone= 'Edit';
            //Save changes
            applyChanges();
            
        }else{
            $scope.editdone ='Done';
            $scope.userChange={
                'primeironome':$scope.selectedUser.PRIMEIRONOME,
                'ultimonome':$scope.selectedUser.ULTIMONOME,
                'numinst':$scope.selectedUser.NUMINST,
				'email':$scope.selectedUser.email,
                'numtelefone':$scope.selectedUser.numtelefone
            }
        }
    }
    var applyChanges=function(){
        console.log($scope.selectedUser);
        if($scope.userChange.primeironome != $scope.selectedUser.PRIMEIRONOME || $scope.userChange.ultimonome != $scope.selectedUser.ULTIMONOME || $scope.userChange.email != $scope.selectedUser.email || $scope.userChange.numtelefone != $scope.selectedUser.numtelefone){
            
            $http.post('/secure/api/user/updateUser',$scope.userChange,config).then(function(response){
                    $scope.selectedUser.PRIMEIRONOME=$scope.userChange.primeironome;
                    $scope.selectedUser.ULTIMONOME=$scope.userChange.ultimonome;
					$scope.selectedUser.email=$scope.userChange.email;
                    $scope.selectedUser.numtelefone=$scope.userChange.numtelefone;
            }, function(err){
                console.log(err);
            })
        }
        if(toBeRemoved.length>0){
            
            for(var i = 0; i < toBeRemoved.length;i++){
                console.log(toBeRemoved);
                var params={
                    'numinst':$scope.selectedUser.NUMINST,
                    'nome':toBeRemoved[i].NOME
                }
                
                deleteTCRel(params);
            }
            
        }
    }
    var deleteTCRel = function(params){
        console.log(params);
        $http.post('/secure/api/user/deleteTeacherCourseRelation',params,config).then(function(response){
                console.log("DONE");
        }, function(err){
            console.log(err);
        })
    }
    
    var toBeRemoved=[];
    $scope.removeCourse=function(course,index){
        toBeRemoved.push($scope.coursesByProfessor.splice(index,1)[0]);
        console.log(course);
    }
    
    $scope.deleteUser = function(){
        if($scope.coursesByProfessor==null || $scope.coursesByProfessor.length==0 ){
            console.log($scope.selectedUser);
            $http.post('/secure/api/user/deleteUser',$scope.selectedUser,config).then(function(response){
				 $("#menuDark").css("display", "none");
                $scope.confirmationHide()
                console.log("index")
                var index=$scope.userList.indexOf($scope.selectedUser);
                $scope.userList.splice(index,1);
            }, function(err){
                console.log(err);
            })
        }else{
        console.log("Cant delete");
        }
    }
    
    $scope.submit = function(){ //function to call on form submit
        console.log($scope.file);      
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
                       $window.alert('Success ' + resp.config.data.file.name + 'uploaded. Response: ');
                    } else {
                        $window.alert('error ');
                    }
                },function(err){
                     console.log(err);
                 });
            },function(err){
                console.log(err);
            })
           
        };
    var lastusername;
    var getNuminst= function(){
        $http.get('secure/api/user/userNumInst',config).then(function(response){
                lastusername = response.data.data[0];
                console.log(lastusername);
                $scope.submit();
        }, function(err){
            console.log(err);
        })
        
    }
    $scope.closestEvent=[];
    $scope.getClosestEvent=function(){
        var requestedData={
            'id':$scope.selectedUser.IDUSER
        }
        console.log("hello");
        $http.post('/secure/api/user/getClosestEvent',requestedData,config).then(function(response){
            $scope.closestEvent=response.data.data;
            console.log($scope.closestEvent);
        }, function(err){
            console.log(err);
        })
    } 

}])