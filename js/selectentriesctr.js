var app = angular.module('SelectEntriesPopup', []);

app.controller("SelectEntriesController", function($scope, $http){
    // configuration holds ids which correspond to /api/entries/:id
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

      //     /site/selectentries = url
      //
      //     $scope.popup = function(url) {
      //     newwindow = window.open(url,'name','height=450,width=900');
      //     if (window.focus) {
      //         newwindow.focus();
      //     }
      //     return false;
      // }
});