var app = angular.module('BaseCSSPage', []);

app.controller("BaseCSSController", function($scope, $http){

    $scope.baseCSS = { };

    $scope.init = function() {
        console.log('Initialized');
        fetchBaseCSS();
        
    };

    function fetchBaseCSS() {
        var url = '/api/basecss';
		$http.get(url)
		.success(function(data, status, headers, config) {
		    results = data['results'];
		    confirmation = results['confirmation'];
		    if (confirmation=='success'){
		    	
		    	$scope.baseCSS = results['baseCSS'];
		    	console.log('SUCCESS: '+JSON.stringify($scope.baseCSS));
		    }
		    else{
		    	alert(results['message']);
		    }
		}).error(function(data, status, headers, config) {
		    console.log("error", data, status, headers, config);
		});
    }

    $scope.updateBaseCSS = function() {
        var url = '/api/basecss';
		$http.put(url, JSON.stringify($scope.baseCSS))
		.success(function(data, status, headers, config) {
		    results = data['results'];
		    confirmation = results['confirmation'];
		    if (confirmation=='success'){
		    	$scope.baseCSS = results['baseCSS'];
                alert('baseCSS successfully updated!');
                console.log($scope.baseCSS);
		    }
		    else{
		    	alert(results['message']);
		    }
		}).error(function(data, status, headers, config) {
		    console.log("error", data, status, headers, config);
		});
    }



});