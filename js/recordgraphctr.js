var app = angular.module('RecordsGraph', []);

app.controller('RecordsGraphController', function($scope, $http) {
    $scope.dates = [];
    $scope.init = function() {
        fetchDevices();
        // fetchRecords('77654979-CCDD-499F-AF90-CC23C60879D8');
    }

    $scope.fetchRecords = function(id, name) {
        var url = '/api/records?device=' + id;
        console.log(id);
        console.log(name);
        $http.get(url)
        .success(function(data, status, headers, config) {
            results = data['results'];
            confirmation = results['confirmation'];
            if (confirmation=='success'){
            	$scope.records = results['records'];
                for (var i=0;i<$scope.records.length;i++) {
                    console.log(name);
                    // $scope.series.push({
                    //     name: $scope.records[i].id,
                    //     data: []
                    // });
                    // Array of objects with name: deviceID, data: [# of records per each day]

                    if ($scope.dates.indexOf($scope.records[i].date.slice(0,10)) == -1) {
                        $scope.dates.push($scope.records[i].date.slice(0,10));
                    }
                }
            } else {
                alert(results['message']);
            }
        }).error(function(data, status, headers, config) {
            console.log("error", data, status, headers, config);
        });
    }

    function fetchDevices() {
        var url = '/api/devices';
        $http.get(url)
        .success(function(data, status, headers, config) {
            results = data['results'];
            confirmation = results['confirmation'];
            if (confirmation=='success'){
            	$scope.devices = results['devices'];
                console.log('success');
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
            items: '='
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
                    categories: scope.items//array of record dates
                },
                yAxis: {
                    title: {
                        text: '# of Records'
                    }
                },
                series: [{
                    name: "test", // Device Name/ID,
                    data: [10, 10, 20, 5, 1, 2, 3,10, 10, 20, 5, 1, 2, 3,10, 10, 20, 5, 1, 2, 3,10, 10, 20, 5, 1, 2, 3,10, 10, 20, 5, 1, 2, 3] // array of # of records (obviously each item in the array is records per day),
                                                   // data: scope.items
                },{
                    name: "test2", // Device Name/ID,
                    data: [10, 10, 20, 5, 1, 2, 3,11, 10, 20, 5, 1, 2, -5,10, 10, 20, 5, 1, 2, 17,10, 10, 20, 5, 1, 2, 9,10, 10, 10, 5, 1, 2, 3] // array of # of records (obviously each item in the array is records per day),
                                                   // data: scope.items
                },{
                    name: "test3", // Device Name/ID,
                    data: [10, 10, 20, 5, 1, 2, 3,11, 10, 20, 5, 1, 2, -5,10, 10, 20, 5, 1, 2, 17,10] // array of # of records (obviously each item in the array is records per day),
                                                   // data: scope.items
                }]
            });
            scope.$watch("items", function (newValue) {
                chart.series[0].setData(newValue, true);
                console.log(newValue);
            }, true);
        }
    }
});