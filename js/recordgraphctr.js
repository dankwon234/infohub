var app = angular.module('RecordsGraph', []);

app.controller('RecordsGraphController', function($scope, $http) {
    $scope.currentSeries = {
        name: null
    };
    $scope.dates = [];

    $scope.init = function() {
        fetchDevices();
    }

    $scope.fetchRecords = function(device) {
        // @NOTE: series is cached -- retrieve from cache
        if (device.series) {
            console.log('series cache');
            $scope.currentSeries = {
                id: device.series.name,
                name: device.series.name,
                data: device.series.data
            };
            return;
        }

        // @NOTE: series is not cached -- API Request
        console.log("new device. API Call");
        var url = '/api/records?device=' + device.uuid;
        $http.get(url).success(function(data, status, headers, config) {
            results = data['results'];
            confirmation = results['confirmation'];
            if (confirmation=='success'){
            	$scope.records = results['records'];
                var data = [];
                var dateMap = {};
                for (var i=0;i<$scope.records.length;i++) {
                    var curDate = $scope.records[i].date.slice(0,10);

                    if (dateMap[curDate]) {
                        dateMap[curDate]++;
                    } else {
                        dateMap[curDate] = 1;
                    }

                    if ($scope.dates.indexOf(curDate) == -1) {
                        $scope.dates.unshift(curDate);
                    }
                }

                var keys = Object.keys(dateMap);
                for (var i=0;i<keys.length;i++) {
                    data.push(dateMap[keys[i]]);
                }

                device.series = {
                    id: device.name,
                    name: device.name,
                    data: data
                };

                $scope.currentSeries = device.series;
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
});

app.directive('hcPie', function () {
    return {
        restrict: 'C',
        replace: true,
        scope: {
            dates: '=dates',
            currentSeries: '=currentSeries'
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
                    title: {
                        text: 'Date'
                    },
                    categories: scope.dates,
                    labels: {
                        rotation: 45,
                        style: {
                            'font-size': '7pt'
                        }
                    }
                },
                yAxis: {
                    title: {
                        text: '# of Records'
                    }
                },
                series: scope.currentSeries
            });
            scope.$watch("currentSeries", function (currentSeries) {
                console.log(currentSeries);
                if (chart.get(currentSeries.name) != null) {
                    console.log("REMOVING");
                    chart.get(currentSeries.name).remove();
                } else {
                    if (currentSeries.name == null) {
                        return;
                    }
                    console.log("ADDING");
                    chart.addSeries(currentSeries, true);
                }
            }, false);
        }
    }
});