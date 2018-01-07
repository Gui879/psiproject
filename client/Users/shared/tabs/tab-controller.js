angular.module('app')
.controller('tabCtrl',['$scope',function($scope){
    
    $scope.Tabs = [];
    
    
    $scope.newTab = function(object){
        $scope.Tabs.push(object);
    }
}])