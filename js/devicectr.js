deviceID = parseLocation('git', 'devices').identifier;

var app = angular.module('Device', []);

app.controller("RecordsController", function($scope, $http){

    $scope.init = function() {
        fetchRecords(deviceID);
    }

    function fetchRecords (deviceID) {
        console.log(deviceID);
        var url = '/api/records?device=' + deviceID;
        $http.get(url)
        .success(function(data, status, headers, config) {
            results = data['results'];
            confirmation = results['confirmation'];
            if (confirmation=='success'){
                $scope.records = results['records'];
                $scope.numRecords = $scope.records.length;
            } else {
                alert(results['message']);
            }
        }).error(function(data, status, headers, config) {
            console.log("error", data, status, headers, config);
        });
    }

    $scope.convert = function(date) {
        var newDate = new Date(date).toString();
        newDate = moment(newDate).format('MMM D, h:mma');
        return newDate;
    }

});

app.controller("ConfigController", function($scope, $http){
    $scope.init = function() {
        fetchCategories();
    }

    function fetchCategories () {
        var url = '/api/categories';
        $http.get(url)
        .success(function(data, status, headers, config) {
            results = data['results'];
            confirmation = results['confirmation'];
            if (confirmation=='success'){
                $scope.categories = results['categories'];
                console.log($scope.categories);
            } else {
                alert(results['message']);
            }
        }).error(function(data, status, headers, config) {
            console.log("error", data, status, headers, config);
        });
    }

    // $scope.addCategory = function() {
    //     var url = '/api/device/'+deviceID+'?action=addcategory&category='+categoryId;
    //     $http.put(url, $scope.category)
    //     .success(function(data, status, headers, config) {
    //         results = data['results'];
    //         confirmation = results['confirmation'];
    //         if (confirmation=='success'){
    //             $scope.categories = results['categories'];
    //         } else {
    //             alert(results['message']);
    //         }
    //     }).error(function(data, status, headers, config) {
    //         console.log("error", data, status, headers, config);
    //     });
    // }

});