var app = angular.module('Device', []);

app.controller("RecordsController", function($scope, $http){

    $scope.init = function() {
        var deviceID = parseLocation('git', 'devices').identifier;
        fetchRecords(deviceID);
    }

    function fetchRecords (deviceID) {
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
            } else {
                alert(results['message']);
            }
        }).error(function(data, status, headers, config) {
            console.log("error", data, status, headers, config);
        });
    }

    function fetchDevice () {
        var deviceID = parseLocation('git', 'devices').identifier;
        var url = '/api/devices/'+deviceID;
        $http.get(url)
        .success(function(data, status, headers, config) {
            results = data['results'];
            confirmation = results['confirmation'];
            if (confirmation=='success'){
                $scope.device = results['device'];
            } else {
                alert(results['message']);
            }
        }).error(function(data, status, headers, config) {
            console.log("error", data, status, headers, config);
        });
    }

    $scope.selectCategory = function(index) {
        var current = $scope.device.configuration.sequence[index];
        sidebar.categoryName = current;
        sidebar.currentCategory = $scope.device.configuration[current];
    }

    $scope.returnCategory = function() {
        return sidebar.currentCategory;
    }

    $scope.addCategory = function() {
        console.log('ADD CATEGORY');
    }

    $scope.getSubCategories = function(categoryName) {
        var order = $scope.device.configuration[categoryName].order;
        return order;
    }

    $scope.getEntries = function(subcategoryName) {
        var entries = sidebar.currentCategory[subcategoryName];
        return entries;
    }

    $scope.returnCategoryName = function() {
        return sidebar.categoryName;
    }

    $scope.showEntries = function(entry, subcategory) {
        if (entry == null) {
            console.log(subcategory);
            // currentSelectedEntry = subcategory;
            popup('/site/entries?action=select');
        } else {
            console.log('Show Entries');
            // currentSelectedEntry = entry;

            popup('/site/entries?action=select');
        }
        return false;
    }

    $scope.popup = function(url) {
      	newwindow = window.open(url,'name','height=450,width=900');
      	if (window.focus) {
      		newwindow.focus();
      	}
      	return false;
    }
});