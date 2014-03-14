var app = angular.module('SelectEntriesPopup', []);

app.controller("SelectEntriesController", function($scope, $http){

    // $scope.text = function(){ return SharedService.get() }
    // $scope.change = function(){ SharedService.change('app 2 activated') }

    $scope.filter = '';

    $scope.init = function() {
        fetchEntries();
    }

    function fetchEntries () {
        var url = '/api/entries';
        $http.get(url)
        .success(function(data, status, headers, config) {
            results = data['results'];
            confirmation = results['confirmation'];
            if (confirmation=='success'){
                $scope.entries = results['entries'];
            } else {
                alert(results['message']);
            }
        }).error(function(data, status, headers, config) {
            console.log("error", data, status, headers, config);
        });
    }

	$scope.select = function(id){
        parent = window.opener;
        if (!parent)
            return true;

        parent.selectEntry(id); // pass back the uniqueId of the entry

        window.close();
        return false;
  	}
});