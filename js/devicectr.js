var app = angular.module('Device', []);
// var currentEntry;

app.service('sidebar', function() {
    this.currentCategory = null;
    this.categoryName = null;
    this.selectedEntry = null;
});

app.service('popup', function () {
    var property = 'First';

    return {
        getProperty: function () {
            return property;
        },
        setProperty: function(value) {
            property = value;
        }
    };
});

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

app.controller("ConfigController", function($scope, $http, sidebar, popup){

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
        var deviceID = parseLocation('git', 'devices').identifier;
        var url = '/api/device/'+deviceID;
        console.log('update device');
        console.log(sidebar.device);
        var data = JSON.stringify(sidebar.device);
        $http.put(url, data)
        .success(function(data, status, headers, config) {
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


        // popup.sharedObject = sidebar.currentCategory;
        // console.log(popup.sharedObject);


        // popup.currentCategory =
        popup.setProperty($scope.device.configuration[current]);
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
            console.log(subcategory);
            // currentSelectedEntry = subcategory;
            $scope.popup('/git/entries?action=select&branch=device2'); // /site/entries?action=select
        } else {
            console.log('Show Entries');


            // sidebar.currentCategory = $scope.device.configuration[category][subcategory][entry];
            sidebar.currentEntry = entry;

            // popup.entry = $scope.device.configuration[category][subcategory][entry];
            console.log(sidebar.currentEntry);
            // console.log(entry);
            // currentSelectedEntry = entry;
            $scope.popup('/git/entries?action=select&branch=device2'); // /site/entries?action=select
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

app.controller("SelectEntriesController", function($scope, $http, sidebar, popup){

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

        // parent.selectEntry(id); // pass back the uniqueId of the entry
        sidebar.selectedEntry = id;

        // console.log(popup.currentCategory);
        console.log('this is a test');
        console.log(popup.getProperty());
        // var entries = sidebar.currentCategory[subcategoryName];

        // console.log(popup.entry);

        // window.close();
        return false;
  	}
});