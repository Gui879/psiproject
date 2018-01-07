angular.module('app')
    .controller('settingsCtrl',['$scope','$http','userSvc','Upload','$window',function($scope,$http,userSvc,Upload,$window){
        var config ={
            "headers":{
                "auth-token":userSvc.token
            }
        }
        $scope.submit = function(){ //function to call on form submit
            upload($scope.file); //call upload function

            if ($scope.phoneNumber==undefined && $scope.email==undefined)
            {
                /* $window.alert("No modiciations where made!"); */
            }
            else if ($scope.email==undefined)
            {
                $scope.userupdate($scope.phoneNumber ,$scope.utilizador[0].email ,userSvc.user.USERNAME);
            }

            else if($scope.phoneNumber==undefined)
            {

                $scope.userupdate($scope.utilizador[0].telefone , $scope.email ,userSvc.user.USERNAME);

            }


        }
        
        $scope.toggle=false;




        var upload = function (file)
        {
            var params=
                {
                    'filename':userSvc.user.USERNAME,
                }
            $http.post('/upload/setimgstorage',params).then(function(response)
            {


                Upload.upload(
                    {
                        url: '/upload/img', //webAPI exposed to upload the file
                        data:{file:file} //pass file as data, should be user ng-model
                    }).then(function(resp)
                { //upload function returns a promise
                    if(resp.data.error_code === 0){ //validate success
                        $scope.source="/client/profilepics/"+userSvc.user.USERNAME+".png?"+Math.random();
                        $("#profilePicture").attr("src",$scope.source);
                    } else {
                        
                    }
                },function(err){
                    console.log(err);
                });
            },function(err){
                console.log(err);
            })

        };




        $("#imgClass").click(function(){
            $("#uploadFoto").trigger('click');
            $("#fake").css("display","none");
        });
        $scope.utilizador;
        $scope.getuser= function (user){
            var requestedData={
                'user':user
            }
            $http.post("/secure/api/user/getuser",requestedData,config).then(function(response){
                $scope.utilizador=response.data.data;
            },function(err){

            });

        };
        $scope.altereduser;
        $scope.userupdate= function (phoneNumber, email, user){
            var requestedData={
                'phoneNumber':phoneNumber,
                'email':email,
                'user':user
            }
            $http.post("/secure/api/user/userupdate",requestedData,config).then(function(response){
                $scope.altereduser=response.data.data;
                $scope.popupShow('editsucess');
                setTimeout(function(){
                    $scope.popuphide();
                },2500);
                
            },function(err){
                console.log(err);
            });

        };

        $scope.getuser(userSvc.user.USERNAME);


        $scope.bdpassword;
        $scope.getpassword= function(user){
            var requestedData={
                'user':user
            }
            $http.post("/secure/api/user/getpassword",requestedData,config).then(function(response){
                $scope.bdpassword=response.data.data[0].password;

            },function(err){
                console.log(err);
            });



        }
        $scope.changedpassword;
        $scope.changePassword= function (user,newpassword) {
            var requestedData={
                'user':user,
                'newpassword':newpassword
            }
            $http.post("/secure/api/user/changepassword",requestedData,config).then(function(response){
                $scope.bdpassword=requestedData.newpassword;
                $scope.popupShow('passsucess');
                setTimeout(function(){
                    $scope.popuphide();
                    $scope.pass1=$scope.pass2=$scope.pass3="";
                },2500);

            },function(err){
                console.log(err);
            });



        }


        $scope.getpassword(userSvc.user.USERNAME);
        $scope.passwordchange = function (password1,password2, password3) {
            $scope.popuphide();
                $("#right>input").removeClass("importantRed");
            if(password1==undefined){
                $("#pass1").addClass("importantRed");
            }
            if(password2==undefined){
                $("#pass2").addClass("importantRed");
            }
            if(password3==undefined){
                $("#pass3").addClass("importantRed");
            }
            if(password1!=password2){
                $("#pass1").addClass("importantRed");
                $("#pass2").addClass("importantRed");
            }else{

                if(password3==$scope.bdpassword){
                    $scope.changePassword(userSvc.user.USERNAME,password1)
                }else{
                    $("#pass3").addClass("importantRed");

                }
            }



        }
        
        $scope.popupShow = function(id){
            $("#menuDark").children().css("display", "none");
            $("#menuDark").css("display", "block");
            $("#menuDark>#"+id).css("display", "block");

        }
        
        
        $scope.popuphide = function(){
            $(document).ready(function(){
                $("#menuDark").css("display", "none");
            });
        }
        
    }])