/*jm - Controllers.js - yuqi 2019*/

// NAN判断转换
function ifundefined(obj) {
    if (obj == undefined || isNaN(obj) || obj == 'undefined' || obj == '') {
        return 0;
    } else {
        return obj;
    }
}

// 时间转换
function checkTime(i) {
    if (i < 10) {
        i = '0' + i
    }
    return i
}

function exchangeTime(time) {
    var date;
    date = new Date(time)
    var dateTime = date.getFullYear() + '-' + checkTime(date.getMonth() + 1) + '-' + checkTime(date.getDate());
    return dateTime;
}

// 左边input框鼠标离开后右边input框自动填充
function rightInputClick(before, after) {
    $("#" + after).val($("#" + before).val());
}
// 是否隐藏
function isNotDisabled(trueOrFalse, inputID) {
    if (trueOrFalse == 'yes') {
        $("#" + inputID).val('');
        $("#" + inputID).attr("readonly", true);
    } else if (trueOrFalse == 'no') {
        $("#" + inputID).attr("readonly", false);
    }

}

//获取地址栏参数
function getUrlSearch(name) {
    // 未传参，返回空
    if (!name) return null;
    // 查询参数：先通过search取值，如果取不到就通过hash来取
    var after = window.location.search;
    after = after.substr(1) || window.location.hash.split('?')[1];
    // 地址栏URL没有查询参数，返回空
    if (!after) return null;
    // 如果查询参数中没有"name"，返回空
    if (after.indexOf(name) === -1) return null;

    var reg = new RegExp('(^|&)' + name + '=([^&]*)(&|$)');
    // 当地址栏参数存在中文时，需要解码，不然会乱码
    var r = decodeURI(after).match(reg);
    // 如果url中"name"没有值，返回空
    if (!r) return null;
    return r[2];
}

(function () {

    'use strict';

    /* Controllers */
    angular.module('jm.controllers')
        .controller('travelExpenseCtrl', ['$scope', '$rootScope', '$location', '$modal', 'utilSvc', 'jmService', 'constants',
            function ($scope, $rootScope, $location, $modal, utilSvc, apiSvc, constants) {
                // 汇率
                $scope.huilv = '1.0000';
                //currency币种
                $scope.selectCurrencyList = function () {
                    var bibie = $("#bibie").val();
                    apiSvc.getCurrencyList({ bibie: bibie }).$promise.then(
                        function (data) {
                            var currencyList = data;
                            $scope.currencyList = currencyList;
                            $scope.totalItems = Object.entries(currencyList).length;
                            $scope.itemPerPage = constants.pageMessage.itemPerPage;
                            $scope.currentPage = constants.pageMessage.currentPage;
                            $scope.maxSize = constants.pageMessage.maxSize;
                            $scope.pageChanged = function () {
                                $scope.currencyListByPage = [];
                                var startData = $scope.itemPerPage * ($scope.currentPage - 1);
                                var endData = $scope.itemPerPage * $scope.currentPage - 1;
                                if (endData > $scope.totalItems) {
                                    endData = $scope.totalItems - 1
                                }
                                var num = 0;
                                if ($scope.currencyListByPage) {
                                    for (var i = startData; i <= endData; i++) {
                                        if ($scope.currencyList[i] != undefined) {
                                            $scope.currencyListByPage[num] = $scope.currencyList[i];
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

                $scope.selectBibie = function () {
                    var currencySlec = document.getElementsByName("currencySlec");
                    var check_val = [];
                    for (var k in currencySlec) {
                        if (currencySlec[k].checked) {
                            check_val.push(currencySlec[k].value);
                        }
                    }
                    $scope.currency = check_val[0];
                    $('#currency').modal('hide');
                }
                //获取报销号
                apiSvc.GetNewRequestNo({ processTypeCode: 'TEX' }).$promise.then(
                    function (data) {
                        var NewRequestNo = data[0].NewRequestNo;
                        $scope.requestNum = NewRequestNo;
                    },
                    function (err) {
                        if (err.data && err.data.message)
                            utilSvc.addAlert(err.data.message, "fail", true);
                        else
                            utilSvc.addAlert(JSON.stringify(err), "fail", true);
                    }
                )

                //差旅申请号查询
                $scope.selectTraReqNoList = function () {
                    var selectCond = $("#selectCond").val();
                    var selectInput = $("#selectInput").val();
                    apiSvc.getTraReqNoList({ selectCond: selectCond, selectInput: selectInput }).$promise.then(
                        function (data) {
                            var traReqNoList = data;
                            $scope.traReqNoList = traReqNoList;
                            $scope.totalItems = Object.entries(traReqNoList).length;
                            $scope.itemPerPage = constants.pageMessage.itemPerPage;
                            $scope.currentPage = constants.pageMessage.currentPage;
                            $scope.maxSize = constants.pageMessage.maxSize;
                            $scope.pageChanged = function () {
                                $scope.traReqNoListByPage = [];
                                var startData = $scope.itemPerPage * ($scope.currentPage - 1);
                                var endData = $scope.itemPerPage * $scope.currentPage - 1;
                                if (endData > $scope.totalItems) {
                                    endData = $scope.totalItems - 1
                                }
                                var num = 0;
                                if ($scope.traReqNoListByPage) {
                                    for (var i = startData; i <= endData; i++) {
                                        if ($scope.traReqNoList[i] != undefined) {
                                            $scope.traReqNoListByPage[num] = $scope.traReqNoList[i];
                                            $scope.traReqNoListByPage[num].travelstartdate = $scope.traReqNoListByPage[num].travelstartdate.substring(0, 10);//时间字符串截取
                                            $scope.traReqNoListByPage[num].travelenddate = $scope.traReqNoListByPage[num].travelenddate.substring(0, 10);//时间字符串截取
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
                   

                    //差旅申请号checkbox确认
                    $scope.selectApplyPeople = function () {
                        var applyPeople = document.getElementsByName("applyPeopleSlec");
                        var check_val = [];
                        for (var k in applyPeople) {
                            if (applyPeople[k].checked)
                                check_val.push(applyPeople[k].value);
                        }
                        $scope.traReqNo = check_val;
                        $scope.submitPer = $("input[name='applyPeopleSlec']:checked").next().val();
                        $scope.applyPeople = $("input[name='applyPeopleSlec']:checked").next().val();

                        $scope.requestdate = $("input[name='applyPeopleSlec']:checked").next().next().val();
                        $scope.departmentcode = $("input[name='applyPeopleSlec']:checked").next().next().next().val();
                        $scope.projectcode = ($("input[name='applyPeopleSlec']:checked").next().next().next().next().val() == 'null'?'':$("input[name='applyPeopleSlec']:checked").next().next().next().next().val());
                        $scope.costcenter = $("input[name='applyPeopleSlec']:checked").next().next().next().next().next().val();
                        $scope.estcosttotal = $("input[name='applyPeopleSlec']:checked").next().next().next().next().next().next().val();
                        $scope.travelRequestID = $("input[name='applyPeopleSlec']:checked").next().next().next().next().next().next().next().val();
                        $('#texRequestNoSelect').modal('hide');
                    }

                }

                $scope.selectTraReqNoList();

                //费用类型
                $scope.selectExpenseTypeList = function () {
                    var expenseType = $("#expenseTypeData").val();
                    apiSvc.selectExpenseTypeList({ expenseType: expenseType }).$promise.then(
                        function (data) {
                            var expenseTypeList = data;
                            $scope.expenseTypeList = expenseTypeList;
                            $scope.totalItems = Object.entries(expenseTypeList).length;
                            $scope.itemPerPage = constants.pageMessage.itemPerPage;
                            $scope.currentPage = constants.pageMessage.currentPage;
                            $scope.maxSize = constants.pageMessage.maxSize;
                            $scope.pageChanged = function () {
                                $scope.expenseTypeListByPage = [];
                                var startData = $scope.itemPerPage * ($scope.currentPage - 1);
                                var endData = $scope.itemPerPage * $scope.currentPage - 1;
                                if (endData > $scope.totalItems) {
                                    endData = $scope.totalItems - 1
                                }
                                var num = 0;
                                if ($scope.expenseTypeListByPage) {
                                    for (var i = startData; i <= endData; i++) {
                                        if ($scope.expenseTypeList[i] != undefined) {
                                            $scope.expenseTypeListByPage[num] = $scope.expenseTypeList[i];
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

                $scope.selectexpenseTypeData = function () {
                    var expenseTypeSlec = document.getElementsByName("expenseTypeSlec");
                    var check_val = [];
                    for (var k in expenseTypeSlec) {
                        if (expenseTypeSlec[k].checked) {
                            check_val.push(expenseTypeSlec[k].value);
                        }
                    }
                    $scope.expenseTypeInput = check_val[0];
                    $('#expenseType').modal('hide');
                }

                $scope.selectExpenseTypeList();

                //税率
                $scope.selectCnTaxTypeList = function () {
                    var expenseTypeDataInput = $("#expenseTypeDataInput").val();
                    apiSvc.selectCnTaxTypeList({ expenseTypeDataInput: expenseTypeDataInput }).$promise.then(
                        function (data) {
                            var cnTaxList = data;
                            $scope.cnTaxList = cnTaxList;
                            $scope.totalItems = Object.entries(cnTaxList).length;
                            $scope.itemPerPage = constants.pageMessage.itemPerPage;
                            $scope.currentPage = constants.pageMessage.currentPage;
                            $scope.maxSize = constants.pageMessage.maxSize;
                            $scope.pageChanged = function () {
                                $scope.cnTaxListByPage = [];
                                var startData = $scope.itemPerPage * ($scope.currentPage - 1);
                                var endData = $scope.itemPerPage * $scope.currentPage - 1;
                                if (endData > $scope.totalItems) {
                                    endData = $scope.totalItems - 1
                                }
                                var num = 0;
                                if ($scope.cnTaxListByPage) {
                                    for (var i = startData; i <= endData; i++) {
                                        if ($scope.cnTaxList[i] != undefined) {
                                            $scope.cnTaxListByPage[num] = $scope.cnTaxList[i];
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

                $scope.selectCnTaxData = function () {
                    var cnTaxSlec = document.getElementsByName("cnTaxSlec");
                    var check_val = [];
                    for (var k in cnTaxSlec) {
                        if (cnTaxSlec[k].checked) {
                            check_val.push(cnTaxSlec[k].value);
                        }
                    }
                    $scope.cnTaxInput = check_val[0];
                    $('#cnTax').modal('hide');
                }

                $scope.selectCnTaxTypeList();

                //currency币别 detail
                $scope.selectCurrencyDetailList = function () {
                    var bibie = $("#bibieDetail").val();
                    apiSvc.getCurrencyList({ bibie: bibie }).$promise.then(
                        function (data) {
                            var currencyDetailList = data;
                            $scope.currencyDetailList = currencyDetailList;
                            $scope.totalItems = Object.entries(currencyDetailList).length;
                            $scope.itemPerPage = constants.pageMessage.itemPerPage;
                            $scope.currentPage = constants.pageMessage.currentPage;
                            $scope.maxSize = constants.pageMessage.maxSize;
                            $scope.pageChanged = function () {
                                $scope.currencyDetailListByPage = [];
                                var startData = $scope.itemPerPage * ($scope.currentPage - 1);
                                var endData = $scope.itemPerPage * $scope.currentPage - 1;
                                if (endData > $scope.totalItems) {
                                    endData = $scope.totalItems - 1
                                }
                                var num = 0;
                                if ($scope.currencyDetailListByPage) {
                                    for (var i = startData; i <= endData; i++) {
                                        if ($scope.currencyDetailList[i] != undefined) {
                                            $scope.currencyDetailListByPage[num] = $scope.currencyDetailList[i];
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

                $scope.selectBibieDetail = function () {
                    var currencyDetailSlec = document.getElementsByName("currencyDetailSlec");
                    var check_val = [];
                    for (var k in currencyDetailSlec) {
                        if (currencyDetailSlec[k].checked) {
                            check_val.push(currencyDetailSlec[k].value);
                        }
                    }
                    $scope.currencyTypeDetail = check_val[0];
                    $('#currencyDetail').modal('hide');
                }

                $scope.selectCurrencyDetailList();

                // 项目号
                $scope.chooseProjectNum = function () {
                    var proNum = $("#proNum").val();
                    apiSvc.selectProjectNum({ proNum: proNum }).$promise.then(
                        function (data) {
                            var projectNum = data;
                            $scope.projectNum = projectNum;
                            $scope.totalItems = Object.entries(projectNum).length;
                            $scope.itemPerPage = constants.pageMessage.itemPerPage;
                            $scope.currentPage = constants.pageMessage.currentPage;
                            $scope.maxSize = constants.pageMessage.maxSize;
                            $scope.pageChangedProNum = function () {
                                $scope.projectNumByPage = [];
                                var startData = $scope.itemPerPage * ($scope.currentPage - 1);
                                var endData = $scope.itemPerPage * $scope.currentPage - 1;
                                if (endData > $scope.totalItems) {
                                    endData = $scope.totalItems - 1
                                }
                                var num = 0;
                                if ($scope.projectNumByPage) {
                                    for (var i = startData; i <= endData; i++) {
                                        if ($scope.projectNum[i] != undefined) {
                                            $scope.projectNumByPage[num] = $scope.projectNum[i];
                                        }
                                        num++;
                                    }
                                }
                            };
                            $scope.pageChangedProNum();
                        },
                        function (err) {
                            if (err.data && err.data.message)
                                utilSvc.addAlert(err.data.message, "fail", true);
                            else
                                utilSvc.addAlert(JSON.stringify(err), "fail", true);
                        }
                    )
                }

                $scope.selectProjectNum = function () {
                    var projectNumSlec = document.getElementsByName("projectNumSlec");
                    var check_val = [];
                    for (var k in projectNumSlec) {
                        if (projectNumSlec[k].checked)
                            check_val.push(projectNumSlec[k].value);
                    }
                    $scope.xiangmuhao = check_val[0];
                    $('#projectNumDetail').modal('hide');
                }

                $scope.chooseProjectNum();

                $scope.detailList = [];//table列表 成员变量
                var num = 0;//集合的角标
                // Detail Title
                $scope.saveDetailTitle = function () {
                    var detailArrayList = new Array();//临时数组
                    detailArrayList.hanghao = $scope.hanghao;//行号
                    detailArrayList.didian = $scope.didian;//地点
                    detailArrayList.beginDate = exchangeTime($scope.beginDate);//开始时间
                    detailArrayList.endDate = exchangeTime($scope.endDate);//结束时间
                    detailArrayList.expenseTypeInput = $scope.expenseTypeInput;//费用类型
                    detailArrayList.fapiaoStyle = $scope.fapiaoStyle;//发票类型
                    detailArrayList.cnTaxInput = $scope.cnTaxInput;//税率
                    detailArrayList.currencyTypeDetail = $scope.currencyTypeDetail;//币别
                    detailArrayList.fapiaojine = $scope.fapiaojine;//发票金额
                    detailArrayList.fapiaojineCNY = $("#fapiaojineCNY").val();//发票金额CNY
                    detailArrayList.baoxiaojine = $scope.baoxiaojine;//报销金额
                    detailArrayList.baoxiaojineCNY = $("#baoxiaojineCNY").val();//报销金额CNY
                    detailArrayList.fapiaoPaper = $scope.fapiaoPaper;//发票张数
                    detailArrayList.huilv = $scope.huilv;//汇率
                    detailArrayList.xiangmuhao = $scope.xiangmuhao;//项目号
                    detailArrayList.dianzifapiaohao = $scope.dianzifapiaohao;//电子发票号
                    detailArrayList.beizhuDetail = $scope.beizhuDetail;//备注
                    detailArrayList.isNotDianzifapiao = $('input:radio:checked').val();//是否电子发票
                    if (detailArrayList.isNotDianzifapiao == 1) detailArrayList.isNotDianzifapiao = '是';
                    if (detailArrayList.isNotDianzifapiao == 0) detailArrayList.isNotDianzifapiao = '否';
                    detailArrayList.id = $scope.tableId;
                    if ($("#idstr").val() == '') {//如果为空就是新增，else为修改，根据角标修改集合
                        $scope.detailList[num] = detailArrayList
                        num++;
                    } else {

                        $scope.detailList[$("#idstr").val()] = detailArrayList
                    }
                    $scope.detailList = $scope.detailList;
                    //初始化总计
                    $scope.fpjeTotal = 0;//发票金额
                    $scope.bxjeTotal = 0;//报销金额
                    $scope.bxjeCNYTotal = 0;//报销金额CNY
                    $scope.fpjeCNYTotal = 0;//发票金额CNY
                    $scope.hql = 0;//火车/汽车/轮船
                    $scope.jcwf = 0;//机场往返	
                    $scope.fjp = 0;//飞机票
                    $scope.cb = 0;//餐补
                    $scope.snjt = 0;//市内交通
                    $scope.qt = 0;//其他
                    $scope.zs = 0;//住宿
                    //遍历动态改变总计的数值
                    for (var i = 0; i < $scope.detailList.length; i++) {
                        if ($scope.detailList[i] != undefined) {
                            $scope.fpjeTotal += parseFloat(ifundefined($scope.detailList[i].fapiaojine));
                            $scope.bxjeTotal += parseFloat(ifundefined($scope.detailList[i].baoxiaojine));
                            $scope.bxjeCNYTotal += parseFloat(ifundefined($scope.detailList[i].baoxiaojineCNY));
                            $scope.fpjeCNYTotal += parseFloat(ifundefined($scope.detailList[i].fapiaojineCNY));
                            if ($scope.detailList[i].expenseTypeInput.indexOf('火车/汽车/轮船') != -1) {
                                $scope.hql += parseFloat(ifundefined($scope.detailList[i].fapiaojine));
                            } else if ($scope.detailList[i].expenseTypeInput.indexOf('机场往返') != -1) {
                                $scope.jcwf += parseFloat(ifundefined($scope.detailList[i].fapiaojine));
                            } else if ($scope.detailList[i].expenseTypeInput.indexOf('飞机票') != -1) {
                                $scope.fjp += parseFloat(ifundefined($scope.detailList[i].fapiaojine));
                            } else if ($scope.detailList[i].expenseTypeInput.indexOf('餐补') != -1) {
                                $scope.cb += parseFloat(ifundefined($scope.detailList[i].fapiaojine));
                            } else if ($scope.detailList[i].expenseTypeInput.indexOf('市内交通') != -1) {
                                $scope.snjt += parseFloat(ifundefined($scope.detailList[i].fapiaojine));
                            } else if ($scope.detailList[i].expenseTypeInput.indexOf('其他') != -1) {
                                $scope.qt += parseFloat(ifundefined($scope.detailList[i].fapiaojine));
                            } else if ($scope.detailList[i].expenseTypeInput.indexOf('住宿') != -1) {
                                $scope.zs += parseFloat(ifundefined($scope.detailList[i].fapiaojine));
                            }
                        }
                    }
                    //隐藏模态框
                    $scope.idStr = '';
                    $('#detailtitle').modal('hide');
                }

                $scope.updateDetailTitle = function (detailL, idx) {
                    //idx是集合的角标
                    //打开模态框后赋值
                    $scope.hanghao = detailL.hanghao;
                    $scope.didian = detailL.didian;
                    $scope.beginDate = detailL.beginDate;
                    $scope.endDate = detailL.endDate;

                    $scope.endDate = detailL.endDate;
                    $scope.expenseTypeInput = detailL.expenseTypeInput;
                    $scope.fapiaoStyle = detailL.fapiaoStyle;
                    $scope.fapiaojine = detailL.fapiaojine;

                    $scope.currencyTypeDetail = detailL.currencyTypeDetail;
                    $scope.cnTaxInput = detailL.cnTaxInput;
                    $scope.baoxiaojine = detailL.baoxiaojine;
                    $scope.baoxiaojineCNY = detailL.baoxiaojineCNY;

                    $scope.huilv = detailL.huilv;
                    $scope.fapiaojineCNY = detailL.fapiaojineCNY;
                    $scope.fapiaoPaper = detailL.fapiaoPaper;
                    $scope.isNotDianzifapiao = detailL.isNotDianzifapiao;

                    $scope.dianzifapiaohao = detailL.dianzifapiaohao;
                    $scope.xiangmuhao = detailL.xiangmuhao;
                    $scope.beizhuDetail = detailL.beizhuDetail;

                    $scope.tableId = detailL.id;
                    $scope.idStr = idx;

                    $("#detailtitle").modal("show");

                }

                $scope.removeDetailTitleCheckBox = function (idx) {
                    $("input[id='" + idx + "'][name='detailCheckBox']").prop("checked", true);//把checkbox勾选上
                    var count = 0;//每次剪掉的个数,之所以定义是因为，每次使用splice方法去掉集合中的一条数据后，集合的角标自动往上补。例如：删除掉角标为1的一条数据后，角标为2的数据角标自动会变为1，
                    //所以每次删除的时候角标按照规律减少，规律是:第一次减0，第二次减1，点三次减2，第四次减3，以此类推
                    $("input[id='" + idx + "'][name='detailCheckBox']").each(function (i) {
                        $scope.detailList.splice($(this).val() - count, 1);
                        $(this).parent().parent().remove();
                        num--;
                        count++;
                    });
                    //初始化总计
                    $scope.fpjeTotal = 0;//发票金额
                    $scope.bxjeTotal = 0;//报销金额
                    $scope.bxjeCNYTotal = 0;//报销金额CNY
                    $scope.fpjeCNYTotal = 0;//发票金额CNY
                    $scope.hql = 0;//火车/汽车/轮船
                    $scope.jcwf = 0;//机场往返	
                    $scope.fjp = 0;//飞机票
                    $scope.cb = 0;//餐补
                    $scope.snjt = 0;//市内交通
                    $scope.qt = 0;//其他
                    $scope.zs = 0;//住宿
                    //遍历动态改变总计的数值
                    for (var i = 0; i < $scope.detailList.length; i++) {
                        if ($scope.detailList[i] != undefined) {
                            $scope.fpjeTotal += parseFloat(ifundefined($scope.detailList[i].fapiaojine));
                            $scope.bxjeTotal += parseFloat(ifundefined($scope.detailList[i].baoxiaojine));
                            $scope.bxjeCNYTotal += parseFloat(ifundefined($scope.detailList[i].baoxiaojineCNY));
                            $scope.fpjeCNYTotal += parseFloat(ifundefined($scope.detailList[i].fapiaojineCNY));
                            if ($scope.detailList[i].expenseTypeInput.indexOf('火车/汽车/轮船') != -1) {
                                $scope.hql += parseFloat(ifundefined($scope.detailList[i].fapiaojine));
                            } else if ($scope.detailList[i].expenseTypeInput.indexOf('机场往返') != -1) {
                                $scope.jcwf += parseFloat(ifundefined($scope.detailList[i].fapiaojine));
                            } else if ($scope.detailList[i].expenseTypeInput.indexOf('飞机票') != -1) {
                                $scope.fjp += parseFloat(ifundefined($scope.detailList[i].fapiaojine));
                            } else if ($scope.detailList[i].expenseTypeInput.indexOf('餐补') != -1) {
                                $scope.cb += parseFloat(ifundefined($scope.detailList[i].fapiaojine));
                            } else if ($scope.detailList[i].expenseTypeInput.indexOf('市内交通') != -1) {
                                $scope.snjt += parseFloat(ifundefined($scope.detailList[i].fapiaojine));
                            } else if ($scope.detailList[i].expenseTypeInput.indexOf('其他') != -1) {
                                $scope.qt += parseFloat(ifundefined($scope.detailList[i].fapiaojine));
                            } else if ($scope.detailList[i].expenseTypeInput.indexOf('住宿') != -1) {
                                $scope.zs += parseFloat(ifundefined($scope.detailList[i].fapiaojine));
                            }
                        }
                    }
                }

                $scope.flushDetailTitleCheckBox = function () {
                    $("input[name='detailCheckBox']").prop("checked", true);//把checkbox全部勾选上
                    var count = 0;//每次剪掉的个数,之所以定义是因为，每次使用splice方法去掉集合中的一条数据后，集合的角标自动往上补。例如：删除掉角标为1的一条数据后，角标为2的数据角标自动会变为1，
                    //所以每次删除的时候角标按照规律减少，规律是:第一次减0，第二次减1，点三次减2，第四次减3，以此类推
                    $('input:checkbox:checked').each(function (i) {
                        $scope.detailList.splice($(this).val() - count, 1);
                        $(this).parent().parent().remove();
                        num--;
                        count++;
                    });
                    //初始化总计
                    $scope.fpjeTotal = 0;//发票金额
                    $scope.bxjeTotal = 0;//报销金额
                    $scope.bxjeCNYTotal = 0;//报销金额CNY
                    $scope.fpjeCNYTotal = 0;//发票金额CNY
                    $scope.hql = 0;//火车/汽车/轮船
                    $scope.jcwf = 0;//机场往返	
                    $scope.fjp = 0;//飞机票
                    $scope.cb = 0;//餐补
                    $scope.snjt = 0;//市内交通
                    $scope.qt = 0;//其他
                    $scope.zs = 0;//住宿
                    //遍历动态改变总计的数值
                    for (var i = 0; i < $scope.detailList.length; i++) {
                        if ($scope.detailList[i] != undefined) {
                            $scope.fpjeTotal += parseFloat(ifundefined($scope.detailList[i].fapiaojine));
                            $scope.bxjeTotal += parseFloat(ifundefined($scope.detailList[i].baoxiaojine));
                            $scope.bxjeCNYTotal += parseFloat(ifundefined($scope.detailList[i].baoxiaojineCNY));
                            $scope.fpjeCNYTotal += parseFloat(ifundefined($scope.detailList[i].fapiaojineCNY));
                            if ($scope.detailList[i].expenseTypeInput.indexOf('火车/汽车/轮船') != -1) {
                                $scope.hql += parseFloat(ifundefined($scope.detailList[i].fapiaojine));
                            } else if ($scope.detailList[i].expenseTypeInput.indexOf('机场往返') != -1) {
                                $scope.jcwf += parseFloat(ifundefined($scope.detailList[i].fapiaojine));
                            } else if ($scope.detailList[i].expenseTypeInput.indexOf('飞机票') != -1) {
                                $scope.fjp += parseFloat(ifundefined($scope.detailList[i].fapiaojine));
                            } else if ($scope.detailList[i].expenseTypeInput.indexOf('餐补') != -1) {
                                $scope.cb += parseFloat(ifundefined($scope.detailList[i].fapiaojine));
                            } else if ($scope.detailList[i].expenseTypeInput.indexOf('市内交通') != -1) {
                                $scope.snjt += parseFloat(ifundefined($scope.detailList[i].fapiaojine));
                            } else if ($scope.detailList[i].expenseTypeInput.indexOf('其他') != -1) {
                                $scope.qt += parseFloat(ifundefined($scope.detailList[i].fapiaojine));
                            } else if ($scope.detailList[i].expenseTypeInput.indexOf('住宿') != -1) {
                                $scope.zs += parseFloat(ifundefined($scope.detailList[i].fapiaojine));
                            }
                        }
                    }
                }

                //附件
                $scope.fileList = [];
                var fileNum = 0;
                $scope.addFileModal = function () {
                    var fileArray = new Array();
                    fileArray.array = 'TRE';
                    $scope.fileList[fileNum] = fileArray;
                    fileNum++;
                }

                $scope.removeFile = function (idx) {
                    $("input[id='" + idx + "'][name='fileCheckBox']").prop("checked", true);//把checkbox勾选上
                    var count = 0;//每次剪掉的个数,之所以定义是因为，每次使用splice方法去掉集合中的一条数据后，集合的角标自动往上补。例如：删除掉角标为1的一条数据后，角标为2的数据角标自动会变为1，
                    //所以每次删除的时候角标按照规律减少，规律是:第一次减0，第二次减1，点三次减2，第四次减3，以此类推
                    $('input:checkbox:checked').each(function (i) {
                        $scope.fileList.splice($(this).val() - count, 1);
                        fileNum--;
                        count++;
                    });
                }

                $scope.saveAllTravelRequest = function (updateProcessID) {
                    var cnProcess = {};//cnProcess表数据
                    cnProcess.requestNum = $scope.requestNum;//folio
                    cnProcess.procesCode = 'TEX';
                    cnProcess.description = '差旅报销';
                    cnProcess.creator = $scope.applyPeople;//正确的应该是登录该系统的用户名，我这暂时先用做申请的人员
                    cnProcess.statusID = 1;
                    cnProcess.processTypeCode = 'TEX';

                    var CN_ClaimHeader = {};//CN_ClaimHeader表数据
                    CN_ClaimHeader.submitedBy = $scope.submitPer;//提交人
                    CN_ClaimHeader.requestBy = $scope.applyPeople;//申请人
                    CN_ClaimHeader.submitDate = $scope.requestdate;//提交时间
                    CN_ClaimHeader.costCenter = $scope.costcenter;//成本中心
                    CN_ClaimHeader.companyCode = '6200';//公司编码
                    CN_ClaimHeader.paymentCurrency = $scope.currency;//币别
                    CN_ClaimHeader.requestName = $scope.applyPeople;//申请人中文名字
                    CN_ClaimHeader.processTypeCode = 'TEX';
                    CN_ClaimHeader.statusID = 14;
                    // <!--processID通过cnProcess表获取-->
                    CN_ClaimHeader.travelRequestID = $scope.travelRequestID;//差旅申请的ID
                    CN_ClaimHeader.remarks = $scope.travelExpenseMark;//备注
                    CN_ClaimHeader.requestNo = $scope.requestNum;//差旅报销申请号
                    CN_ClaimHeader.versionNo = 1;//版本号

                    var CN_ClaimDetail = {};//CN_ClaimDetail表数据
                    for (var i = 0; i < $scope.detailList.length; i++) {
                        var tempDetail = {};
                        tempDetail.rcptRef = $scope.detailList[i].hanghao;//序号
                        tempDetail.travelFrom = $scope.detailList[i].didian;//地点
                        tempDetail.dateFrom = $scope.detailList[i].beginDate;//开始时间
                        tempDetail.dateTo = $scope.detailList[i].endDate;//结束时间
                        tempDetail.expenseTypeCode = $scope.detailList[i].expenseTypeInput;//费用类型

                        tempDetail.invoiceType = $scope.detailList[i].fapiaoStyle;//发票类型
                        tempDetail.amount = undefinedToNull($scope.detailList[i].fapiaojine);//发票金额
                        tempDetail.currency = undefinedToNull($scope.detailList[i].currencyTypeDetail);//币别
                        tempDetail.taxCode = undefinedToNull($scope.detailList[i].cnTaxInput);//税率
                        tempDetail.appliedAmt = $scope.detailList[i].baoxiaojine;//报销金额

                        tempDetail.appliedCNY = $scope.detailList[i].baoxiaojineCNY;//报销金额CNY
                        tempDetail.xRate = '1.00000';//汇率
                        tempDetail.amountCNY = undefinedToNull($scope.detailList[i].fapiaojineCNY);//发票金额CNY
                        tempDetail.invoiceQty = undefinedToNull($scope.detailList[i].fapiaoPaper);//发票张数
                        tempDetail.IsElectroniclInovice = undefinedToNull($scope.detailList[i].isNotDianzifapiao);//是否电子发票
                        if (tempDetail.IsElectroniclInovice == '是') tempDetail.IsElectroniclInovice = 1;
                        if (tempDetail.IsElectroniclInovice == '否') tempDetail.IsElectroniclInovice = 0;

                        tempDetail.ElectronicInvoice = undefinedToNull($scope.detailList[i].dianzifapiaohao);//电子发票
                        tempDetail.projectCode = undefinedToNull($scope.detailList[i].xiangmuhao);//项目号
                        tempDetail.remarks = undefinedToNull($scope.detailList[i].beizhuDetail);//备注
                        tempDetail.amountBalance = '0.00';//差额

                        tempDetail.id = $scope.detailList[i].id;
                        // <!--processID通过cnProcess表获取-->
                        /*这里面的数据数据库里是需要存的，但是我做的这个页面觉得没有必要存储，无论怎么都是自动计算出来的，客户可以看到效果
                        tempDetail.costAccomdation = $scope.zs;//住宿统计
                        tempDetail.costTransport = undefinedToNull($scope.hql);//火车/汽车/轮船
                        tempDetail.costAirportRoundTrip = undefinedToNull($scope.jcwf);//机场往返
                        tempDetail.costFlight = undefinedToNull($scope.fjp);//飞机票
                        tempDetail.costFood = undefinedToNull($scope.cb);//餐补
                        tempDetail.costUrbanTransport = undefinedToNull($scope.snjt);//市内交通
                        tempDetail.costOthers = undefinedToNull($scope.qt);//其他
                        */

                        if (tempDetail.id == 0 || tempDetail.id == undefined) tempDetail.id = 0;//table id
                        CN_ClaimDetail[i] = tempDetail;
                    }
                    var CN_ClaimDetailLength = Object.keys(CN_ClaimDetail).length;//计算object长度

                    var CN_Attachment = {};//CN_Attachment表数据
                    CN_Attachment.fileUrl = '';
                    CN_Attachment.description = '';
                    // processID需要等待cn_process新增后获取新增ID
                    CN_Attachment.processID = '';
                    if (updateProcessID == undefined) updateProcessID = 0;
                    apiSvc.saveAllTravelExpense({ updateProcessID: updateProcessID, cnProcess: cnProcess, CN_ClaimHeader: CN_ClaimHeader, CN_ClaimDetail: CN_ClaimDetail, CN_ClaimDetailLength: CN_ClaimDetailLength, CN_Attachment: CN_Attachment }).$promise.then(
                        function (data) {
                            var processID = data[0].processID;
                            for (let i = 0; i < $scope.fileList.length; i++) {
                                (function (i) {
                                    var id = $scope.fileList[i].id;//table id
                                    if (id == 0 || id == undefined) id = 0;
                                    var description = document.getElementById('description' + i).value;
                                    var file = document.getElementById('fileUpload' + i).files[0];//获取file
                                    var fileName = $scope.fileList[i].fileName;
                                    if (file != undefined) {//The step is create file
                                        fileName = file.name;
                                        let reader = new FileReader();//读取file文件内容方法初始化
                                        reader.readAsDataURL(file);//读取file，readAsDataURL是读取为base64，可以直接放在img标签src后显示的图片
                                        reader.onload = function () {//加载数据，后台处理数据
                                            var base64Str = this.result.substring(this.result.indexOf('base64,') + 7, this.result.length);//截取后只保留base64编码，前缀不要
                                            apiSvc.saveFileTravelRequest({ updateProcessID: updateProcessID, base64Str: base64Str, fileName: fileName, processID: processID, description: description, id: id });
                                        }
                                    } else {//The step is update file
                                        var fileurl = $scope.fileList[i].fileurl;
                                        apiSvc.saveFileTravelRequest({ updateProcessID: updateProcessID, base64Str: '', fileName: fileName, processID: processID, description: description, id: id, fileurl: fileurl });
                                    }

                                })(i);
                            }
                            if (updateProcessID != 0) {
                                alert("修改成功!");
                            } else {
                                alert("添加成功!");
                            }
                            window.location.href = '#/myApply';
                        },
                        function (err) {
                            if (err.data && err.data.message)
                                utilSvc.addAlert(err.data.message, "fail", true);
                            else
                                utilSvc.addAlert(JSON.stringify(err), "fail", true);
                        }
                    )
                }

                function undefinedToNull(obj) {
                    if (obj == undefined) {
                        return obj = null;
                    } else {
                        return obj;
                    }
                }

                $scope.fileList = [];
                var fileNum = 0;
                $scope.addFileModal = function () {
                    var fileArray = new Array();
                    fileArray.array = 'TEX';
                    $scope.fileList[fileNum] = fileArray;
                    fileNum++;
                }

                $scope.cancel = function () {
                    var r = confirm("确定放弃填写吗？")
                    if (r == true) {
                        window.history.go(-1);
                    }

                }

                var processID = getUrlSearch("processID");
                if (processID != undefined) $scope.updateProcessID = processID;

                var markSave = getUrlSearch("select");
                if (markSave != undefined) $scope.markSave = getUrlSearch("select");
                if (processID != null) {
                    // 根据地址栏processID获取差旅报销头部信息
                    apiSvc.selectTEXHeaderInfoByProcessID({ processID: processID }).$promise.then(
                        function (data) {
                            $scope.list = data[0];
                            $scope.requestNum = $scope.list.requestNoTEX;
                            $scope.currency = $scope.list.paymentCurrency == 'undefined'?'':$scope.list.paymentCurrency;
                            $scope.travelExpenseMark = $scope.list.remarks;

                            $scope.traReqNo = $scope.list.RequestNo;
                            $scope.submitPer = $scope.list.SubmitedBy;
                            $scope.applyPeople = $scope.list.RequestedBy;
                            $scope.requestdate = $scope.list.RequestDate;
                            $scope.departmentcode = $scope.list.DepartmentCode;
                            $scope.projectcode = $scope.list.ProjectCode == 'null'?'':$scope.list.ProjectCode;
                            $scope.costcenter = $scope.list.CostCenter;
                            $scope.estcosttotal = $scope.list.TotalAmount;
                            $scope.travelRequestID = $scope.list.headID;
                        },
                        function (err) {
                            if (err.data && err.data.message)
                                utilSvc.addAlert(err.data.message, "fail", true);
                            else
                                utilSvc.addAlert(JSON.stringify(err), "fail", true);
                        }
                    )


                    // 根据地址栏processID获取差差旅报销明细 
                    apiSvc.selectDetailTEXInfoByProcessID({ processID: processID }).$promise.then(
                        function (data) {
                            $scope.list = data;
                            $scope.detailList = [];
                            for (var i = 0; i < data.length; i++) {
                                var detailArrayList = new Array();//临时数组

                                detailArrayList.hanghao = $scope.list[i].RcptRef=='undefined'?'':$scope.list[i].RcptRef;//行号
                                detailArrayList.didian = $scope.list[i].TravelFrom;//地点
                                detailArrayList.beginDate = exchangeTime($scope.list[i].DateFrom);//开始时间
                                detailArrayList.endDate = exchangeTime($scope.list[i].DateTo);//结束时间
                                detailArrayList.expenseTypeInput = $scope.list[i].ExpenseTypeCode;//费用类型
                                detailArrayList.fapiaoStyle = $scope.list[i].InvoiceType=='undefined'?'':$scope.list[i].InvoiceType;//发票类型
                                detailArrayList.cnTaxInput = $scope.list[i].XRate;//税率
                                detailArrayList.currencyTypeDetail = $scope.list[i].Currency;//币别
                                detailArrayList.fapiaojine = $scope.list[i].Amount;//发票金额
                                detailArrayList.fapiaojineCNY = $scope.list[i].AmountCNY;//发票金额CNY
                                detailArrayList.baoxiaojine = $scope.list[i].AppliedAmt;//报销金额
                                detailArrayList.baoxiaojineCNY = $scope.list[i].AppliedCNY;//报销金额CNY
                                detailArrayList.fapiaoPaper = $scope.list[i].InvoiceQty;//发票张数
                                detailArrayList.huilv = $scope.list[i].TaxCode.indexOf('null')!=-1?'':$scope.list[i].TaxCode;//汇率
                                detailArrayList.xiangmuhao = $scope.list[i].ProjectCode=='null'?'':$scope.list[i].ProjectCode;//项目号
                                detailArrayList.dianzifapiaohao = $scope.list[i].ElectronicInvoice=='null'?'':$scope.list[i].ElectronicInvoice;//电子发票号
                                detailArrayList.beizhuDetail = $scope.list[i].Remarks;//备注
                                detailArrayList.isNotDianzifapiao = $scope.list[i].IsElectroniclInovice;//是否电子发票
                                if (detailArrayList.isNotDianzifapiao == 1) detailArrayList.isNotDianzifapiao = '是';
                                if (detailArrayList.isNotDianzifapiao == 0) detailArrayList.isNotDianzifapiao = '否';
                                // amountBalance是差额 一会再加
                                detailArrayList.id = $scope.list[i].ID;
                                if ($("#idstr").val() == '') {//如果为空就是新增，else为修改，根据角标修改集合
                                    $scope.detailList[num] = detailArrayList
                                    num++;
                                } else {

                                    $scope.detailList[$("#idstr").val()] = detailArrayList
                                }
                                $scope.detailList = $scope.detailList;
                            }

                            //初始化总计
                            $scope.fpjeTotal = 0;//发票金额
                            $scope.bxjeTotal = 0;//报销金额
                            $scope.bxjeCNYTotal = 0;//报销金额CNY
                            $scope.fpjeCNYTotal = 0;//发票金额CNY
                            $scope.hql = 0;//火车/汽车/轮船
                            $scope.jcwf = 0;//机场往返	
                            $scope.fjp = 0;//飞机票
                            $scope.cb = 0;//餐补
                            $scope.snjt = 0;//市内交通
                            $scope.qt = 0;//其他
                            $scope.zs = 0;//住宿
                            //遍历动态改变总计的数值
                            for (var i = 0; i < $scope.detailList.length; i++) {
                                if ($scope.detailList[i] != undefined) {
                                    $scope.fpjeTotal += parseFloat(ifundefined($scope.detailList[i].fapiaojine));
                                    $scope.bxjeTotal += parseFloat(ifundefined($scope.detailList[i].baoxiaojine));
                                    $scope.bxjeCNYTotal += parseFloat(ifundefined($scope.detailList[i].baoxiaojineCNY));
                                    $scope.fpjeCNYTotal += parseFloat(ifundefined($scope.detailList[i].fapiaojineCNY));
                                    if ($scope.detailList[i].expenseTypeInput.indexOf('火车/汽车/轮船') != -1) {
                                        $scope.hql += parseFloat(ifundefined($scope.detailList[i].fapiaojine));
                                    } else if ($scope.detailList[i].expenseTypeInput.indexOf('机场往返') != -1) {
                                        $scope.jcwf += parseFloat(ifundefined($scope.detailList[i].fapiaojine));
                                    } else if ($scope.detailList[i].expenseTypeInput.indexOf('飞机票') != -1) {
                                        $scope.fjp += parseFloat(ifundefined($scope.detailList[i].fapiaojine));
                                    } else if ($scope.detailList[i].expenseTypeInput.indexOf('餐补') != -1) {
                                        $scope.cb += parseFloat(ifundefined($scope.detailList[i].fapiaojine));
                                    } else if ($scope.detailList[i].expenseTypeInput.indexOf('市内交通') != -1) {
                                        $scope.snjt += parseFloat(ifundefined($scope.detailList[i].fapiaojine));
                                    } else if ($scope.detailList[i].expenseTypeInput.indexOf('其他') != -1) {
                                        $scope.qt += parseFloat(ifundefined($scope.detailList[i].fapiaojine));
                                    } else if ($scope.detailList[i].expenseTypeInput.indexOf('住宿') != -1) {
                                        $scope.zs += parseFloat(ifundefined($scope.detailList[i].fapiaojine));
                                    }
                                }
                            }
                        },
                        function (err) {
                            if (err.data && err.data.message)
                                utilSvc.addAlert(err.data.message, "fail", true);
                            else
                                utilSvc.addAlert(JSON.stringify(err), "fail", true);
                        }
                    )

                    // 根据地址栏processID获取差旅附件信息
                    apiSvc.selectFileInfoByProcessID({ processID: processID }).$promise.then(
                        function (data) {
                            $scope.list = data;
                            $scope.fileList = [];
                            for (var i = 0; i < $scope.list.length; i++) {
                                var detailArrayList = new Array();//临时数组
                                detailArrayList.fileName = $scope.list[i].fileName;
                                detailArrayList.Description = $scope.list[i].Description;
                                detailArrayList.fileurl = $scope.list[i].fileurl;
                                detailArrayList.id = $scope.list[i].id;
                                $scope.fileList[i] = detailArrayList
                                $scope.fileList = $scope.fileList;

                            }
                        },
                        function (err) {
                            if (err.data && err.data.message)
                                utilSvc.addAlert(err.data.message, "fail", true);
                            else
                                utilSvc.addAlert(JSON.stringify(err), "fail", true);
                        }
                    )
                }

                // 模态框关闭后清除输入框等信息
                $('#detailtitle').on('hidden.bs.modal', function (){
                    document.getElementById("emptyForm").reset();
                });

                // 返回
                $scope.backAllTravelRequest = function(){
                    window.location.href = '#/myApply';
                }
            }])

}());
