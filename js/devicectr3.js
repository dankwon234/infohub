var app = angular.module('Device', []);

app.controller("DeviceController", function($scope, $http){
	$scope.device = {'uuid':null};
	$scope.entries = new Array();
	$scope.entriesMap = {};
	$scope.categories = new Array();
	$scope.newCategory = '';
	
	$scope.selectedCategory = null;
	$scope.selectedSubcategoryName = null;
	$scope.selectedSubcategory = null;
	$scope.swapEntryIndex = -1;

	// for re-ordering subcategory order:
	$scope.swapSubcategory = null;


    $scope.init = function() {
        var deviceID = parseLocation('site', 'devices').identifier;
        $scope.device.uuid = deviceID;
    	fetchDevice();
    }

    function fetchDevice () {
        var url = '/api/devices/'+$scope.device.uuid;
        
        $http.get(url).success(function(data, status, headers, config) {
            results = data['results'];
            confirmation = results['confirmation'];
            if (confirmation=='success'){
                $scope.device = results['device'];
                console.log('DEVICE: '+JSON.stringify($scope.device));
                
                fetchEntries();
            } else {
                alert(results['message']);
            }
        }).error(function(data, status, headers, config) {
            console.log("error", data, status, headers, config);
        });
    }

    function fetchRecords(deviceID) {
        var url = '/api/records?device=' + deviceID;
        
        $http.get(url).success(function(data, status, headers, config) {
            results = data['results'];
            confirmation = results['confirmation'];
            if (confirmation=='success'){
                $scope.records = results['records'];
                $scope.numRecords = $scope.records.length;
            } 
            else {
                alert(results['message']);
            }
            
            fetchCategories();
            
        }).error(function(data, status, headers, config) {
            console.log("error", data, status, headers, config);
        });
    }
    
    function fetchEntries() {
        var url = '/api/entries';
        
        $http.get(url).success(function(data, status, headers, config) {
            results = data['results'];
            confirmation = results['confirmation'];
            if (confirmation=='success'){
                $scope.entries = results['entries'];
                
                for (var i=0; i<$scope.entries.length; i++){
                	entry = $scope.entries[i];
                	$scope.entriesMap[entry.id] = entry.url;
                	
                }
                
            	$scope.device = $scope.device;
                fetchRecords($scope.device.uuid)
            } 
            else {
                alert(results['message']);
            }
        }).error(function(data, status, headers, config) {
            console.log("error", data, status, headers, config);
        });
    }

    function fetchCategories() {
        var url = '/api/categories';
        
        $http.get(url).success(function(data, status, headers, config) {
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


    
    $scope.updateDevice = function() {
        var url = '/api/devices/'+$scope.device.uuid;
        
        var json = JSON.stringify($scope.device);
        console.log(json);
        
        $http.put(url, json).success(function(data, status, headers, config) {
            results = data['results'];
            confirmation = results['confirmation'];
            if (confirmation=='success'){
                alert('Device successfully updated');
                console.log(results);
                // $scope.device = results['device'];
            } else {
                alert(results['message']);
            }
        }).error(function(data, status, headers, config) {
            console.log("error", data, status, headers, config);
        });
    }

    $scope.truncateString = function(string){
    	max = 28;
    	if (string.length <= max)
    		return string;
    	
    	var truncatedString = string.substring(0, max)+'...';
    	return truncatedString;
    	
    }
    
    $scope.getSubCategories = function(categoryName) {
        var order = $scope.device.configuration[categoryName].order;
        return order;
    }

    $scope.reorderSubcategory = function(subcateogryName, categoryName) {
    	
        var order = $scope.device.configuration[categoryName].order;
    	console.log('REORDER SUBCATEGORY: '+subcateogryName+' in '+JSON.stringify(order));
    	
    	if ($scope.swapSubcategory==null){
    		$scope.swapSubcategory = subcateogryName;
    		return;
    	}

    	//SWAP:
    	a = order.indexOf($scope.swapSubcategory);
    	b = order.indexOf(subcateogryName);
    	order[a] = subcateogryName;
    	order[b] = $scope.swapSubcategory;
    	
    	console.log('UPDATED: '+JSON.stringify(order));
    	$scope.swapSubcategory = null;
    }

    $scope.selectCategory = function(index) {
        var currentCategory = $scope.device.configuration.sequence[index];
        $scope.selectedCategory = $scope.device.configuration[currentCategory];
    }
    
    $scope.removeEntry = function(sub, index) {
    	entries = $scope.selectedCategory[sub];
    	entries.splice(index, 1);
    	$scope.selectedCategory[sub] = entries;
    }

	$scope.selectEntry = function(entryId){
		console.log('Select Entry: '+entryId);
		$scope.selectedSubcategory.push(entryId);
		$scope.selectedSubcategory = null;
  	}
	
    $scope.swapEntries = function(index, subcategoryName) {
    	console.log('SWAP ENTRIES: '+index);
    	
    	if ($scope.swapEntryIndex == -1){
    		$scope.swapEntryIndex = index;
    		return;
    	}
    	
    	subcategory = $scope.selectedCategory[subcategoryName];
    	swapElements(subcategory, $scope.swapEntryIndex, index);
    	
    	console.log('SWAP ENTRIES: '+JSON.stringify(subcategory));
    	$scope.selectedCategory[subcategoryName] = subcategory;
    	$scope.swapEntryIndex = -1;
    }

    function swapElements(array, indexA, indexB) {
    	  var tmp = array[indexA];
    	  array[indexA] = array[indexB];
    	  array[indexB] = tmp;
    }
    
    $scope.showEntries = function(subcategory) {
    	$scope.selectedSubcategoryName = subcategory;
    	$scope.selectedSubcategory = $scope.selectedCategory[subcategory];
        return false;
    }
    
    $scope.renameSubcategory = function(index, newSubcategoryName) {
    	oldSubcategoryName = $scope.selectedCategory.order[index];
    	if (newSubcategoryName==oldSubcategoryName)
    		return;
    	
    	console.log('RENAME SUBCATEGORY: '+newSubcategoryName+', '+oldSubcategoryName);
    	
    	$scope.selectedCategory.order[index] = newSubcategoryName; // replace subcategory name in order array
    	
    	subcategory = $scope.selectedCategory[oldSubcategoryName]; // get subcategory array using old name
    	$scope.selectedCategory[newSubcategoryName] = subcategory; // insert subcategory array into new name
    	delete $scope.selectedCategory[oldSubcategoryName]; // remove old key
    	
//    	console.log(JSON.stringify($scope.device.configuration));
    }

    $scope.addCategory = function() {
    	console.log('ADD CATEGORY: '+JSON.stringify($scope.newCategory));
    	
    	if ($scope.newCategory.length==0)
    		return;
    	
  	  url = '/api/device/'+$scope.device.uuid+'?action=addcategory&category='+$scope.newCategory;
      $http.put(url).success(function(data, status, headers, config) {
          results = data['results'];
          confirmation = results['confirmation'];
          if (confirmation=='success'){
              alert('Device successfully updated');
              $scope.device = results['device'];
              console.log($scope.device);
          } 
          else {
              alert(results['message']);
          }
      }).error(function(data, status, headers, config) {
          console.log("error", data, status, headers, config);
      });
    	
    }

    $scope.formattedDate = function(date) {
        var newDate = new Date(date).toString();
        return moment(newDate).format('MMM D, h:mma');
    }
    
    
    $scope.deleteDevice = function() {
    	console.log('DELETE DEVICE');
    	
    	var r = confirm("Are You Sure?");
    	if (r==false)
    		return;
    	
        var url = '/api/devices/'+$scope.device.uuid;
        $http.delete(url).success(function(data, status, headers, config) {
            results = data['results'];
            confirmation = results['confirmation'];
            if (confirmation=='success'){
            	window.location.href = '/';
            } 
            else {
                alert(results['message']);
            }
        }).error(function(data, status, headers, config) {
            console.log("error", data, status, headers, config);
        });
    	
    }

});


function toggle () {
    if ($('.pop').hasClass('show')) {
        $('.pop').removeClass('show');
        return;
    } 
    
    $('.pop').addClass('show');
}