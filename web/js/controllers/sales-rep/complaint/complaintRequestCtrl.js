/*jm - Controllers.js - zhiqiangsong 2019*/
(function() {
    'use strict';
    /* Controllers */
    angular.module('jm.controllers')
    .controller('complaintRequestCtrl',['$scope','$rootScope','$location','$modal','complaintRequestList','utilSvc','jmService','constants',
	function($scope,$rootScope,$location,$modal,complaintRequestList,utilSvc,apiSvc,constants){
        $scope.temp={};
        $scope.dealerSalesDataSearch={};
        $rootScope.complaintRequest = {};
        $rootScope.complaintRequest.startDate = "";
        $rootScope.complaintRequest.endDate = "";
        if (complaintRequestList){
             $scope.complaintRequestList = complaintRequestList;
             $scope.totalItems = complaintRequestList.length;
             $scope.itemPerPage = constants.pageMessage.itemPerPage;
             $scope.currentPage = constants.pageMessage.currentPage;
             $scope.maxSize = constants.pageMessage.maxSize;
             $scope.pageChanged=function(){
                 $scope.complaintRequestListByPage=[];
                 var startData = $scope.itemPerPage * ($scope.currentPage-1);
                 var endData = $scope.itemPerPage * $scope.currentPage-1;
                 if(endData>$scope.totalItems){
                     endData = $scope.totalItems-1
                 }
                 var num = 0;                
                 if($scope.complaintRequestListByPage){
                     for(var i = startData;i<=endData;i++){
                         if($scope.complaintRequestList[i]!=undefined){
                             $scope.complaintRequestListByPage[num]=$scope.complaintRequestList[i];
                         }
                         num++;
                     }
                 }
             };
             $scope.pageChanged();
         }

        $scope.addOrEditDealerSalesData=function(dealerSalesData){
            $location.path("/dealerSalesDataMaintenance/"+dealerSalesData.FID);
        };

        $scope.addEditComplaintRequest=function(complaintRequest){
            var FID;
            if (complaintRequest) {
                FID = complaintRequest.FID
            }
            $location.path("/addEditComplaintRequest/"+FID);
        };

        $scope.copyBusinessPrice=function(){
            var modalInstance;
            modalInstance = $modal.open({
                templateUrl: 'partials/copy-business-price.html',
                windowClass: "sub-detail-modal",
                controller: "copyBusinessPriceCtrl",
                backdrop: "static",
                resolve:{
                }
            });
            modalInstance.result.then(function(businessPriceList) {
                $scope.businessPriceList = businessPriceList;
                $scope.adjustmentData();
            });
        };
        $scope.deleteComplaintRequest=function(complaintRequest){
            if($rootScope.authUser.userName != complaintRequest.FUserName){
                utilSvc.addAlert("只能删除本人制单的单据，删除失败！", "fail", true);
                return;
            }
            if(complaintRequest.FCheckDate1 != "" && complaintRequest.FCheckDate1 != null){
                utilSvc.addAlert("该单据已经提交无法删除！", "fail", true);
                return;
            }
            apiSvc.deleteComplaintRequest({complaintRequest:complaintRequest,startDate:$rootScope.startDate,endDate:$rootScope.endDate}).$promise.then(
                function(data){
                    $scope.complaintRequestList = data;
                    $scope.adjustmentData();
                },
                function(err){
                    if (err.data&&err.data.message)
                        utilSvc.addAlert(err.data.message, "fail", true);
                    else
                        utilSvc.addAlert(JSON.stringify(err), "fail", true);
                }) 
        };

        $scope.queryComplaintRequestList=function(){
            var startDate;
            if($scope.temp.startDate != undefined && $scope.temp.startDate != "undefined" && $scope.temp.startDate != ""){
                startDate = utilSvc.dateToString($scope.temp.startDate);
            }
            var endDate;
            if($scope.temp.endDate != undefined && $scope.temp.endDate != "undefined" && $scope.temp.endDate != ""){
                endDate = utilSvc.dateToString($scope.temp.endDate);
            }
            $rootScope.complaintRequest.startDate = startDate;
            $rootScope.complaintRequest.endDate = endDate;
            apiSvc.getComplaintRequestList({startDate:startDate,endDate:endDate}).$promise.then(
                function(data){
                    $scope.complaintRequestList = data;
                    $scope.adjustmentData();
                },
                function(err){
                    if (err.data&&err.data.message)
                        utilSvc.addAlert(err.data.message, "fail", true);
                    else
                        utilSvc.addAlert(JSON.stringify(err), "fail", true);
                }) 
        };

        $scope.showAuditLog=function(complaintRequest){
            var modalInstance;
            modalInstance = $modal.open({
                templateUrl: 'partials/common/logMessage/show-audit-log.html',
                windowClass: "sub-detail-modal",
                controller: "showAuditLogCtrl",
                backdrop: "static",
                resolve:{
                    auditLogList:['$q','jmService','utilSvc',
                        function($q,apiSvc,util){
                            var deferred = $q.defer();
                            util.pageLoading("start");
                            if (true){
                                apiSvc.getAuditLogList({complaintRequest:complaintRequest}).$promise.then(function(data){
                                    if (data){
                                        deferred.resolve(data);
                                    } else {
                                        deferred.resolve(undefined);
                                    }
                                    util.pageLoading("stop");
                                },function(err){
                                    deferred.reject(err);
                                    util.pageLoading("stop");
                                })
                            }else {
                                deferred.resolve(undefined)
                                util.pageLoading("stop");
                            }
                            
                            return deferred.promise;
                        }]
                }
            });
        };

        $scope.checkComplaintRequest=function(complaintRequest){
            var modalInstance;
            modalInstance = $modal.open({
                templateUrl: 'partials/sales-rep/complaint/check-complaint-request.html',
                windowClass: "sub-detail-modal",
                controller: "checkComplaintRequestCtrl",
                backdrop: "static",
                resolve:{
                    complaintRequest:function(){return complaintRequest;},
                    complaintRequestList:function(){return $scope.complaintRequestList}
                }
            });
            modalInstance.result.then(function(complaintRequestList) {
                $scope.complaintRequestList = complaintRequestList;
                $scope.adjustmentData();
            });
        };
        
        $scope.adjustmentData=function(){
            $scope.complaintRequestListByPage=[];
            var startData = $scope.itemPerPage * ($scope.currentPage-1);
            var endData = $scope.itemPerPage * $scope.currentPage-1;
            $scope.totalItems = $scope.complaintRequestList.length;
            if(endData>$scope.complaintRequestList.length){
                endData = $scope.complaintRequestList.length-1
            }
            var num = 0;
            if($scope.complaintRequestList){
                for(var i = startData;i<=endData;i++){
                    if($scope.complaintRequestList[i]!=undefined){
                        $scope.complaintRequestListByPage[num]=$scope.complaintRequestList[i];
                    }
                    num++;
                }
            }
        }


    }])
 }());
