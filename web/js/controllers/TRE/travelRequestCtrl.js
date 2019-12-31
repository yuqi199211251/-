/*jm - Controllers.js - yuqi 2019*/
// 总计自动求和
function sumDetailTitle() {
    var zs = parseFloat($("#zs").val());
    var cccb = parseFloat($("#cccb").val());
    var jcwf = parseFloat($("#jcwf").val());
    var fjp = parseFloat($("#fjp").val());
    var ccdsnjt = parseFloat($("#ccdsnjt").val());
    var hcqclc = parseFloat($("#hcqclc").val());
    var qt = parseFloat($("#qt").val());
    var fyxj = ifundefined(zs) + ifundefined(cccb) + ifundefined(jcwf) + ifundefined(fjp) + ifundefined(ccdsnjt) + ifundefined(hcqclc) + ifundefined(qt);
    $("#fyxj").val((fyxj));
}

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
        .controller('travelRequestCtrl', ['$scope', '$rootScope', '$location', '$modal', 'utilSvc', 'jmService', 'constants',
            function ($scope, $rootScope, $location, $modal, utilSvc, apiSvc, constants) {
                
                // 部门
                apiSvc.selectDepartment().$promise.then(
                    function (data) {
                        for (var i = 0; i < data.length; i++) {
                            // alert(data[i].DepartmentCode);
                            //先创建好select里面的option元素
                            var option = document.createElement("option");
                            //给option的text赋值,这就是你点开下拉框能够看到的东西
                            $(option).text(data[i].department);
                            var DepartmentCode = data[i].department;
                            // if (DepartmentCode < 10) {
                            //     DepartmentCode = '00' + DepartmentCode;
                            // } else if (DepartmentCode < 100) {
                            //     DepartmentCode = '0' + DepartmentCode;
                            // }
                            $(option).val(DepartmentCode.trim());
                            //获取select 下拉框对象,并将option添加进select
                            $('#departmentId').append(option);
                        }
                    },
                    function (err) {
                        if (err.data && err.data.message)
                            utilSvc.addAlert(err.data.message, "fail", true);
                        else
                            utilSvc.addAlert(JSON.stringify(err), "fail", true);
                    }
                )
                //获取申请号
                apiSvc.GetNewRequestNo({ processTypeCode: 'TRE' }).$promise.then(
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



                // 申请人
               
                $scope.choosePer = function () {
                    var personSle = $("#personSle").val();
                    apiSvc.selectPerByPerName({ personSle: personSle }).$promise.then(
                        function (data) {
                            var personList = data;
                            $scope.personList = personList;
                            $scope.totalItems = Object.entries(personList).length;
                            $scope.itemPerPage = constants.pageMessage.itemPerPage;
                            $scope.currentPage = constants.pageMessage.currentPage;
                            $scope.maxSize = constants.pageMessage.maxSize;
                            $scope.pageChanged = function () {
                                $scope.personListByPage = [];
                                var startData = $scope.itemPerPage * ($scope.currentPage - 1);
                                var endData = $scope.itemPerPage * $scope.currentPage - 1;
                                if (endData > $scope.totalItems) {
                                    endData = $scope.totalItems - 1
                                }
                                var num = 0;
                                if ($scope.personListByPage) {
                                    for (var i = startData; i <= endData; i++) {
                                        if ($scope.personList[i] != undefined) {
                                            $scope.personListByPage[num] = $scope.personList[i];
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
                $scope.choosePer();

                $scope.selectApplyPeople = function () {
                    var applyPeople = document.getElementsByName("applyPeopleSlec");
                    var check_val = [];
                    for (var k in applyPeople) {
                        if (applyPeople[k].checked)
                            check_val.push(applyPeople[k].value);
                    }
                    $scope.applyPeople = check_val;
                    $scope.displayName = check_val;
                    $('#applyPeople').modal('hide');
                }

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
                $scope.chooseProjectNum();

                $scope.selectProjectNum = function () {
                    var projectNumSlec = document.getElementsByName("projectNumSlec");
                    var check_val = [];
                    for (var k in projectNumSlec) {
                        if (projectNumSlec[k].checked)
                            check_val.push(projectNumSlec[k].value);
                    }
                    $scope.projectNumSlec = check_val;
                    $('#projectNum').modal('hide');
                }



                // 成本中心
                $scope.chooseCostCenter = function () {
                    var costCenterNum = $("#costCenterNum").val();
                    apiSvc.selectCostCenter({ costCenterNum: costCenterNum }).$promise.then(
                        function (data) {
                            var costCenterNum_ = data;
                            $scope.costCenterNum_ = costCenterNum_;
                            $scope.totalItems = Object.entries(costCenterNum_).length;
                            $scope.itemPerPage = constants.pageMessage.itemPerPage;
                            $scope.currentPage = constants.pageMessage.currentPage;
                            $scope.maxSize = constants.pageMessage.maxSize;
                            $scope.pageChangedcostCenterNum = function () {
                                $scope.costCenterNum_ByPage = [];
                                var startData = $scope.itemPerPage * ($scope.currentPage - 1);
                                var endData = $scope.itemPerPage * $scope.currentPage - 1;
                                if (endData > $scope.totalItems) {
                                    endData = $scope.totalItems - 1
                                }
                                var num = 0;
                                if ($scope.costCenterNum_ByPage) {
                                    for (var i = startData; i <= endData; i++) {
                                        if ($scope.costCenterNum_[i] != undefined) {
                                            $scope.costCenterNum_ByPage[num] = $scope.costCenterNum_[i];
                                        }
                                        num++;
                                    }
                                }
                            };
                            $scope.pageChangedcostCenterNum();
                        },
                        function (err) {
                            if (err.data && err.data.message)
                                utilSvc.addAlert(err.data.message, "fail", true);
                            else
                                utilSvc.addAlert(JSON.stringify(err), "fail", true);
                        }
                    )

                }
                $scope.chooseCostCenter();

                $scope.selectcostCenterNum_ = function () {
                    var costCenterNum_Slec = document.getElementsByName("costCenterNum_Slec");
                    var check_val = [];
                    for (var k in costCenterNum_Slec) {
                        if (costCenterNum_Slec[k].checked)
                            check_val.push(costCenterNum_Slec[k].value);
                    }
                    $scope.costCenterSlec = check_val;
                    $('#costCenter').modal('hide');
                }

                $scope.detailList = [];//table列表 成员变量
                var num = 0;//集合的角标
                // Detail Title
                $scope.saveDetailTitle = function () {

                    var detailArrayList = new Array();//临时数组
                    detailArrayList.cfd = $scope.cfd;
                    detailArrayList.mdd = $scope.mdd;
                    detailArrayList.beginDateDetail = exchangeTime($scope.beginDateDetail);
                    detailArrayList.endDateDetail = exchangeTime($scope.endDateDetail);
                    detailArrayList.fjp = $scope.fjp;
                    detailArrayList.jcwf = $scope.jcwf;
                    detailArrayList.zs = $scope.zs;
                    detailArrayList.hcqclc = $scope.hcqclc;
                    detailArrayList.cccb = $scope.cccb;
                    detailArrayList.ccdsnjt = $scope.ccdsnjt;
                    detailArrayList.qt = $scope.qt;
                    detailArrayList.fyxj = $("#fyxj").val();
                    detailArrayList.bz = $scope.bz;
                    detailArrayList.id = $scope.tableId;
                    if ($("#idstr").val() == '') {//如果为空就是新增，else为修改，根据角标修改集合
                        $scope.detailList[num] = detailArrayList
                        num++;
                    } else {

                        $scope.detailList[$("#idstr").val()] = detailArrayList
                    }
                    $scope.detailList = $scope.detailList;
                    //初始化总计
                    $scope.fjpTotal = 0;
                    $scope.jcwfTotal = 0;
                    $scope.zsTotal = 0;
                    $scope.hcqclcTotal = 0;
                    $scope.cccbTotal = 0;
                    $scope.ccdsnjtTotal = 0;
                    $scope.qtTotal = 0;
                    $scope.fyxjTotal = 0;

                    //遍历动态改变总计的数值
                    for (var i = 0; i < $scope.detailList.length; i++) {
                        if ($scope.detailList[i] != undefined) {
                            $scope.fjpTotal += parseFloat(ifundefined($scope.detailList[i].fjp));
                            $scope.jcwfTotal += parseFloat(ifundefined($scope.detailList[i].jcwf));
                            $scope.zsTotal += parseFloat(ifundefined($scope.detailList[i].zs));
                            $scope.hcqclcTotal += parseFloat(ifundefined($scope.detailList[i].hcqclc));
                            $scope.cccbTotal += parseFloat(ifundefined($scope.detailList[i].cccb));
                            $scope.ccdsnjtTotal += parseFloat(ifundefined($scope.detailList[i].ccdsnjt));
                            $scope.qtTotal += parseFloat(ifundefined($scope.detailList[i].qt));
                            $scope.fyxjTotal += parseFloat(ifundefined($scope.detailList[i].fyxj));
                        }
                    }
                    $scope.totalAmount = $scope.fyxjTotal
                    //隐藏模态框
                    $scope.idStr = '';
                    $('#detailtitle').modal('hide');
                }

                $scope.updateDetailTitle = function (detailL, idx) {
                    //idx是集合的角标
                    //打开模态框后赋值
                    $scope.cfd = detailL.cfd;
                    $scope.mdd = detailL.mdd;
                    $scope.beginDateDetail = detailL.beginDateDetail;
                    $scope.endDateDetail = detailL.endDateDetail;
                    $scope.zs = detailL.zs;
                    $scope.jcwf = detailL.jcwf;
                    $scope.fjp = detailL.fjp;
                    $scope.ccdsnjt = detailL.ccdsnjt;
                    $scope.qt = detailL.qt;
                    $scope.fyxj = detailL.fyxj;
                    $scope.bz = detailL.bz;
                    $scope.idStr = idx;
                    $scope.hcqclc = detailL.hcqclc;
                    $scope.cccb = detailL.cccb;
                    $scope.tableId = detailL.id;
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
                    $scope.fjpTotal = 0;
                    $scope.jcwfTotal = 0;
                    $scope.zsTotal = 0;
                    $scope.hcqclcTotal = 0;
                    $scope.cccbTotal = 0;
                    $scope.ccdsnjtTotal = 0;
                    $scope.qtTotal = 0;
                    $scope.fyxjTotal = 0;
                    //遍历动态改变总计的数值
                    for (var i = 0; i < $scope.detailList.length; i++) {
                        if ($scope.detailList[i] != undefined) {
                            $scope.fjpTotal += parseFloat(ifundefined($scope.detailList[i].fjp));
                            $scope.jcwfTotal += parseFloat(ifundefined($scope.detailList[i].jcwf));
                            $scope.zsTotal += parseFloat(ifundefined($scope.detailList[i].zs));
                            $scope.hcqclcTotal += parseFloat(ifundefined($scope.detailList[i].hcqclc));
                            $scope.cccbTotal += parseFloat(ifundefined($scope.detailList[i].cccb));
                            $scope.ccdsnjtTotal += parseFloat(ifundefined($scope.detailList[i].ccdsnjt));
                            $scope.qtTotal += parseFloat(ifundefined($scope.detailList[i].qt));
                            $scope.fyxjTotal += parseFloat(ifundefined($scope.detailList[i].fyxj));
                        }
                    }
                    $scope.totalAmount = $scope.fyxjTotal
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
                    $scope.fjpTotal = 0;
                    $scope.jcwfTotal = 0;
                    $scope.zsTotal = 0;
                    $scope.hcqclcTotal = 0;
                    $scope.cccbTotal = 0;
                    $scope.ccdsnjtTotal = 0;
                    $scope.qtTotal = 0;
                    $scope.fyxjTotal = 0;
                    //遍历动态改变总计的数值
                    for (var i = 0; i < $scope.detailList.length; i++) {
                        if ($scope.detailList[i] != undefined) {
                            $scope.fjpTotal += parseFloat(ifundefined($scope.detailList[i].fjp));
                            $scope.jcwfTotal += parseFloat(ifundefined($scope.detailList[i].jcwf));
                            $scope.zsTotal += parseFloat(ifundefined($scope.detailList[i].zs));
                            $scope.hcqclcTotal += parseFloat(ifundefined($scope.detailList[i].hcqclc));
                            $scope.cccbTotal += parseFloat(ifundefined($scope.detailList[i].cccb));
                            $scope.ccdsnjtTotal += parseFloat(ifundefined($scope.detailList[i].ccdsnjt));
                            $scope.qtTotal += parseFloat(ifundefined($scope.detailList[i].qt));
                            $scope.fyxjTotal += parseFloat(ifundefined($scope.detailList[i].fyxj));
                        }
                    }
                }


                $scope.uploadOnclick = function () {
                    $("input[type='file']").change(function () {
                        var str = $(this).val();
                        var arr = str.split('\\');//注split可以用字符或字符串分割
                        var my = arr[arr.length - 1];//这就是要取得的图片名称
                        $(this).parent().text(my);
                    });
                }


                $scope.saveAllTravelRequest = function (updateProcessID) {
                    var cnProcess = {};//cnProcess表数据
                    cnProcess.requestNum = $scope.requestNum;//folio
                    cnProcess.procesCode = 'TRE';
                    cnProcess.description = '差旅申请';
                    cnProcess.creator = $scope.applyPeople;//正确的应该是登录该系统的用户名，我这暂时先用做申请的人员
                    cnProcess.statusID = 1;
                    cnProcess.processTypeCode = 'TRE';
                    var CN_TravelRequestHeader = {};//CN_TravelRequestHeader表数据
                    CN_TravelRequestHeader.costCenter = $scope.costCenterSlec;
                    CN_TravelRequestHeader.companyCode = '6200';
                    CN_TravelRequestHeader.currencyCode = 'RMB';
                    CN_TravelRequestHeader.projectCode = undefinedToNull($scope.projectNumSlec);
                    CN_TravelRequestHeader.requestDate = $scope.yearSel;
                    CN_TravelRequestHeader.submitedBy = $scope.applyPeople;
                    CN_TravelRequestHeader.requestedBy = $scope.applyPeople;
                    CN_TravelRequestHeader.travelStartDate = $scope.beginDate;
                    CN_TravelRequestHeader.travelEndDate = $scope.endDate;
                    CN_TravelRequestHeader.internalRemarks = $scope.internalRemarks;
                    // processID需要等待cn_process新增后获取新增ID
                    CN_TravelRequestHeader.processID = '';
                    CN_TravelRequestHeader.totalAmount = $scope.totalAmount;
                    CN_TravelRequestHeader.requestName = $scope.displayName;
                    CN_TravelRequestHeader.travelPurpose = $("#travelPurpose").val();
                    CN_TravelRequestHeader.status = 1;
                    CN_TravelRequestHeader.submitName = $scope.displayName;
                    CN_TravelRequestHeader.requestNo = $scope.requestNum;
                    CN_TravelRequestHeader.versionNo = 1;
                    CN_TravelRequestHeader.totalAmountUSD = $scope.totalAmount;
                    CN_TravelRequestHeader.departmentCode = $("#departmentId").val();
                    CN_TravelRequestHeader.jobTitle = 'EMP';
                    CN_TravelRequestHeader.processTypeCode = 'TRE';
                    var CN_TravelRequestDetail = {};//CN_TravelRequestDetail表数据
                    for (var i = 0; i < $scope.detailList.length; i++) {
                        var tempDetail = {};
                        tempDetail.beginDateDetail = $scope.detailList[i].beginDateDetail;//起始日期
                        tempDetail.endDateDetail = $scope.detailList[i].endDateDetail;//截止日期
                        tempDetail.fjp = undefinedToNull($scope.detailList[i].fjp);//飞机票
                        tempDetail.zs = undefinedToNull($scope.detailList[i].zs);//住宿
                        tempDetail.cccb = undefinedToNull($scope.detailList[i].cccb);//出差餐补
                        tempDetail.qt = undefinedToNull($scope.detailList[i].qt);//其他
                        tempDetail.bz = $scope.detailList[i].bz;//备注
                        tempDetail.cfd = $scope.detailList[i].cfd;//出发地
                        tempDetail.mdd = $scope.detailList[i].mdd;//目的地
                        tempDetail.hcqclc = undefinedToNull($scope.detailList[i].hcqclc);//火车/汽车/轮船
                        tempDetail.jcwf = undefinedToNull($scope.detailList[i].jcwf);//机场往返
                        tempDetail.ccdsnjt = undefinedToNull($scope.detailList[i].ccdsnjt);//出差地市内交通
                        tempDetail.fyxj = undefinedToNull($scope.detailList[i].fyxj);//费用小计
                        tempDetail.id = $scope.detailList[i].id;
                        if (tempDetail.id == 0 || tempDetail.id == undefined) tempDetail.id = 0;//table id
                        CN_TravelRequestDetail[i] = tempDetail;
                    }
                    var CN_TravelRequestDetailLength = Object.keys(CN_TravelRequestDetail).length;//计算object长度

                    var CN_Attachment = {};//CN_Attachment表数据
                    CN_Attachment.fileUrl = '';
                    CN_Attachment.description = '';
                    // processID需要等待cn_process新增后获取新增ID
                    CN_Attachment.processID = '';
                    if (updateProcessID == undefined) updateProcessID = 0;
                    apiSvc.saveAllTravelRequest({ updateProcessID: updateProcessID, cnProcess: cnProcess, CN_TravelRequestHeader: CN_TravelRequestHeader, CN_TravelRequestDetail: CN_TravelRequestDetail, CN_TravelRequestDetailLength: CN_TravelRequestDetailLength, CN_Attachment: CN_Attachment }).$promise.then(
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
                                    }else{//The step is update file
                                        var fileurl = $scope.fileList[i].fileurl;
                                        apiSvc.saveFileTravelRequest({ updateProcessID: updateProcessID, base64Str: '', fileName: fileName, processID: processID, description: description, id: id ,fileurl:fileurl});
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
                    // 根据地址栏processID获取差旅申请头部信息
                    apiSvc.selectHeaderInfoByProcessID({ processID: processID }).$promise.then(
                        function (data) {
                            $scope.list = data[0];
                            $scope.requestNum = $scope.list.Folio;
                            $scope.yearSel = $scope.list.RequestDate;
                            $scope.applyPeople = $scope.list.SubmitedBy;
                            $scope.projectNumSlec = ($scope.list.ProjectCode=='null'?'':$scope.list.ProjectCode);
                            $("#departmentId").find("option:contains('" + $scope.list.DepartmentCode + "')").attr("selected", true);
                            $scope.travelPurpose = $scope.list.TravelPurpose;
                            $scope.costCenterSlec = $scope.list.CostCenter;
                            $scope.totalAmount = $scope.list.TotalAmountUSD;
                            $scope.beginDate = $scope.list.TravelStartDate;
                            $scope.endDate = $scope.list.TravelEndDate;
                            $scope.internalRemarks = $scope.list.InternalRemarks;
                        },
                        function (err) {
                            if (err.data && err.data.message)
                                utilSvc.addAlert(err.data.message, "fail", true);
                            else
                                utilSvc.addAlert(JSON.stringify(err), "fail", true);
                        }
                    )

                    // 根据地址栏processID获取差差旅申请明细 
                    apiSvc.selectDetailInfoByProcessID({ processID: processID }).$promise.then(
                        function (data) {
                            $scope.list = data;
                            $scope.detailList = [];
                            for (var i = 0; i < data.length; i++) {
                                var detailArrayList = new Array();//临时数组
                                detailArrayList.beginDateDetail = $scope.list[i].DateFrom.substring(0, 10);
                                detailArrayList.endDateDetail = $scope.list[i].DateUpto.substring(0, 10);
                                detailArrayList.fjp = $scope.list[i].EstCostFlight;
                                detailArrayList.zs = $scope.list[i].EstCostAccomdation;
                                detailArrayList.cccb = $scope.list[i].EstCostFood;
                                detailArrayList.qt = $scope.list[i].EstCostOthers;
                                detailArrayList.bz = $scope.list[i].Remarks;
                                detailArrayList.cfd = $scope.list[i].TravelFrom;
                                detailArrayList.mdd = $scope.list[i].TravelTo;
                                detailArrayList.hcqclc = $scope.list[i].EstCostTransport;
                                detailArrayList.jcwf = $scope.list[i].EstCostAirportRoundTrip;
                                detailArrayList.ccdsnjt = $scope.list[i].EstCostUrbanTransport;
                                detailArrayList.fyxj = $scope.list[i].EstCostTotal;
                                detailArrayList.id = $scope.list[i].ID;
                                if ($("#idstr").val() == '') {//如果为空就是新增，else为修改，根据角标修改集合
                                    $scope.detailList[i] = detailArrayList
                                } else {
                                    $scope.detailList[$("#idstr").val()] = detailArrayList
                                }
                                $scope.detailList = $scope.detailList;
                            }

                            //初始化总计
                            $scope.fjpTotal = 0;
                            $scope.jcwfTotal = 0;
                            $scope.zsTotal = 0;
                            $scope.hcqclcTotal = 0;
                            $scope.cccbTotal = 0;
                            $scope.ccdsnjtTotal = 0;
                            $scope.qtTotal = 0;
                            $scope.fyxjTotal = 0;

                            //遍历动态改变总计的数值
                            for (var i = 0; i < $scope.detailList.length; i++) {
                                if ($scope.detailList[i] != undefined) {
                                    $scope.fjpTotal += parseFloat(ifundefined($scope.detailList[i].fjp));
                                    $scope.jcwfTotal += parseFloat(ifundefined($scope.detailList[i].jcwf));
                                    $scope.zsTotal += parseFloat(ifundefined($scope.detailList[i].zs));
                                    $scope.hcqclcTotal += parseFloat(ifundefined($scope.detailList[i].hcqclc));
                                    $scope.cccbTotal += parseFloat(ifundefined($scope.detailList[i].cccb));
                                    $scope.ccdsnjtTotal += parseFloat(ifundefined($scope.detailList[i].ccdsnjt));
                                    $scope.qtTotal += parseFloat(ifundefined($scope.detailList[i].qt));
                                    $scope.fyxjTotal += parseFloat(ifundefined($scope.detailList[i].fyxj));
                                }
                            }
                            $scope.totalAmount = $scope.fyxjTotal
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
                $('body').on('hidden.bs.modal', '.modal', function () {
                    document.getElementById("emptyForm").reset();
                });

                // 返回
                $scope.backAllTravelRequest = function(){
                    window.location.href = '#/myApply';
                }
            }])

}());

