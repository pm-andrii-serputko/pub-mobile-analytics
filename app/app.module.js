(function(angular) {
    "use strict";

    angular
        .module("pub-mobile-analytics", [])
        .controller("Main", function($scope) {
            $scope.back = function() {};
        });

    if (window.cordova) {
        document.addEventListener("deviceready", onDeviceReady, false);
    } else {
        onDeviceReady();
    }

    function onDeviceReady() {
        angular.element(document).ready(function() {
            angular.bootstrap(document, ["pub-mobile-analytics"]);
        });
    }

}).call(this, angular);
