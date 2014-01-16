var app = angular.module('TemplatesPage', []);

app.controller("TemplatesController", function($scope, $http){

	$scope.templates = new Array();
	$scope.newTemplate = {};
    
    $scope.init = function() {
        console.log('Initialized');
        
		fetchTemplates();
        
    };

    function fetchTemplates() {
        var url = '/api/templates';
		$http.get(url)
		.success(function(data, status, headers, config) {
		    results = data['results'];
		    confirmation = results['confirmation'];
		    if (confirmation=='success'){

		    	$scope.templates = results['templates'];
		    	console.log('SUCCESS: '+JSON.stringify($scope.templates));
		    }
		    else{
		    	alert(results['message']);
		    }
		}).error(function(data, status, headers, config) {
		    console.log("error", data, status, headers, config);
		});
    }
    
    $scope.createTemplate = function(){
    	console.log('CREATE TEMPLATE: '+JSON.stringify($scope.newTemplate));
    	if ($scope.newTemplate.name==null){
    		alert('Please Enter a Template Name.');
    		return;
    	}
    	
		json = JSON.stringify($scope.newTemplate);

		var url = '/api/templates';
		$http.post(url, json)
		.success(function(data, status, headers, config) {
		    results = data['results'];
		    confirmation = results['confirmation'];
		    if (confirmation=='success'){
		    	$scope.newTemplate = {}; // clear out the new template reference
//		    	entry = results['entry'];
//		    	console.log('SUCCESS: '+JSON.stringify(entry));

//		    	$scope.templates = results['templates'];
		    	
		    	newTemplate = results['template'];
		    	$scope.templates.unshift(newTemplate);
		    }
		    else{
		    	alert(results['message']);
		    }

		}).error(function(data, status, headers, config) {
		    console.log("error", data, status, headers, config);
		});
    }

    
    
});