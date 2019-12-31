/*jm - Controllers.js - yuqi 2019*/
(function () {
    'use strict';
    /* Controllers */
    angular.module('jm.controllers')
        .controller('myApplyCtrl', ['$scope', '$rootScope', '$location', '$modal', 'utilSvc', 'jmService', 'constants',
            function ($scope, $rootScope, $location, $modal, utilSvc, apiSvc, constants) {
                //我的申请
                var selectCond = $("#selectCond").val();
                var selectInput = $("#selectInput").val();
                apiSvc.getMyApplyList({ selectCond: selectCond, selectInput: selectInput }).$promise.then(
                    function (data) {
                        var myApplyList = data;
                        $scope.myApplyList = myApplyList;
                        $scope.totalItems = Object.entries(myApplyList).length;
                        $scope.itemPerPage = constants.pageMessage.itemPerPage;
                        $scope.currentPage = constants.pageMessage.currentPage;
                        $scope.maxSize = constants.pageMessage.maxSize;
                        $scope.pageChanged = function () {
                            $scope.myApplyListByPage = [];
                            var startData = $scope.itemPerPage * ($scope.currentPage - 1);
                            var endData = $scope.itemPerPage * $scope.currentPage - 1;
                            if (endData > $scope.totalItems) {
                                endData = $scope.totalItems - 1
                            }
                            var num = 0;
                            if ($scope.myApplyListByPage) {
                                for (var i = startData; i <= endData; i++) {
                                    if ($scope.myApplyList[i] != undefined) {
                                        $scope.myApplyListByPage[num] = $scope.myApplyList[i];
                                        $scope.myApplyListByPage[num].requestdate = $scope.myApplyListByPage[num].requestdate.substring(0, 10);//时间字符串截取
                                    }
                                    num++;
                                }
                            }
                        };
                        $scope.pageChanged();
                    },
                    function (err) {
                        if (err.data && err.data.message)
                            utilSvc.addAlert(err.data.message, "fail", true);
                        else
                            utilSvc.addAlert(JSON.stringify(err), "fail", true);
                    }
                )

                $scope.selectMyApplyList = function () {
                    var selectCond = $("#selectCond").val();
                    var selectInput = $("#selectInput").val();
                    apiSvc.getMyApplyList({ selectCond: selectCond, selectInput: selectInput }).$promise.then(
                        function (data) {
                            var myApplyList = data;
                            $scope.myApplyList = myApplyList;
                            $scope.totalItems = Object.entries(myApplyList).length;
                            $scope.itemPerPage = constants.pageMessage.itemPerPage;
                            $scope.currentPage = constants.pageMessage.currentPage;
                            $scope.maxSize = constants.pageMessage.maxSize;
                            $scope.pageChanged = function () {
                                $scope.myApplyListByPage = [];
                                var startData = $scope.itemPerPage * ($scope.currentPage - 1);
                                var endData = $scope.itemPerPage * $scope.currentPage - 1;
                                if (endData > $scope.totalItems) {
                                    endData = $scope.totalItems - 1
                                }
                                var num = 0;
                                if ($scope.myApplyListByPage) {
                                    for (var i = startData; i <= endData; i++) {
                                        if ($scope.myApplyList[i] != undefined) {
                                            $scope.myApplyListByPage[num] = $scope.myApplyList[i];
                                            $scope.myApplyListByPage[num].requestdate = $scope.myApplyListByPage[num].requestdate.substring(0, 10);//时间字符串截取
                                        }
                                        num++;
                                    }
                                }
                            };
                            $scope.pageChanged();
                        },
                        function (err) {
                            if (err.data && err.data.message)
                                utilSvc.addAlert(err.data.message, "fail", true);
                            else
                                utilSvc.addAlert(JSON.stringify(err), "fail", true);
                        }
                    )
                }

                // 修改
                $scope.editDetailTitleCheckBox = function(data,processtypecode){
                    if(processtypecode == 'TRE'){
                        window.location.href = '#/travelRequest?processID='+data;
                    }else if(processtypecode == 'TEX'){
                        window.location.href = '#/travelExpense?processID='+data;
                    }
                }

                // 查看
                $scope.selectDetailTitleCheckBox = function(data,processtypecode){
                    if(processtypecode == 'TRE'){
                        var select = 'select';
                        window.location.href = '#/travelRequest?processID='+data+'&&select='+select;
                    }else if(processtypecode == 'TEX'){
                        var select = 'select';
                        window.location.href = '#/travelExpense?processID='+data+'&&select='+select;
                    }
                }

                // 删除
                $scope.removeDetailTitleCheckBox = function(data,processtypecode){
                    var del = confirm("确定要删除吗？")
                    if (del == true) {
                        apiSvc.deleteTravelRequestData({ id: data,processtypecode:processtypecode });
                        alert("删除成功!");
                        window.location.reload();
                    }
                    
                }
            }])

}());
