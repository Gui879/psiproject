(function(window,angular,undefined){
    angular.module('app')
    .controller('loginCtrl',['$scope','$http','$state','userSvc', function($scope,$http,$state,userSvc){
        $scope.warning= false;
        $scope.loginUser=function(user){
            $scope.warning= false;
            $http.post('api/user/login',user).then(function(response){
                if(response.data.userData)
                userSvc.token = response.data.token;
                userSvc.user = response.data.userData;
                console.log(userSvc.user);
                localStorage.setItem('token',JSON.stringify(userSvc.token));
                localStorage.setItem('user',JSON.stringify(userSvc.user));
                
                if(user.username.charAt(0) == 'a'){
                    $state.go('user.admin');
                    localStorage.setItem('statelabel','ahome')
                }else if(user.username.charAt(0) == 'p'){
                    $state.go('user.teacher');
                    localStorage.setItem('statelabel','thome')
                }

            },function(err){
                console.error(err);
                $scope.warning=true;
            })
        }
                            
                            
                            
    }])
})(window,window.angular)