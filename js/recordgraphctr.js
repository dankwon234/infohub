var app = angular.module('RecordsGraph', []);

app.controller('RecordsGraphController', function($scope, $http) {
    $scope.init = function() {
    	fetchRecords('77654979-CCDD-499F-AF90-CC23C60879D8');
    }

    function fetchRecords(device) {
        var url = '/api/records?device=' + device;
        $http.get(url)
        .success(function(data, status, headers, config) {
            results = data['results'];
            confirmation = results['confirmation'];
            if (confirmation=='success'){
            	$scope.records = results['records'];
                var dates = [];
                for (var i=0;i<$scope.records;i++) {
                    console.log($scope.records[i].date);
                    if (dates.indexOf($scope.records[i].date) == -1) {
                        dates.push($scope.records[i].date);
                    }
                }
                $scope.dates = dates;
                // console.log($scope.records);
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
            console.log(3);
            var chart = new Highcharts.Chart({
                chart: {
                    renderTo: 'container',
                    plotBackgroundColor: null,
                    plotBorderWidth: null,
                    plotShadow: false
                },
                title: {
                    text: 'Records'
                },
                xAxis: {
                    title: {
                        text: 'Date'
                    },
                    categories: scope.dates//array of record dates
                },
                yAxis: {
                    title: {
                        text: '# of Records'
                    }
                },
                series: [{
                    name: "test", // Device Name/ID,
                    data: [10, 10, 20, 5, 1, 2, 3] // array of # of records (obviously each item in the array is records per day),
                                                   // data: scope.items
                }]
            });
            scope.$watch("items", function (newValue) {
                chart.series[0].setData(newValue, true);
            }, true);
        }
    }
});