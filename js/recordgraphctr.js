var app = angular.module('RecordsGraph', []);

app.controller('RecordsGraphController', function($scope, $http) {
    $scope.series = {};
    $scope.seriesCache = {};
    $scope.dates = [];

    $scope.init = function() {
        fetchDevices();
    }

    $scope.fetchRecords = function(deviceId, deviceName) {
        // @NOTE: series is cached -- retrieve from cache
        if ($scope.seriesCache[deviceId]) {
            console.log('series cache');
            var curSeries = $scope.seriesCache[deviceId];
            $scope.series = {
                id: curSeries.name,
                name: curSeries.name,
                data: curSeries.data
            };
            return;
        }

        // @NOTE: series is not cached -- API Request
        console.log("new device. API Call");
        var url = '/api/records?device=' + deviceId;
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

                $scope.series = {
                    id: deviceName,
                    name: deviceName,
                    data: data
                };

                $scope.seriesCache[deviceId] = $scope.series;
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
            items: '=items',
            series: '=series'
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
                    categories: scope.items,
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
                series: scope.series
            });
            scope.$watch("series", function (series) {
                if (chart.get(series.name) != null) {
                    console.log("REMOVING");
                    chart.get(series.name).remove();
                } else {
                    console.log("ADDING");
                    chart.addSeries(series, true);
                }
            }, false);
        }
    }
});