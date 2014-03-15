var app = angular.module('Device', ['sharedService']);
var currentEntry;

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
                $scope.test = results;
                $scope.device = results['device'];
                console.log('got device:');
                console.log($scope.device);
            } else {
                alert(results['message']);
            }
        }).error(function(data, status, headers, config) {
            console.log("error", data, status, headers, config);
        });
    }

    $scope.updateDevice = function() {
        var deviceID = parseLocation('git', 'devices').identifier;
        var url = '/api/devices/'+deviceID;
        console.log('update device');
        $http.put(url, $scope.device)
        .success(function(data, status, headers, config) {
            results = data['results'];
            confirmation = results['confirmation'];
            if (confirmation=='success'){
                alert('Data successfully posted');
                console.log(results);
                // $scope.device = results['device'];
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
            $scope.popup('/site/entries?action=select');
        } else {
            console.log('Show Entries');
            // console.log(entry);
            currentEntry = entry;
            // currentSelectedEntry = entry;
            $scope.popup('/site/entries?action=select');
        }
        return false;
    }

    $scope.removeEntry = function(sub, index) {
        console.log($scope.device);
        $scope.getEntries(sub).splice(index, 1);
        console.log($scope.test);
    }

    $scope.popup = function(url) {
      	newwindow = window.open(url,'name','height=450,width=900');
      	if (window.focus) {
      		newwindow.focus();
      	}
      	return false;
    }
});

function selectEntry (id) {
    // sidebar.currentCategory[] sidebar.categoryName
    console.log(id);
    console.log(currentEntry);
}