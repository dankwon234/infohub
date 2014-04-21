var app = angular.module('RecordSummary', []);

app.controller('RecordSummaryController', function($scope, $http) {
    $scope.devices = new Array();
    $scope.currentData = {
        series: {
            name: null
        }
    };
    
	$scope.summary = {};
    $scope.dateRange = new Array();


    
    $scope.init = function() {
        fetchRecordSummary();
    }
    
    $scope.selectDevice = function(device) {
    	console.log('select device: '+JSON.stringify(device));
    }

    $scope.fetchRecords = function($event, device) {
    	var checkbox = $event.target;
    	
    	if (checkbox.checked == false){
    		index = $scope.devices.indexOf(device);
    		console.log("UNCHECKED. Index = "+index);
    		
    		$scope.currentData = {
    		        series: {
    		            name: device.name
    		        }
    		};
    		
    		return;
    	}
    	
        // series is cached -- used cached data
        if (device.data) {
            console.log('series cache');
            $scope.currentSeries = {
                id: device.data.series.name,
                name: device.data.series.name,
                data: device.data.series.data
            };
            
            $scope.currentData = device.data;

            return;
        }

        // @series is not cached -- fetch data from backend:
        console.log("new device. API Call");
        var url = '/api/records?device=' + device.uuid;
        $http.get(url).success(function(data, status, headers, config) {
            results = data['results'];
            confirmation = results['confirmation'];
            if (confirmation=='success'){
                var points = [];
                var dateMap = {};
                device.data = {
                    series: {}
                };
                
                pointsMap = {};
            	for (var i=0; i<$scope.dateRange.length; i++){
            		pointsMap[$scope.dateRange[i]] = 0;
            	}
                
                
            	records = results['records'];
            	for (var i=0; i<records.length; i++){
            		record = records[i];
            		recordDate = formattedDate(record.date); // using Moment.js here in order to convert UTC dates into EST times
            		
            		if (pointsMap.hasOwnProperty(recordDate)) { 
            			  num = pointsMap[recordDate];
            			  pointsMap[recordDate] = num+1;
            		}
            	}
            	
            	// populate the data points:
            	for (var i=0; i<$scope.dateRange.length; i++){
            		dateStr = $scope.dateRange[i];
            		count = pointsMap[dateStr];
                    points.push([dateStr, count]);

            		
            	}
                console.log(JSON.stringify(points));

                device.data.series = {
                    id: device.name,
                    name: device.name,
                    data: points
                };

                $scope.currentData = device.data;
            } else {
                alert(results['message']);
            }
        }).error(function(data, status, headers, config) {
            console.log("error", data, status, headers, config);
        });
    }

    
    
    function formattedDate(date) {
        var newDate = new Date(date).toString();
        return moment(newDate).format('MMM DD');
    }
    
    function fetchRecordSummary() {

        var url = '/api/recordsummary';
        $http.get(url).success(function(data, status, headers, config) {
            results = data['results'];
            confirmation = results['confirmation'];
            if (confirmation=='success'){
            	$scope.summary = results['recordsummary'];
            	console.log(JSON.stringify($scope.summary));
            	
            	data = {'series':{}};
            	data.series.id = 'TEST DATA';
            	data.series.name = '';
            	
            	
                var points = [];
            	categoriesCount = $scope.summary.categories;
                for (var key in categoriesCount) {
                	count = parseInt(categoriesCount[key]);
                    points.push([key, count]);
                	
                }
                
                // points.push([dateStr, count]);

//                points.push(['first', 10]);
//                points.push(['second', 20]);
//                points.push(['third', 50]);
//                points.push(['fourth', 35]);

            	data.series.data = points;

            	$scope.currentData = data;

            	
            	
            } 
            else {
                alert(results['message']);
            }
        }).error(function(data, status, headers, config) {
            console.log("error", data, status, headers, config);
        });
    	
    }


});

app.directive('linechart', function () {
    return {
        restrict: 'C', // 'A' restricts directive to attribute, 'C' - class, 'E' - element
        replace: true,
        scope: {
            currentData: '=series'
        },
        template: '<div id="container" style="margin: 0 auto">not working</div>',
        link: function (scope, element, attrs) {
            var chart = new Highcharts.Chart({
                chart: {
                	type: 'column',
                    renderTo: 'container'
                },
                title: {
                    text: 'Summary'
                },
                
                xAxis: {
                	type:'category',
                    title: {
                        text: 'Categories'
                    },
                    labels: {
                        rotation: 75,
                        style: {
                            'font-size': '7pt'
                        }
                    }
                },
                
                yAxis: {
                	min: 0,
                    title: {
                        text: '# of Selections'
                    }
                },
                
                series: scope.currentData.series
            });
            
            scope.$watch("currentData", function (currentData) {
                if (chart.get(currentData.series.name) == null) {
                    if (currentData.series.name == null) {
                        return;
                    }
                    
                    chart.addSeries(currentData.series, true);
                }
                else {
                    chart.get(currentData.series.name).remove();
                }
                
            }, false);
        }
    }
});