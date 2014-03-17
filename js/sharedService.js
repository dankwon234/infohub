angular.module('sharedService', []).service('SharedService', function($rootScope, $window) {

    var text = 'Initial state';
        $window.rootScopes = $window.rootScopes || [];
        $window.rootScopes.push($rootScope);

        if (!!$window.sharedService){
          return $window.sharedService;
        }

        $window.sharedService = {
          change: function(newText){
            text = newText;
            angular.forEach($window.rootScopes, function(scope) {
              if(!scope.$$phase) {
                  scope.$apply();
              }
            });
          },
          get: function(){
            return text;
          }
        }

        return $window.sharedService;
    });