var app = angular.module('RecordsGraph', []);

app.controller('RecordsGraphController', function($scope, $http) {
    $scope.init = function() {
    	fetchRecords();
    }

    function fetchRecords() {
        var url = '/api/records?device=' + device;
        $http.get(url)
        .success(function(data, status, headers, config) {
            results = data['results'];
            confirmation = results['confirmation'];
            if (confirmation=='success'){
            	$scope.records = results['records'];
                console.log($scope.records);
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
                tooltip: {
                    pointFormat: '{series.name}: <b>{point.percentage}%</b>',
                    percentageDecimals: 1
                },
                plotOptions: {
                    pie: {
                        allowPointSelect: true,
                        cursor: 'pointer',
                        dataLabels: {
                            enabled: true,
                            color: '#000000',
                            connectorColor: '#000000',
                            formatter: function () {
                                return '<b>' + this.point.name + '</b>: ' + this.percentage + ' %';
                            }
                        }
                    }
                },
                series: [{
                    type: 'pie',
                    name: 'Browser share',
                    data: scope.items
                }]
            });
            scope.$watch("items", function (newValue) {
                chart.series[0].setData(newValue, true);
            }, true);
        }
    }
});