var app = angular.module('EntryPage', []);

app.controller("EntryController", function($scope, $http){

    $scope.editEntry = {
        'image': 'http://www.placehold.it/300x300'
        'title': 'Placeholder',
        'subtitle': 'Placeholder',
        'date': '01-01-2014',
        'url': 'http://www.google.com',
        'description': 'Placeholder',
        'theme-color-1': 'red',
        'theme-color-2': 'red',
        'banner': {
            'ad': 'http://www.google.com',
            'image': 'http://www.placehold.it/600x100'
        },
        'x': '308290',
        'y': '342809',
        'button': {
            'text': 'Submit',
            'link': 'http://www.google.com'
        }
    };

    $scope.init = function() {
        console.log('Initialized');
    };
});
