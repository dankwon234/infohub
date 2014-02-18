var app = angular.module('Device', []);

app.controller("RecordsController", function($scope, $http){

    deviceID = parseLocation('git', 'devices');

    $scope.init = function() {
        fetchRecords();
    }

    function fetchRecords () {
        var url = '/api/records?device=' + deviceID;
        $http.get(url)
        .success(function(data, status, headers, config) {
            results = data['results'];
            confirmation = results['confirmation'];
            if (confirmation=='success'){
                $scope.records = results['records'];
            } else {
                alert(results['message']);
            }
        }).error(function(data, status, headers, config) {
            console.log("error", data, status, headers, config);
        });
    }
});