var app = angular.module('Device', []);

app.service('sidebar', function() {
    this.currentCategory = null;
    this.categoryName = null;
    this.selectedEntry = null;
});

app.controller("RecordsController", function($scope, $http){

    $scope.init = function() {
        var deviceID = parseLocation('site', 'devices').identifier;
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
        var deviceID = parseLocation('site', 'devices').identifier;
        var url = '/api/devices/'+deviceID;
        $http.get(url)
        .success(function(data, status, headers, config) {
            results = data['results'];
            confirmation = results['confirmation'];
            if (confirmation=='success'){
                $scope.test = results;
                $scope.device = results['device'];
                sidebar.device = $scope.device;
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
        // var sidebar.device.id = parseLocation('git', 'devices').identifier;
        // console.log()
        var url = '/api/devices/'+sidebar.device.uuid;
        console.log(url);
        console.log('update device');
        console.log(sidebar.device);
        var data = JSON.stringify(sidebar.device);
        $http.put(url, data)
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

    $scope.returnCategoryName = function() {
        return sidebar.categoryName;
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

    $scope.removeEntry = function(sub, index, category) {
        $scope.getEntries(sub).splice(index, 1);
    }

    $scope.showEntries = function(entry, subcategory, category) {
        if (entry == null) {
            sidebar.currentEntry = null;
            sidebar.currentSubcategory = subcategory;
            console.log(subcategory);
        } else {
            console.log('Show Entries');
            sidebar.currentEntry = entry;
            sidebar.currentSubcategory = subcategory;

            console.log(sidebar.currentCategory[subcategory]);
            console.log(sidebar.currentEntry);
        }
        return false;
    }
});

app.controller("SelectEntriesController", function($scope, $http, sidebar){

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
        if (sidebar.currentEntry == null) {
            console.log(sidebar.currentCategory[sidebar.currentSubcategory]);
            sidebar.currentCategory[sidebar.currentSubcategory].push(id);
            console.log(sidebar.currentCategory[sidebar.currentSubcategory]);
        } else {
            var index = sidebar.currentCategory[sidebar.currentSubcategory].indexOf(sidebar.currentEntry);
            sidebar.currentCategory[sidebar.currentSubcategory][index] = id;
        }
  	}
});

function toggle () {
    if ($('.pop').hasClass('show')) {
        $('.pop').removeClass('show');
    } else {
        $('.pop').addClass('show');
    }
}