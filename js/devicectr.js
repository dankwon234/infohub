var app = angular.module('Device', []);

app.controller("RecordsController", function($scope, $http){

    $scope.init = function() {
        var deviceID = parseLocation('git', 'devices').identifier;
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

app.service('sidebar', function() {
    this.currentCategory = null;
});

app.controller("ConfigController", function($scope, $http, sidebar){
    $scope.currentCategory = 'test';

    $scope.init = function() {
        fetchCategories();
        fetchDevice();
    }

    function fetchCategories () {
        var url = '/api/categories';
        $http.get(url)
        .success(function(data, status, headers, config) {
            results = data['results'];
            confirmation = results['confirmation'];
            if (confirmation=='success'){
                $scope.categories = results['categories'];
                // console.log($scope.categories);
            } else {
                alert(results['message']);
            }
        }).error(function(data, status, headers, config) {
            console.log("error", data, status, headers, config);
        });
    }

    function fetchDevice () {
        var deviceID = parseLocation('git', 'devices').identifier;
        // http://zuse-infohub.appspot.com/api/devices/EDE0AFA7-D090-445F-B240-FDFC42CEC323
        var url = '/api/devices/'+deviceID;
        $http.get(url)
        .success(function(data, status, headers, config) {
            results = data['results'];
            confirmation = results['confirmation'];
            if (confirmation=='success'){
                $scope.device = results['device'];
                console.log(results);
            } else {
                alert(results['message']);
            }
        }).error(function(data, status, headers, config) {
            console.log("error", data, status, headers, config);
        });
    }

    $scope.selectCategory = function(index) {
        $scope.currentCategory = $scope.device.configuration.sequence[index];

        sidebar.currentCategory = $scope.currentCategory;
        console.log('selectCategory----Controller'+$scope.currentCategory);
    }

    $scope.returnCategory = function() {
        switch(n) {
            case "test":
                return "test";
                break;
            case "hello":
                return "hello";
                break;
            default:
                return sidebar.currentCategory;
        }
    }

    $scope.addCategory = function() {
        console.log('ADD CATEGORY');
    }

    $scope.getSubCategories = function(categoryName) {
        var order = $scope.device.configuration[categoryName].order;
        return order
        // $scope.device.configuration.
    }
});