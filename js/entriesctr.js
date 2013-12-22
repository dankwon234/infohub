var app = angular.module('EntriesPage', []);


app.controller("EntryController", function($scope, $http){

	$scope.newEntry = {};
	$scope.entries = new Array();

	// set today as default date:
	var today = new Date();
	mo = parseInt(today.getMonth().toString());
	var dateStr = (mo+1)+"/"+today.getDate().toString()+"/"+today.getFullYear().toString();

	$scope.newEntry['date'] = dateStr;

	$scope.init = function() {
		console.log('Entries Ctr: INIT!');

		fetchEntries();


	}

	function fetchEntries(){
		console.log('FETCH ENTRIES');

		var url = '/api/entries';
		$http.get(url)
		.success(function(data, status, headers, config) {
		    results = data['results'];
		    confirmation = results['confirmation'];
		    if (confirmation=='success'){
		    	$scope.entries = results['entries'];
		    	console.log('SUCCESS: '+JSON.stringify($scope.entries));
		    }
		    else{
		    	alert(results['message']);
		    }


		}).error(function(data, status, headers, config) {
		    console.log("error", data, status, headers, config);
		});


	}

	$scope.submitEntry = function(){
		json = JSON.stringify($scope.newEntry);
		console.log('newEntry: JSON = '+json);

		var url = '/api/entries';
		$http.post(url, json)
		.success(function(data, status, headers, config) {
		    results = data['results'];
		    confirmation = results['confirmation'];
		    if (confirmation=='success'){
		    	$scope.newEntry = {}; // clear out the new entry reference
		    	entry = results['entry'];
		    	console.log('SUCCESS: '+JSON.stringify(entry));

		    	$scope.entries = results['entries'];
		    }
		    else{
		    	alert(results['message']);
		    }

		}).error(function(data, status, headers, config) {
		    console.log("error", data, status, headers, config);
		});
	}

	$scope.dateSelected = function(){
		console.log('DATE SELECTED');
        console.warn('test');
        console.log($('#datePicker').val());
	}



});