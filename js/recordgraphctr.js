var app = angular.module('RecordsGraph', []);

app.controller('RecordsGraphController', function($scope, $http) {
    $scope.dates = [];
    $scope.init = function() {
        fetchDevices();
    }

    $scope.fetchRecords = function(id, name) {
        var url = '/api/records?device=' + id;
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
                        $scope.dates.push(curDate);
                    }
                }

                var keys = Object.keys(dateMap);
                for (var i=0;i<keys.length;i++) {
                    data.push(dateMap[keys[i]]);
                }

                $scope.series = {
                    name: name,
                    data: data
                };
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
    // record.id = device id;
    // record.date = date that the record was visited on;
});

app.directive('hcPie', function () {
    return {
        restrict: 'C',
        replace: true,
        scope: {
            items: '=',
            records: '='
        },
        template: '<div id="container" style="margin: 0 auto">not working</div>',
        link: function (scope, element, attrs) {
            var chart = new Highcharts.Chart({
                chart: {
                    renderTo: 'container'//,
                    // plotBackgroundColor: null,
                    // plotBorderWidth: null,
                    // plotShadow: false
                },
                title: {
                    text: 'Records'
                },
                xAxis: {
                    title: {
                        text: 'Date'
                    },
                    categories: scope.items, //array of record dates
                    labels: {
                        rotation: 45
                    }
                },
                yAxis: {
                    title: {
                        text: '# of Records'
                    }
                },
                series: scope.records
            });
            scope.$watch("items", function (newValue) {
                chart.series[0].setData(newValue, true);
                console.log(newValue);
            }, true);
            scope.$watch("records", function (newValue) {
                chart.addSeries(newValue, true);
                console.log("WATCHING RECORDS: NEW VALUE: ");
                console.log(newValue);
            }, true);
        }
    }
});