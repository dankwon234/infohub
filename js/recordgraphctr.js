var app = angular.module('RecordsGraph', []);

app.controller('RecordsGraphController', function($scope, $http) {
    $scope.testData = [{
                    name: "test", // Device Name/ID,
                    data: [10, 10, 20, 5, 1, 2, 3,10, 10, 20, 5, 1, 2, 3,10, 10, 20, 5, 1, 2, 3,10, 10, 20, 5, 1, 2, 3,10, 10, 20, 5, 1, 2, 3] // array of # of records (obviously each item in the array is records per day),
                                                   // data: scope.items
                },{
                    name: "test2", // Device Name/ID,
                    data: [10, 10, 20, 5, 1, 2, 3,11, 10, 20, 5, 1, 2, -5,10, 10, 20, 5, 1, 2, 17,10, 10, 20, 5, 1, 2, 9,10, 10, 10, 5, 1, 2, 3] // array of # of records (obviously each item in the array is records per day),
                                                   // data: scope.items
                }];

    $scope.dates = [];
    $scope.init = function() {
        fetchDevices();
        // fetchRecords('77654979-CCDD-499F-AF90-CC23C60879D8');
    }

    $scope.fetchRecords = function(id, name) {

        $scope.testData.push({
                    name: "test3", // Device Name/ID,
                    data: [10, 10, 20, 5, 1, 2, 3,11, 10, 20, 5, 1, 2, -5,10, 10, 20, 5, 1, 2, 17,10] // array of # of records (obviously each item in the array is records per day),
                                                   // data: scope.items
                });

        var url = '/api/records?device=' + id;
        $http.get(url).success(function(data, status, headers, config) {
            results = data['results'];
            confirmation = results['confirmation'];
            if (confirmation=='success'){
            	$scope.records = results['records'];
                var data = [];
                var prevDate = "";
                var j=0;
                for (var i=0;i<$scope.records.length;i++) {
                    // current date: $scope.records[i].date.slice(0,10)
                    var curDate = $scope.records[i].date.slice(0,10);

                    console.log("LAST DATE: ");
                    console.log(prevDate);
                    console.log("CURRENT RECORD'S DATE: ");
                    console.log(curDate);

                    j++;
                    if (curDate == prevDate) {
                    } else {
                        console.log("prevDate = curDate");
                        prevDate = curDate;
                        data.push(j);
                        j=1;
                    }
                    // dateArray.push($scope.records[i].date.slice(0,10));

                    // // on a record. so increment
                    // j++;
                    // // if the record's date is not equal to last date,

                    // if ($scope.records[i].date.slice(0,10) != lastDate) {
                    //     //push date
                    //     lastDate = $scope.records[i].date.slice(0,10);
                    //     data.push(j);
                    //     j=0;
                    // } else {
                    //     j++;
                    // }

                    // data.push(number of records on that date);
                    // j++;
                    // Array of objects with name: deviceID, data: [# of records per each day]

                    if ($scope.dates.indexOf(curDate) == -1) {
                        $scope.dates.push(curDate);
                    }
                }
                console.log("DATA: ");
                console.log(data);
                // console.log($scope.dates);
                // $scope.series.push({
                //     name: name,
                //     data: data
                // });
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
                    categories: scope.items//array of record dates
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
        }
    }
});