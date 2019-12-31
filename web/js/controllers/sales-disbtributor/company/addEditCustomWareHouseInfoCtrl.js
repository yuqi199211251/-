/*jm - Controllers.js - zhiqiangsong 2019*/
(function() {
    'use strict';
    /* Controllers */
    angular.module('jm.controllers')
    .controller('addEditCustomWareHouseInfoCtrl',['$modalInstance','$scope','$rootScope','$location','$modal','utilSvc','jmService','constants','cust',
	function($modalInstance,$scope,$rootScope,$location,$modal,utilSvc,apiSvc,constants,cust){
        $scope.cust = cust;//修改是带过来的值
        
        $scope.submit = function(){
            if($scope.cust.FName==null) $scope.cust.FName = '';
            apiSvc.addEditCustomWareHouseInformation({cust:$scope.cust}).$promise.then(function(data){
                if (data[0]=='exit'){
                    utilSvc.addAlert("仓库已经存在!建议前面加公司简称以避免重复", "fail", false);
                }else{
                    utilSvc.addAlert("保存成功!", "success", true);
                    $modalInstance.close(data);
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
