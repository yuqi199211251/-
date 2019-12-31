/*jm - Controllers.js - zhiqiangsong 2019*/
(function() {
    'use strict';
    /* Controllers */
    angular.module('jm.controllers')
    .controller('electronicSignatureRequestCtrl',['$scope','$rootScope','$location','$modal','utilSvc','jmService','constants',
	function($scope,$rootScope,$location,$modal,utilSvc,apiSvc,constants){
        apiSvc.getElectronicSignatureList().$promise.then(function(data){
            
             var electronicSignatureList = data[0];
             $rootScope.fxsbm = electronicSignatureList[0].fenxiaoshangbianma;
             $rootScope.mc = electronicSignatureList[0].fenxiaoshangmingcheng;
             $scope.electronicSignatureList = electronicSignatureList;
             $scope.totalItems = Object.entries(electronicSignatureList).length;
             $scope.itemPerPage = constants.pageMessage.itemPerPage;
             $scope.currentPage = constants.pageMessage.currentPage;
             $scope.maxSize = constants.pageMessage.maxSize;
             $scope.pageChanged=function(){
                 $scope.electronicSignatureListByPage=[];
                 var startData = $scope.itemPerPage * ($scope.currentPage-1);
                 var endData = $scope.itemPerPage * $scope.currentPage-1;
                 if(endData>$scope.totalItems){
                     endData = $scope.totalItems-1
                 }
                 var num = 0;                
                 if($scope.electronicSignatureListByPage){
                     for(var i = startData;i<=endData;i++){
                         if($scope.electronicSignatureList[i]!=undefined){
                            $scope.electronicSignatureList[i].danjuriqi = $scope.electronicSignatureList[i].danjuriqi.substring(0,10);
                            $scope.electronicSignatureListByPage[num]=$scope.electronicSignatureList[i];
                         }
                         num++;
                     }
                 }
             };
             $scope.pageChanged();
        },function(err){
            utilSvc.pageLoading("stop");
        })

        //预览
        $scope.obDoctorInformationRequest = function(electronicSignature){
            var modalInstance = $modal.open({
                templateUrl: 'partials/sales-disbtributor/company/obElectronicSignatureInfo.html',
                controller: 'obElectronicSignatureInfoCtrl',
                resolve: {
                    //预加载
                    electronicSignature:function(){return electronicSignature}
                }
            });
            modalInstance.result.then(function (data) {//模态窗口关闭之后回传参数
                $scope.electronicSignatureList = data;
                $scope.flushPage();
            }, function (reason) { 
                console.log(reason); 
            }); 
        }

        //点击添加按钮 
         $scope.addElectronicSignatureRequest = function(data){
            var modalInstance = $modal.open({
                templateUrl: 'partials/sales-disbtributor/company/addElectronicSignatureInfo.html',
                controller: 'electronicSignatureInfoCtrl',
                resolve: {
                    //预加载
                    cust:function(){return data},
                    fxsbm:function(){return $rootScope.fxsbm},
                    mc:function(){return $rootScope.mc}
                }
            });
            modalInstance.result.then(function (data) {//模态窗口关闭之后回传参数
                $scope.electronicSignatureList = data;
                $scope.flushPage();
            }, function (reason) { 
                console.log(reason); 
            }); 
         }

         $scope.deleteDoctorInformationRequest = function(FItemID){
            apiSvc.deleteDoctorInformationRequest({FItemID:FItemID}).$promise.then(
                function(data){
                    $scope.electronicSignatureList = data;
                    $scope.flushPage();
                },
                function(err){
                    if (err.data&&err.data.message)
                        utilSvc.addAlert(err.data.message, "fail", false);
                    else
                        utilSvc.addAlert(JSON.stringify(err), "fail", false);
                }) 
        }


        $scope.flushPage=function(){
            $scope.electronicSignatureListByPage=[];
            var startData = $scope.itemPerPage * ($scope.currentPage-1);
            var endData = $scope.itemPerPage * $scope.currentPage-1;
            $scope.totalItems = $scope.electronicSignatureList.length;
            if(endData>$scope.electronicSignatureList.length){
                endData = $scope.electronicSignatureList.length-1
            }
            var num = 0;
            if($scope.electronicSignatureList){
                for(var i = startData;i<=endData;i++){
                    if($scope.electronicSignatureList[i]!=undefined){
                        $scope.electronicSignatureListByPage[num]=$scope.electronicSignatureList[i];
                    }
                    num++;
                }
            }
        }
        
    }])
 }());
