angular.module("app")
.factory("dataSvc",function(){
    var students=null;
    var users=null;
    
    return {
        set:function(studentsList){
            students = studentsList;
            return;
        },
        getStudents:function(){
            return students;
        },
        setUsers:function(usersList){
            users = usersList;
            return;
        },
        getUsers:function(){
            return users;
        }
    };




})