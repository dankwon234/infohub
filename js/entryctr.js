var app = angular.module('EntryPage', []);

app.controller("EntryController", function($scope, $http){

    $scope.editEntry = {
        'image': 'http://www.placehold.it/300x300',
        'title': 'Placeholder',
        'subtitle': 'Placeholder',
        'date': '01-01-2014',
        'url': 'http://www.google.com',
        'description': 'Placeholder',
        'themecolor1': '#000',
        'themecolor2': '#FFF',
        'banner': {
            'ad': 'http://www.google.com',
            'image': 'http://www.placehold.it/600x100'
        },
        'x': '30.8290',
        'y': '34.2809',
        'button': {
            'text': 'Submit',
            'link': 'http://www.google.com'
        }
    };

    $scope.init = function() {
        console.log('Initialized');
        var req = parseLocation('/site');
        console.warn(JSON.stringify(req));
    };
});
