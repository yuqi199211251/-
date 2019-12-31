/*jm - Controllers.js - zhiqiangsong 2019*/
(function() {
    'use strict';
    /* Controllers */
    angular.module('jm.controllers')
    .controller('addEditDoctorInfoCtrl',['$modalInstance','$scope','$rootScope','$location','$modal','utilSvc','jmService','constants','cust','SubMessageLength','SubMessage',
	function($modalInstance,$scope,$rootScope,$location,$modal,utilSvc,apiSvc,constants,cust,SubMessageLength,SubMessage){
        $scope.cust = cust;//修改是带过来的值
        
        $scope.select_ = SubMessage;//赋值给html的select选择框
        if(cust!=undefined){
            for(var i=0;i<SubMessageLength;i++){
                if($scope.cust.hospital==SubMessage[i].FName){
                    $scope.cust.hospital_ = SubMessage[i].FitemID+'';
                    break;
                }
            }
            if($scope.cust.F_109 == '是') $scope.cust.F_109 = '1';
            if($scope.cust.F_109 == '否') $scope.cust.F_109 = '0';
        }
        
        
        $scope.submit = function(){
            if($scope.cust.F_101==null) {
                $scope.cust.F_101 = '';
            }else if(typeof($scope.cust.F_101)=='object'){
                $scope.cust.F_101 =  $scope.cust.F_101.getFullYear()+'-'+("0"+($scope.cust.F_101.getMonth()+1)).slice(-2)+'-'+("0"+$scope.cust.F_101.getDate()).slice(-2);
            }else{
                $scope.cust.F_101 = $scope.cust.F_101;
            } 
            if($scope.cust.F_106==null) $scope.cust.F_106 = '';
            if($scope.cust.F_107==null) $scope.cust.F_107 = '';
            if($scope.cust.F_108==null) $scope.cust.F_108 = '';
            if($scope.cust.F_109==null) $scope.cust.F_109 = '';
            if($scope.cust.F_110==null) $scope.cust.F_110 = '';
            if($scope.cust.F_111==null) $scope.cust.F_111 = '';
            
            apiSvc.editHospitalInformation({cust:$scope.cust,submID:$scope.cust.hospital_}).$promise.then(function(data){
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
