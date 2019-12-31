/*jm - Controllers.js - zhiqiangsong 2019*/
(function() {
    'use strict';
    /* Controllers */
    angular.module('jm.controllers')
    .controller('addEditCompanyInfoCtrl',['$modalInstance','$scope','$rootScope','$location','$modal','utilSvc','jmService','constants','cust',
	function($modalInstance,$scope,$rootScope,$location,$modal,utilSvc,apiSvc,constants,cust){
        $scope.cust = cust;//修改是带过来的值
        $scope.select_ = [//定义select的value和值
            {key_:"是",value_:"1"},
            {key_:"否",value_:"0"}
        ];
        if(cust!=undefined){
            if(cust.FDef==1)  $scope.cust.FDef=$scope.select_[0].value_;
            if(cust.FDef==0)  $scope.cust.FDef=$scope.select_[1].value_;
        }
        
        
        $scope.submit = function(){
            apiSvc.addCompanyInformation({cust:$scope.cust}).$promise.then(function(data){
                if (data){
                    utilSvc.addAlert("保存成功!", "success", true);
                    $modalInstance.close(data);
                } else {
                    utilSvc.addAlert("The Operation failed!", "fail", true);
                }
            },
            function(err){
                utilSvc.addAlert("The operation failed!", "fail", true);
            })
        }

        $scope.reset=function(){
            $scope.cust={};
            if(cust){
                angular.copy(cust,$scope.cust);
            } else {
                $scope.cust.FNumber='';
                $scope.cust.FName='';
                $scope.cust.FSHDD='';
                $scope.cust.FShr='';
                $scope.cust.FTel='';
                $scope.cust.FPhone='';
                $scope.cust.FCZ='';
                $scope.cust.FYb='';
                $scope.cust.FDef='';
            }
        }
        $scope.reset();
       
    }])
 }());
