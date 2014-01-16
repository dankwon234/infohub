var app = angular.module('PreviewPage', []);

app.controller("PreviewController", function($scope, $http){

    $scope.entry = {};

    $scope.init = function() {
        console.log('Initialized');
        var req = parseLocation('/site'); 
        var id = req.identifier;

        if (!id) {
        	
        } 
        else {
            $scope.entry.id = id;
            fetchEntry();
        }
    };

    function fetchEntry () {
        var url = '/api/entries/' + $scope.entry.id;
		$http.get(url)
		.success(function(data, status, headers, config) {
		    results = data['results'];
		    confirmation = results['confirmation'];
		    if (confirmation=='success'){
                results['entry'].date = new moment(new Date(results['entry'].date)).format('MM/DD/YYYY');
		    	$scope.entry = results['entry'];

		    	console.log('SUCCESS: '+JSON.stringify($scope.entry));
		    }
		    else{
		    	alert(results['message']);
		    }
		}).error(function(data, status, headers, config) {
		    console.log("error", data, status, headers, config);
		});
    }


    
    
});