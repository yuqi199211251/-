/*jm - Controllers.js - zhiqiangsong 2019*/
(function() {
    'use strict';
    /* Controllers */
    angular.module('jm.controllers')
    .controller('electronicSignatureInfoCtrl',['$modalInstance','$scope','$rootScope','$location','$modal','utilSvc','jmService','constants','cust','fxsbm','mc',
	function($modalInstance,$scope,$rootScope,$location,$modal,utilSvc,apiSvc,constants,cust,fxsbm,mc){
        $scope.cust = cust;
        $scope.fxsbm = fxsbm;
        $scope.mc = mc;
        $scope.submit = function(){
            /*var obj = document.getElementById("fileField");
            var file = obj.files[0];
            var windowURL = window.URL || window.webkitURL;  
            var dataURL = windowURL.createObjectURL(file); 
            $scope.cust.dataURL = dataURL;
            apiSvc.saveElectronicSignatureInformation({cust:$scope.cust,submID:$scope.cust.hospital_}).$promise.then(function(data){
                if (data){
                    utilSvc.addAlert("保存成功!", "success", true);
                    
                    $modalInstance.close(data);
                } else {
                    utilSvc.addAlert("The Operation failed!", "fail", false);
                }
            },
            function(err){
                utilSvc.addAlert("The operation failed!", "fail", false);
            })*/
            var oFm = document.getElementById('imgupload');
            oFm.submit();
        }

        $scope.reset=function(){
            $scope.cust={};
            if(cust){
                angular.copy(cust,$scope.cust);
            } else {
                $scope.cust.F_106='';
                $scope.cust.F_107='';
                $scope.cust.F_108='';
                $scope.cust.F_109='';
                $scope.cust.F_110='';
                $scope.cust.F_111='';
                $scope.cust.FName_='';
            }
        }
        $scope.reset();
       
    }])
 }());
