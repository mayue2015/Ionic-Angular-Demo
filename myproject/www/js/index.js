angular.module('ionicApp', ['ionic'])

.config(function($stateProvider, $urlRouterProvider) {

  $stateProvider
    .state('eventmenu', {
      url: "/event",
      abstract: true,
      templateUrl: "templates/event-menu.html"
    })
    .state('eventmenu.home', {
      url: "/home",
      views: {
        'menuContent' :{
          templateUrl: "templates/home.html"
        }
      }
    })
    .state('eventmenu.checkin', {
      url: "/check-in",
      views: {
        'menuContent' :{
          templateUrl: "templates/check-in.html",
          controller: "CheckinCtrl"
        }
      }
    })
    .state('eventmenu.attendees', {
      url: "/attendees",
      views: {
        'menuContent' :{
          templateUrl: "templates/attendees.html",
          controller: "AttendeesCtrl"
        }
      }
    })
    .state('eventmenu.login',{
      url: "/login",
      views: {
        'menuContent': {
          templateUrl: "templates/login.html",
          controller: "LoginCtrl"
        }
      }
    })
    .state('eventmenu.welcome',{
      url: "/welcome",
      views: {
        'menuContent': {
          templateUrl: "templates/welcome.html"
        }
      }
    })
  
  $urlRouterProvider.otherwise("/event/home");
})

.service('jsonService', function($q, $http){
  var deferred = $q.defer();
  $http.get('../data.json').then(function(data){
    deferred.resolve(data);
  });

  this.getData = function(){
    return deferred.promise;
  }
})

.controller('MainCtrl', function($scope, $ionicSideMenuDelegate) {
  $scope.attendees = [
    { firstname: 'Nicolas', lastname: 'Cage' },
    { firstname: 'Jean-Claude', lastname: 'Van Damme' },
    { firstname: 'Keanu', lastname: 'Reeves' },
    { firstname: 'Steven', lastname: 'Seagal' }
  ];
  
  $scope.toggleLeft = function() {
    $ionicSideMenuDelegate.toggleLeft();
  };
})

.controller('CheckinCtrl', function($scope, $timeout) {
  $scope.showForm = true;
  
  $scope.shirtSizes = [
    { text: '大', value: 'L' },
    { text: '中', value: 'M' },
    { text: '小', value: 'S' }
  ];
  
  $scope.attendee = {};
  $scope.submit = function() {
    if(!$scope.attendee.firstname) {
      alert('Info required');
      return;
    }
    $scope.showForm = false;
    $scope.attendees.push($scope.attendee);
  };

  $scope.doRefresh = function(){
    $timeout(function() {
      $scope.$broadcast('scroll.refreshComplete');
    }, 1000);
  }
  
})

.controller('AttendeesCtrl', function($scope, jsonService) {
  
  $scope.activity = [];
  $scope.arrivedChange = function(attendee) {
    var msg = attendee.firstname + ' ' + attendee.lastname;
    msg += (!attendee.arrived ? ' has arrived, ' : ' just left, '); 
    msg += new Date().getMilliseconds();
    $scope.activity.push(msg);
    if($scope.activity.length > 3) {
      $scope.activity.splice(0, 1);
    }
  };

  var promise = jsonService.getData();
  promise.then(function(data){
    $scope.dataJson = data.data;
    console.log($scope.dataJson);
  })
  
})

.controller('LoginCtrl', function($scope, $state){
  $scope.user = {};
  $scope.login = function(){
    $state.go('eventmenu.home')
  }
});