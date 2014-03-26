var app = angular.module('RecordsGraph', []);

app.controller('RecordsGraphController', function($scope, $http) {
    $scope.devices = new Array();
    $scope.currentData = {
        series: {
            name: null
        }
    };
    
    $scope.dateRange = new Array();

    
    $scope.init = function() {
    	
    	var d = new Date();
    	for (var i=0; i<30; i++){
    		var day = new Date();
    		day.setDate(d.getDate()-i);
    		
    		dateString = day.toString(); //Wed Mar 26 2014 10:58:16 GMT-0400 (EDT)
    		
    		parts = dateString.split(' ');
    		dateString = parts[1]+' '+parts[2];
    		$scope.dateRange.unshift(dateString); // this inserts the element into the first position of the array
    	}
    	
		console.log(JSON.stringify($scope.dateRange));
    	
        fetchDevices();
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
    	
        // @NOTE: series is cached -- used cached data
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

    function fetchDevices() {
        var url = '/api/devices';
        $http.get(url).success(function(data, status, headers, config) {
            results = data['results'];
            confirmation = results['confirmation'];
            if (confirmation=='success'){
            	$scope.devices = results['devices'];
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


});

app.directive('linechart', function () {
    return {
        restrict: 'C',
        replace: true,
        scope: {
            currentData: '=series'
        },
        template: '<div id="container" style="margin: 0 auto">not working</div>',
        link: function (scope, element, attrs) {
            var chart = new Highcharts.Chart({
                chart: {
                    renderTo: 'container'
                },
                title: {
                    text: 'Records'
                },
                
                xAxis: {
                	type:'category',
                    title: {
                        text: 'Date'
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
                        text: '# of Records'
                    }
                },
                
                series: scope.currentData.series
            });
            
            scope.$watch("currentData", function (currentData) {
                if (chart.get(currentData.series.name) == null) {
                    if (currentData.series.name == null) {
                        return;
                    }
                    
//                    console.log("ADD SERIES");
                    chart.addSeries(currentData.series, true);
                }
                else {
//                    console.log("REMOVE SERIES");
                    chart.get(currentData.series.name).remove();
                }
                
            }, false);
        }
    }
});