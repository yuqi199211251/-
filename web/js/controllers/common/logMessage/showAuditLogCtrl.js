/*jm - Controllers.js - Yadong Zhu 2018*/
(function() {
    'use strict';
    /* Controllers */
    angular.module('jm.controllers')
    .controller('showAuditLogCtrl', ['$scope','auditLogList',
    	 function($scope,auditLogList){
             $scope.auditLogList=auditLogList;
    }])
 }());
