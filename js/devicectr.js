var app = angular.module('Device', []);

app.controller("RecordsController", function($scope, $http){

    $scope.init = function() {
        var deviceID = parseLocation('git', 'devices').identifier;
        fetchRecords(deviceID);
    }

    function fetchRecords (deviceID) {
        console.log(deviceID);
        var url = 'http://444.zuse-infohub.appspot.com/api/records?device=' + deviceID;
        $http.get(url)
        .success(function(data, status, headers, config) {
            results = data['results'];
            confirmation = results['confirmation'];
            if (confirmation=='success'){
                $scope.records = results['records'];
                for (i=0;i<$scope.records;i++){
                    $scope.records[i].date = moment.format($scope.records[i].date);
                }
                console.log($scope.records);
            } else {
                alert(results['message']);
            }
        }).error(function(data, status, headers, config) {
            console.log("error", data, status, headers, config);
        });
    }
});