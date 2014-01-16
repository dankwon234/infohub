var app = angular.module('TemplatePage', []);

app.controller("TemplateController", function($scope, $http){

    $scope.template = { };
    
    $scope.init = function() {
        console.log('Initialized');
        
        var req = parseLocation('/site'); //@TODO: Change this back to site when we're done
        var id = req.identifier;

        if (!id) {
        	
        }
        else {
            $scope.template.id = id;
            console.log(JSON.stringify($scope.template));
            fetchTemplate();
        }

    };

    function fetchTemplate() {
        var url = '/api/templates/' + $scope.template.id;
		$http.get(url)
		.success(function(data, status, headers, config) {
		    results = data['results'];
		    confirmation = results['confirmation'];
		    if (confirmation=='success'){
//                results['entry'].date = new moment(new Date(results['entry'].date)).format('MM/DD/YYYY');
//		    	$scope.editEntry = results['entry'];

		    	$scope.template = results['template'];
		    	console.log('SUCCESS: '+JSON.stringify($scope.editEntry));
		    }
		    else{
		    	alert(results['message']);
		    }
		}).error(function(data, status, headers, config) {
		    console.log("error", data, status, headers, config);
		});
    }
    
    
    $scope.updateTemplate = function() {

        var url = '/api/templates/' + $scope.template.id;
        
		$http.put(url, JSON.stringify($scope.template))
		.success(function(data, status, headers, config) {
		    results = data['results'];
		    confirmation = results['confirmation'];
		    if (confirmation=='success'){
//                results['entry'].date = new moment(new Date(results['entry'].date)).format('MM/DD/YYYY');
//                $scope.editEntry = results['entry'];
		    	
		    	$scope.template = results['template'];
                alert('Entry successfully updated!');
                console.log($scope.editEntry);
		    }
		    else{
		    	alert(results['message']);
		    }
		}).error(function(data, status, headers, config) {
		    console.log("error", data, status, headers, config);
		});

    	
    }


});