var app = angular.module('EntryPage', []);

app.controller("EntryController", function($scope, $http){

	$scope.editEntry = {};

    $scope.init = function() {
        console.log('Initialized');
    };
});
