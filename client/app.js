(function(window,angular,undefined){
    angular.module('app',['ui.router','dndLists','ngFileUpload'])
    .config(['$urlRouterProvider','$stateProvider', function($urlRouterProvider,$stateProvider){
        $stateProvider

        .state('home',{
            url:'/',
            templateUrl:'/client/login/login.html',
            controller:'loginCtrl'
        })
        
        .state('user',{
            url:'/user',
            templateUrl:'/client/Users/page.html',
            controller:'userCtrl',
            abstract:true
        })
        
        .state('user.admin',{
            templateUrl:'/client/Users/admin/main_admin.html',
            controller:'adminCtrl',
            url:'/admin'
        })
        
        .state('user.teacher',{
            templateUrl:'/client/Users/teacher/main_teacher.html',
            controller:'teacherCtrl',
            url:'/teacher'
        })
        
        .state('user.users',{
            templateUrl:'/client/Users/accounts/users.html',
            controller:'usersCtrl',
            url:'/accounts'
        })
        
        .state('user.createUser',{
            templateUrl:'/client/Users/accounts/createUser.html',
            controller:'userCreationCtrl',
            url:'/createaccount'
        })
        
        .state('user.bookedRooms',{
            templateUrl:'/client/Users/bookedroom/bookedrooms.html',
            controller:'bookedroomsCtrl',
            url:'/bookedrooms'
        })
        
        .state('user.aexams',{
            templateUrl:'/client/Users/exam_admin/exams_admin.html',
            controller:'exams_adminCtrl',
            url:'/aexams'
        })
        
        .state('user.programs',{
            templateUrl:'/client/Users/programs/programMain.html',
            controller:'programMainCtrl'
        })
        
         .state('user.programs.list',{
            templateUrl:'/client/Users/programs/programs/programs.html',
            controller:'programsCtrl',
            url:'/programs'
        })
        
        .state('user.programs.createProgram',{
            templateUrl:'/client/Users/programs/createProgram/createProgram.html',
            controller:'programCreationCtrl',
            url:'/createprogram'
        })
        
        .state('user.programs.program',{
            templateUrl:'/client/Users/programs/program/program.html',
            controller:'programCtrl',
            url:'/:name',
            params:{
                'name':null,
                'index':null
            }
        })
        
        .state('user.teachercourses',{
            templateUrl:'/client/Users/teachercourses/teachercoursesMain.html',
            controller:'teachercoursesMainCtrl',
        })
        
        .state('user.teachercourses.list',{
            templateUrl:'/client/Users/teachercourses/courses/teachercourses.html',
            controller:'teachercoursesCtrl',
            url:'/teachercourses'
        })
        .state('user.teachercourses.teachercoursetab',{
            templateUrl:'/client/Users/teachercourses/course/teachercourseTab.html',
            controller:'teachercourseTabCtrl',
            url:'/teachercourseDetails/:name',
            params:{
                'name':null,
                'index':null
            }
        })
        .state('user.courses',{
            templateUrl:'/client/Users/courses/courseMain.html',
            controller:'courseMainCtrl'
        })
        
         .state('user.courses.list',{
            templateUrl:'/client/Users/courses/courses/courses.html',
            controller:'coursesCtrl',
            url:'/courses'
        })
        
        .state('user.courses.courseTab',{
            templateUrl:'/client/Users/courses/course/courseTab.html',
            controller:'courseTabCtrl',
            url:'/courseDetails/:name',
            params:{
                'name':null,
                'index':null
            }
        })
        
        .state('user.exams',{
            templateUrl:'/client/Users/exams/exams.html',
            controller:'examsCtrl',
            url:'/exams'
        })
        
        .state('user.newexam',{
            templateUrl:'/client/Users/exams/createExam.html',
            controller:'createExamCtrl',
            url:'/newExam'
        })
        
        .state('user.students',{
            templateUrl:'/client/Users/students/students.html',
            controller:'studentsCtrl',
            url:'/students'
        })
        
        .state('user.createStudent',{
            templateUrl:'/client/Users/students/createStudent.html',
            controller:'studentsCreationCtrl',
            url:'/createstudents'
        })
        
        .state('user.evaluation',{
            templateUrl:'/client/Users/evaluation/evaluation.html',
            controller:'evaluationCtrl',
            url:'/evaluation'
        })
        
        .state('user.settings',{
            templateUrl:'/client/Users/settings.html',
            controller:'settingsCtrl',
            url:'/settings'
        })
        
        $urlRouterProvider.otherwise('/');     
    }])
})(window,window.angular)