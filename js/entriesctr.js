var app = angular.module('EntriesPage', []);

app.directive('bs-datepicker', function () {
            return {
                require: 'ngModel',
                link: function (scope, el, attr, ngModel) {
                    $(el).datepicker({
                        dateFormat: 'mm/dd/yy',
                        onSelect: function (dateText) {
                            scope.$apply(function () {
                                ngModel.$setViewValue(dateText);
                            });
                        }
                    });
                }
            };
        });

app.controller("EntryController", function($scope, $http){

	$scope.newEntry = {};
	$scope.entries = new Array();
	$scope.clone = new Array();

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
        console.log($('#datePicker').val());
        console.log(JSON.stringify($scope.newEntry));
	}

	$scope.selectEntry = function(entryIndex){
		entry = $scope.entries[entryIndex];
		
		var entryRemoved = false;
		for (var i=0; i<$scope.clone.length; i++){
			entryId = $scope.clone[i];
//			console.log(entryId+' == '+entry.id+'?');
			if (entryId==entry.id){ // remove entry id
				$scope.clone.splice(i, 1);
				entryRemoved = true;
				break;
			}
			
		}
		
		if (entryRemoved==false)
			$scope.clone.push(entry.id);

		console.log('SELECT ENTRY: '+JSON.stringify($scope.clone));
	}

	
	$scope.cloneEntries = function(){
		if ($scope.clone.length==0){
			alert('Please select at least one entry to clone.');
			return;
		}
		
		json = JSON.stringify({'clone':$scope.clone});
		console.log('CLONE ENTRIES: = '+json);

		var url = '/api/entries';
		$http.post(url, json)
		.success(function(data, status, headers, config) {
		    results = data['results'];
		    confirmation = results['confirmation'];
		    if (confirmation=='success'){
		    	$scope.newEntry = {}; // clear out the new entry reference
		    	$scope.entries = results['entries'];
		    }
		    else{
		    	alert(results['message']);
		    }

		}).error(function(data, status, headers, config) {
		    console.log("error", data, status, headers, config);
		});

	}
	
	
	

});