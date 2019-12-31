/*jm - Controllers.js - zhiqiangsong 2019*/
(function() {
    'use strict';
    /* Controllers */
    angular.module('jm.controllers')
    .controller('addEditHospitalInfoCtrl',['$modalInstance','$scope','$rootScope','$location','$modal','utilSvc','jmService','constants','cust','SubMessageLength','SubMessage',
	function($modalInstance,$scope,$rootScope,$location,$modal,utilSvc,apiSvc,constants,cust,SubMessageLength,SubMessage){
        $scope.cust = cust;//修改是带过来的值
        $scope.select_ = SubMessage;//赋值给html的select选择框
        for(var i=0;i<SubMessageLength;i++){
            if($scope.cust.FName_==SubMessage[i].FName_sm){
                $scope.cust.FName_sm = SubMessage[i].FInterID+'';
                break;
            }
        }
        
        $scope.submit = function(){
            if($scope.cust.F_106==null) $scope.cust.F_106 = '';
            if($scope.cust.F_107==null) $scope.cust.F_107 = '';
            if($scope.cust.F_108==null) $scope.cust.F_108 = '';
            if($scope.cust.F_109==null) $scope.cust.F_109 = '';
            if($scope.cust.F_110==null) $scope.cust.F_110 = '';
            if($scope.cust.F_111==null) $scope.cust.F_111 = '';
            apiSvc.editHospitalInformation({cust:$scope.cust,submID:$scope.cust.FName_sm}).$promise.then(function(data){
                if (data){
                    utilSvc.addAlert("保存成功!", "success", true);
                    $modalInstance.close(data);
                } else {
                    utilSvc.addAlert("The Operation failed!", "fail", false);
                }
            },
            function(err){
                utilSvc.addAlert("The operation failed!", "fail", false);
            })
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
