var app = angular.module('EntryPage', []);

app.controller("EntryController", function($scope, $http){

    $scope.editEntry = {
        secondaryUrls: {}
    };
    
    $scope.subcategories = {'info':['maps', 'airport transport', 'flight check-in', 'rail', 'hotel', 'web', 'news'], 'food':['restaurants', 'quick bites', 'coffee & tea', 'drinks', 'reviews', 'restaurant search'], 'activities':['tours', 'events', 'wellness', 'sports', 'broadway', 'nightlife', 'galleries', 'museums / galleries', 'parks'], 'shopping':['department stores', 'clothing', 'shoes', 'accessories', 'convenience', 'tech / gadgets', 'toys']};
    $scope.currentMiscImage = {'id':'00000'};
    
    $scope.init = function() {
        console.log('Initialized');
//        var req = parseLocation('/git'); //@TODO: Change this back to site when we're done
        var req = parseLocation('/site'); //@TODO: Change this back to site when we're done
        var id = req.identifier;

        if (!id) {
        } else {
            $scope.editEntry.id = id;
            fetchEntry();
        }
    };

    function fetchEntry () {
        var url = '/api/entries/' + $scope.editEntry.id;
		$http.get(url)
		.success(function(data, status, headers, config) {
		    results = data['results'];
		    confirmation = results['confirmation'];
		    if (confirmation=='success'){
                results['entry'].date = new moment(new Date(results['entry'].date)).format('MM/DD/YYYY');
		    	$scope.editEntry = results['entry'];

		    	console.log('SUCCESS: '+JSON.stringify($scope.editEntry));
		    }
		    else{
		    	alert(results['message']);
		    }
		}).error(function(data, status, headers, config) {
		    console.log("error", data, status, headers, config);
		});
    }

    $scope.updateEntry = function() {
        var url = '/api/entries/' + $scope.editEntry.id;
		$http.put(url, JSON.stringify($scope.editEntry))
		.success(function(data, status, headers, config) {
		    results = data['results'];
		    confirmation = results['confirmation'];
		    if (confirmation=='success'){
                results['entry'].date = new moment(new Date(results['entry'].date)).format('MM/DD/YYYY');
                $scope.editEntry = results['entry'];
                alert('Entry successfully updated!');
                console.log($scope.editEntry);
		    }
		    else{
		    	alert(results['message']);
		    }
		}).error(function(data, status, headers, config) {
		    console.log("error", data, status, headers, config);
		});
    }


    $scope.deleteEntry = function() {
    	var sure = confirm('Are You Sure? This action cannot be reversed.');
    	if (sure==false)
    		return;

        var url = '/api/entries/' + $scope.editEntry.id;
		$http.delete(url)
		.success(function(data, status, headers, config) {
		    results = data['results'];
		    confirmation = results['confirmation'];
		    if (confirmation=='success'){
		    	window.location.replace("/site/entries");
		    }
		    else{
		    	alert(results['message']);
		    }
		}).error(function(data, status, headers, config) {
		    console.log("error", data, status, headers, config);
		});
    }


    $scope.getUploadURL = function() {
        var url = '/api/upload?resource=entry&id='+$scope.editEntry.id;
		$http.get(url)
		.success(function(data, status, headers, config) {
		    results = data['results'];
		    confirmation = results['confirmation'];
		    if (confirmation=='success'){
                var uploadURL = results['upload'];
                document.getElementById('image-form').action = uploadURL;
                document.getElementById('image-form').submit();
		    }
		    else{
		    	alert(results['message']);
		    }
		}).error(function(data, status, headers, config) {
		    console.log("error", data, status, headers, config);
		});
    }

    $scope.viewPreview = function() {
    	var url = '/site/preview/'+$scope.editEntry.id;
    	console.log('View Entry: '+url);

    	popup(url, 691, 691);
    	popup(url, 315, 315);
    	popup(url, 315, 370);
    	popup(url, 315, 691);

    }
    
    $scope.addMiscImage = function() {
        console.log("addMiscImage");
        
        imageId = $scope.currentMiscImage.id;
        $scope.editEntry.miscImages.push(imageId);
        
        var index = $scope.editEntry.miscImages.indexOf('none');
        if (index > -1) 
        	$scope.editEntry.miscImages.splice(index, 1);
        
        console.log(JSON.stringify($scope.editEntry.miscImages));
    }
    
    $scope.removeMiscImage = function(imageId) {
        console.log("removeMiscImage: "+imageId);
        
        var index = $scope.editEntry.miscImages.indexOf(imageId);
        if (index > -1) 
        	$scope.editEntry.miscImages.splice(index, 1);
        
        if ($scope.editEntry.miscImages.length==0)
        	$scope.editEntry.miscImages.push('none');
        
        console.log(JSON.stringify($scope.editEntry.miscImages));
        return false;
    }
    
    


    $scope.addSecondaryUrl = function() {
        console.log("addSecondaryUrls");
        var purpose = document.getElementById("secondaryUrl-purpose").value;
        var url = document.getElementById("secondaryUrl-url").value;
        console.log(purpose);
        console.log(url);

        $scope.editEntry.secondaryUrls[purpose] = url;

        console.log(JSON.stringify($scope.editEntry.secondaryUrls));
    }

    $scope.purposeKeys = function() {
//        console.log(Object.keys($scope.editEntry.secondaryUrls));
        return Object.keys($scope.editEntry.secondaryUrls);
    }
    
    $scope.currentSubcategories = function() {
        console.log("CURRENT SUBCATEGORIES: "+$scope.editEntry.category);
      return $scope.subcategories[$scope.editEntry.category]
  }
    

    $scope.updateWithFoursquare = function() {
        console.log("UPDATE WITH FOURSQUARE: "+$scope.editEntry.id);
        console.log("UPDATE WITH FOURSQUARE: "+$scope.editEntry.foursquareId);
        
        if ($scope.editEntry.foursquareId=='none'){
        	alert('Please Enter a Valid Foursquare ID');
        	return false;
        }

        if ($scope.editEntry.foursquareId.length < 8){
        	alert('Please Enter a Valid Foursquare ID');
        	return false;
        }
        
        
//        var url = '/api/foursquare?entry='+$scope.editEntry.id+'&venue='+$scope.editEntry.foursquareId;
//		$http.get(url)
//		.success(function(data, status, headers, config) {
//		    results = data['results'];
//		    confirmation = results['confirmation'];
//		    if (confirmation=='success'){
//                results['entry'].date = new moment(new Date(results['entry'].date)).format('MM/DD/YYYY');
//		    	$scope.editEntry = results['entry'];
//		    }
//		    else{
//		    	alert(results['message']);
//		    }
//		}).error(function(data, status, headers, config) {
//		    console.log("error", data, status, headers, config);
//		});

        
      var url = '/api/foursquare';
//        var url = '/api/entries/' + $scope.editEntry.id;
		$http.put(url, JSON.stringify($scope.editEntry))
		.success(function(data, status, headers, config) {
		    results = data['results'];
		    confirmation = results['confirmation'];
		    if (confirmation=='success'){
                results['entry'].date = new moment(new Date(results['entry'].date)).format('MM/DD/YYYY');
                $scope.editEntry = results['entry'];
                alert('Entry successfully updated!');
                console.log($scope.editEntry);
		    }
		    else{
		    	alert(results['message']);
		    }
		}).error(function(data, status, headers, config) {
		    console.log("error", data, status, headers, config);
		});
		
  }

    
    $scope.clear = function(property) {
    	currentValue = $scope.editEntry[property];
    	if (currentValue=='none')
        	$scope.editEntry[property] = '';
    	
    }


    function popup(url, w, h) {

		dimensions = 'height='+h+',width='+w;
	  	newwindow = window.open(url,'',dimensions);

	  	if (window.focus) {
	  		newwindow.focus();
	  	}
	  	return false;
	  }

});