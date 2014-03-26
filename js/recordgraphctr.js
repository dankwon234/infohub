var app = angular.module('RecordsGraph', []);

app.controller('RecordsGraphController', function($scope, $http) {
    $scope.currentData = {
        series: {
            name: null
        },
        dates: []
    };
    $scope.currentDates = [];
    // $scope.dates = [];

    $scope.init = function() {
        fetchDevices();
    }

    $scope.fetchRecords = function(device) {
        // @NOTE: series is cached -- retrieve from cache
        if (device.data) {
            console.log('series cache');
            $scope.currentDates = device.data.dates;
            $scope.currentSeries = {
                id: device.data.series.name,
                name: device.data.series.name,
                data: device.data.series.data
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
                device.data = {
                    series: {},
                    dates: []
                };
                for (var i=0;i<$scope.records.length;i++) {

                    var curDate = $scope.records[i].date.slice(0,10);

                    if (dateMap[curDate]) {
                        dateMap[curDate]++;
                    } else {
                        dateMap[curDate] = 1;
                    }

                    if (device.data.dates.indexOf(curDate) == -1) {
                        device.data.dates.unshift(curDate);
                    }

                    // if ($scope.dates.indexOf(curDate) == -1) {
                    //     $scope.dates.unshift(curDate);
                    // }

                }

                var keys = Object.keys(dateMap);
                for (var i=0;i<keys.length;i++) {
                    data.push([keys[i], dateMap[keys[i]]]);
                }
                console.log(data);

                device.data.series = {
                    id: device.name,
                    name: device.name,
                    data: data
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
                    title: {
                        text: 'Date'
                    },
                    categories: scope.currentData.dates,
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
                series: scope.currentData.series
            });
            // scope.$watch("currentDates", function (currentDates) {
            //     console.log(newValue);
            //     chart.series[0].setData(newValue, true);
            // }, true);
            scope.$watch("currentData", function (currentData) {
                if (chart.get(currentData.series.name) != null) {
                    console.log("REMOVING");
                    chart.get(currentData.series.name).remove();
                } else {
                    if (currentData.series.name == null) {
                        return;
                    }
                    console.log("ADDING");
                    // console.log(currentData);
                    chart.addSeries(currentData.series, true);
                    // console.log(chart.get(currentData.series.name));
                    // var index = chart.get(currentData.series.name)['_i'];
                    // console.log(index);
                    // console.log(chart.series[index]);
                    // chart.series[index].setData(currentData.dates, true);
                }
            }, false);
        }
    }
});