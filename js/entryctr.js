var app = angular.module('EntryPage', []);

app.controller("EntryController", function($scope, $http){

    $scope.template = {'layout' : 'B'};

    $scope.editEntry = {
        'id': 0,
        'image': 'none',
        'title': 'Placeholder',
        'html': '',
        'subtitle': 'Placeholder',
        'date': '01/01/2014',
        'url': 'http://www.google.com',
        'description': 'Placeholder',
        'themeColor1': '#000000',
        'themeColor2': '#FFFFFF',
        'banner': {
            'ad': 'http://www.google.com',
            'image': 'http://www.placehold.it/600x100'
        },
        'x': '30.8290',
        'y': '34.2809',
        'button': {
            'text': 'Submit',
            'link': 'http://www.google.com'
        },
        'contactNumber': ''
    };

    $scope.init = function() {
        console.log('Initialized');
        var req = parseLocation('/git'); // @TODO: We will have to switch this to '/site' for live deploy
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
    	var url = '/site/preview/'+$scope.editEntry.id+'?card='+$scope.template.layout;
    	console.log('View Entry: '+url);

    	popup(url);
    }
    
    
    function popup(url) {
	  	newwindow = window.open(url,'','height=450,width=900');
	  	if (window.focus) {
	  		newwindow.focus();
	  	}
	  	return false;
	  }

    
    
});