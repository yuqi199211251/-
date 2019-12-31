/*jm - Controllers.js - Yadong Zhu 2018*/
(function() {
    'use strict';
    /* Controllers */
    angular.module('jm.controllers')
    .controller('navCtrl', ['$scope', '$rootScope','$location','jmService','$http', function($scope,$rootScope,$location,apiSvc,$http){
    	$scope.toggleDebug=function(){
    		$rootScope.debug=!$rootScope.debug;
        }
    	$scope.getNavbar = function(){
            apiSvc.getNavigationMenu().$promise.then(function(data){
                $scope.navbar = data.navigationMenu
            },function(err){
            })
        }
        $scope.getNavbar();
    }])
 }());
