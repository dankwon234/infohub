angular.module('sharedService', []).factory('SharedService', function() {

  var SharedService;

  SharedService = (function() {

    function SharedService() {
      /* method code... */
    }

    SharedService.prototype.setData = function(name, data) {
      /* method code... */
    };
    return SharedService;

  })();

  if (typeof(window.angularSharedService) == 'undefined' || window.angularSharedService == null) {
    window.angularSharedService = new SharedService();
  }
  return window.angularSharedService;});