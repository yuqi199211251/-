/*jm - Controllers.js - zhiqiangsong 2019*/
(function() {
    'use strict';
    /* Controllers */
    angular.module('jm.controllers')
    .controller('doctorInformationRequestCtrl',['$scope','$rootScope','$location','$modal','utilSvc','jmService','constants',
	function($scope,$rootScope,$location,$modal,utilSvc,apiSvc,constants){
        apiSvc.getDoctorInformationList().$promise.then(function(data){
             $rootScope.SubMessage = data[1];//医院级别，定义成全局变量
             var doctorInformationList = data[0];
             $scope.doctorInformationList = doctorInformationList;
             $scope.totalItems = Object.entries(doctorInformationList).length;
             $scope.itemPerPage = constants.pageMessage.itemPerPage;
             $scope.currentPage = constants.pageMessage.currentPage;
             $scope.maxSize = constants.pageMessage.maxSize;
             $scope.pageChanged=function(){
                 $scope.doctorInformationListByPage=[];
                 var startData = $scope.itemPerPage * ($scope.currentPage-1);
                 var endData = $scope.itemPerPage * $scope.currentPage-1;
                 if(endData>$scope.totalItems){
                     endData = $scope.totalItems-1
                 }
                 var num = 0;                
                 if($scope.doctorInformationListByPage){
                     for(var i = startData;i<=endData;i++){
                         if($scope.doctorInformationList[i]!=undefined){
                            $scope.doctorInformationList[i].F_101 = $scope.doctorInformationList[i].F_101.substring(0,10);
                            if($scope.doctorInformationList[i].F_109){
                                $scope.doctorInformationList[i].F_109 = '是';
                            }else{
                                $scope.doctorInformationList[i].F_109 = '否';
                            }
                            $scope.doctorInformationListByPage[num]=$scope.doctorInformationList[i];
                         }
                         num++;
                     }
                 }
             };
             $scope.pageChanged();
        },function(err){
            utilSvc.pageLoading("stop");
        })

        //点击修改按钮 
         $scope.addEditDoctorInformationRequest = function(data){
            var SubMessageLength = Object.entries($rootScope.SubMessage).length;
            var SubMessage = $rootScope.SubMessage;
            var modalInstance = $modal.open({
                templateUrl: 'partials/sales-disbtributor/company/addEditDoctorInfo.html',
                controller: 'addEditDoctorInfoCtrl',
                resolve: {
                    //预加载
                    cust:function(){return data},
                    SubMessageLength:function(){return SubMessageLength},
                    SubMessage:function(){return SubMessage}
                }
            });
            modalInstance.result.then(function (data) {//模态窗口关闭之后回传参数
                $scope.doctorInformationList = data;
                $scope.flushPage();
            }, function (reason) { 
                console.log(reason); 
            }); 
         }

         $scope.deleteDoctorInformationRequest = function(FItemID){
            apiSvc.deleteDoctorInformationRequest({FItemID:FItemID}).$promise.then(
                function(data){
                    $scope.doctorInformationList = data;
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
            $scope.doctorInformationListByPage=[];
            var startData = $scope.itemPerPage * ($scope.currentPage-1);
            var endData = $scope.itemPerPage * $scope.currentPage-1;
            $scope.totalItems = $scope.doctorInformationList.length;
            if(endData>$scope.doctorInformationList.length){
                endData = $scope.doctorInformationList.length-1
            }
            var num = 0;
            if($scope.doctorInformationList){
                for(var i = startData;i<=endData;i++){
                    if($scope.doctorInformationList[i]!=undefined){
                        $scope.doctorInformationList[i].F_101 = $scope.doctorInformationList[i].F_101.substring(0,10);
                        if($scope.doctorInformationList[i].F_109){
                            $scope.doctorInformationList[i].F_109 = '是';
                        }else{
                            $scope.doctorInformationList[i].F_109 = '否';
                        }
                        $scope.doctorInformationListByPage[num]=$scope.doctorInformationList[i];
                    }
                    num++;
                }
            }
        }
        
    }])
 }());
