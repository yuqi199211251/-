/*jm - Controllers.js - Yadong Zhu 2018*/
(function() {
    'use strict';
    /* Controllers */
    angular.module('jm.controllers')
    .controller('addEditComplaintRequestCtrl', ['$scope','$rootScope',"$location",'complaintRequest','jmService','utilSvc','constants',
    	 function($scope,$rootScope,$location,complaintRequest,apiSvc,utilSvc,constants){
            //$scope.complaintRequest={};
            $scope.type=complaintRequest?"Edit":"Add";
            
            
            //var categories = new Array();
            //var categories = ["doctor","hospital","electronicCertificate","productTypeSerial"];
            var categories = ["hospital","productTypeSerial"];
            apiSvc.getListByCategories({categories:categories})
            .$promise.then(function(data){
                if (data){
                    $scope.productTypeList=data[1];
                    //$scope.doctorList=data[0];
                    $scope.hospitalList=data[0];
                    //$scope.electronicCertificateList=data[2];
                } else {
                    utilSvc.addAlert("The Operation failed!", "fail", true);
                }
            },
            function(err){
                utilSvc.addAlert("The operation failed!", "fail", true);
            })
            

            $scope.uniqueValidation=function(){
                if($scope.complaintRequest.productNumber != undefined && $scope.complaintRequest.productNumber != ""){
                    apiSvc.validationProductNumber({productNumber:$scope.complaintRequest.productNumber,feedbackNumber:$scope.complaintRequest.feedbackNumber})
                    .$promise.then(function(product){
                        if (product.error == true){
                            utilSvc.addAlert("此序列号产品已存在换货信息或者序列号不存在，请核对后再填写!", "fail", true);
                        } else {
                            $scope.complaintRequest.productName = product.Fname
                            $scope.complaintRequest.productModel = product.FModel
                            $scope.complaintRequest.batchNumber = product.FBatchNo
                            $scope.complaintRequest.expiryDate = product.FYxqz.substring(0,10)
                        }
                    },
                    function(err){
                        utilSvc.addAlert("The operation failed!", "fail", true);
                    })
                }
            }
            $scope.getHospitalMessage=function(){
                if($scope.complaintRequest.hospitalId != ""){
                    apiSvc.getHospitalMessage({hospitalId:$scope.complaintRequest.hospitalId})
                    .$promise.then(function(data){
                        $scope.complaintRequest.hospitalLevel = data.hospitalMessage.FYyDj
                        $scope.complaintRequest.distributorName = data.hospitalMessage.FFxsName
                        $scope.complaintRequest.FFXSPlaId = data.hospitalMessage.FFXSPlaId
                        $scope.complaintRequest.FFXSPlaName = data.hospitalMessage.FFXSPlaName
                        //$scope.complaintRequest.hospitalId = data.FCustID
                        $scope.complaintRequest.distributorId = data.hospitalMessage.FFxsID
                        $scope.doctorList=data.doctorList;
                        $scope.electronicCertificateList=data.certificateList;

                    },
                    function(err){
                        utilSvc.addAlert("The operation failed!", "fail", true);
                    })
                }
            }

            $scope.return=function(){
                $location.path("/complaintRequest");
            }


            $scope.printImplantFeedback = function(complaintRequest){
                $location.path("/printImplantFeedback/"+complaintRequest.fid);
            }

            $scope.printReplacementRequest=function(complaintRequest){
                $location.path("/printReplacementRequest/"+complaintRequest.fid);
            }

            $scope.copyImplantFeedback=function(){
                $scope.complaintRequest.feedbackNumber="";
                $scope.complaintRequest.fid = null;
                $scope.complaintRequest.documentDate = utilSvc.dateToString(new Date());
                $scope.complaintRequest.isSaveAndSubmit = true;
                $scope.complaintRequest.electronicCertificate = "";
            }

            $scope.addComplaintRequest=function(){
                if($scope.complaintRequest.hospitalId == -1){
                    utilSvc.addAlert("请正确选择医院!", "fail", true);
                    return;
                }
                if($scope.complaintRequest.ProductTypeId == 0){
                    utilSvc.addAlert("请正确选择产品类别!", "fail", true);
                    return;
                }
                if($scope.complaintRequest.productNumber != undefined && $scope.complaintRequest.productNumber != ""){
                    apiSvc.validationProductNumber({productNumber:$scope.complaintRequest.productNumber,feedbackNumber:$scope.complaintRequest.feedbackNumber})
                    .$promise.then(function(product){
                        if (product.error == true){
                            utilSvc.addAlert("此序列号产品已存在换货信息或者序列号不存在，请核对后再填写!", "fail", true);
                        } else {
                            $scope.complaintRequest.productName = product.Fname
                            $scope.complaintRequest.productModel = product.FModel
                            $scope.complaintRequest.batchNumber = product.FBatchNo
                            $scope.complaintRequest.expiryDate = product.FYxqz.substring(0,10)
                            $scope.complaintRequest.surgeryDate = utilSvc.dateToString($scope.complaintRequest.surgeryDate);
                            apiSvc.addComplaintRequest({complaintRequest:$scope.complaintRequest})
                            .$promise.then(function(data){
                                if (data){
                                    if(data.error == true){
                                        utilSvc.addAlert("The Operation failed!", "fail", true);
                                    } else {
                                        complaintRequest = data;
                                        $scope.reset();
                                        utilSvc.addAlert("保存成功!", "success", true);
                                    }
                                } else {
                                    utilSvc.addAlert("The Operation failed!", "fail", true);
                                }
                            },
                            function(err){
                                utilSvc.addAlert("The operation failed!", "fail", true);
                            })
                        }
                    },
                    function(err){
                        utilSvc.addAlert("The operation failed!", "fail", true);
                    })
                } else {
                    utilSvc.addAlert("产品序列号信息不能为空!", "fail", true);
                }
            } 

            $scope.commitComplaintRequest=function(){
                //$scope.uniqueValidation();
                var prohibitSubmitMsg = "";
                if($scope.complaintRequest.feedbackNumber==""){
                    prohibitSubmitMsg += "必须输入反馈编号！";
                    prohibitSubmitMsg += "\n";
                }

                if(!($scope.complaintRequest.embeddedSecurity||$scope.complaintRequest.stentsFallOff||$scope.complaintRequest.cardGodet||$scope.complaintRequest.unpackFindProblem||$scope.complaintRequest.otherQuality) || ($scope.complaintRequest.otherQuality && $scope.complaintRequest.otherQualityProblems=="")){
                    prohibitSubmitMsg += "必须输入反馈摘要信息！";
                    prohibitSubmitMsg += "\n";
                }
                debugger;
                if($scope.complaintRequest.hospitalName == "选择医院名称"||$scope.complaintRequest.hospitalLevel == ""||$scope.complaintRequest.surgeon == "null"||$scope.complaintRequest.surgeon == "选择手术医生"||$scope.complaintRequest.workingExperience == ""||$scope.complaintRequest.doctorPhone == ""||$scope.complaintRequest.surgeryDate == ""){
                    prohibitSubmitMsg += "必须完整输入院方信息！";
                    prohibitSubmitMsg += "\n";
                }
                if($scope.complaintRequest.distributorName == ""||$scope.complaintRequest.distributorPhone == ""||$scope.complaintRequest.salesman == ""||$scope.complaintRequest.email == ""){
                    prohibitSubmitMsg += "必须完整输入分销商信息！";
                    prohibitSubmitMsg += "\n";
                }
                if($scope.complaintRequest.PatientAge == ""||$scope.complaintRequest.diagnosis == ""||$scope.complaintRequest.diseasedRegion == ""){
                    prohibitSubmitMsg += "必须完整输入病人基本信息！";
                    prohibitSubmitMsg += "\n";
                }
                /* if($scope.complaintRequest.ProductTypeName == constants.productType.bracketry||$scope.complaintRequest.ProductTypeName == constants.productType.bracketrySecond){
                    if($scope.complaintRequest.productNumber == ""||$scope.complaintRequest.productName == ""||$scope.complaintRequest.productModel == ""||$scope.complaintRequest.batchNumber == ""||$scope.complaintRequest.expiryDate == ""){
                        prohibitSubmitMsg += "必须完整输入产品信息！";
                        prohibitSubmitMsg += "\n";
                    }
                } else {
                    if($scope.complaintRequest.productName == ""||$scope.complaintRequest.productModel == ""||$scope.complaintRequest.batchNumber == ""||$scope.complaintRequest.expiryDate == ""){
                        prohibitSubmitMsg += "必须完整输入产品信息！";
                        prohibitSubmitMsg += "\n";
                    }
                } */
                if($scope.complaintRequest.productNumber == ""||$scope.complaintRequest.productName == ""||$scope.complaintRequest.productModel == ""||$scope.complaintRequest.batchNumber == ""||$scope.complaintRequest.expiryDate == ""){
                    prohibitSubmitMsg += "必须完整输入产品信息！";
                    prohibitSubmitMsg += "\n";
                }
                if($scope.complaintRequest.isTechnologyAssessment == "是" && !$scope.complaintRequest.packaging && !$scope.complaintRequest.balloonCatheter && !$scope.complaintRequest.SupportHead && !$scope.complaintRequest.leadWire &&  $scope.complaintRequest.OtherEvaluationContentsDetails==""){
                    prohibitSubmitMsg += "必须完整输入产品信息！";
                    prohibitSubmitMsg += "\n";
                }
                /* if(!($scope.complaintRequest.packaging || $scope.complaintRequest.balloonCatheter||$scope.complaintRequest.SupportHead||$scope.complaintRequest.leadWire) &&  $scope.complaintRequest.OtherEvaluationContentsDetails==""){
                    prohibitSubmitMsg += "必须完整输入产品信息！";
                    prohibitSubmitMsg += "\n";
                } */

                if(($scope.complaintRequest.patientComplication == "是" && $scope.complaintRequest.complicationDetail == "") || ($scope.complaintRequest.selectedSite == "是" && $scope.complaintRequest.isSurgery == "") || ($scope.complaintRequest.incidentDescription == "")){
                    prohibitSubmitMsg += "必须完整输入事件描述信息！";
                    prohibitSubmitMsg += "\n";
                }

                if($scope.complaintRequest.isIntoBody == "是" && $scope.complaintRequest.isPressure == "是" && $scope.complaintRequest.diseasedRegionDetails == ""){
                    prohibitSubmitMsg += "必须完整输入综合信息！";
                    prohibitSubmitMsg += "\n";
                } else if ($scope.complaintRequest.gtbasotc == "" ||$scope.complaintRequest.basogw == "" ||$scope.complaintRequest.brandSpecificationBalloonCatheter == "" ||$scope.complaintRequest.dealAbsentLesion == ""){
                    prohibitSubmitMsg += "必须完整输入综合信息！";
                    prohibitSubmitMsg += "\n";
                }
                
                if(prohibitSubmitMsg!= ""){
                    utilSvc.addAlert(prohibitSubmitMsg, "fail", true);
                } else {
                    apiSvc.commitComplaintRequest({complaintRequest:$scope.complaintRequest}).$promise.then(function(data){
                        if (data){
                            complaintRequest = data;
                            $scope.reset();
                            utilSvc.addAlert("提交成功!", "success", true);
                        } else {
                            utilSvc.addAlert("The Operation failed!", "fail", true);
                        }
                    },
                    function(err){
                        utilSvc.addAlert("The operation failed!", "fail", true);
                    })
                }
            } 

            $scope.reset=function(){
                $scope.complaintRequest={};
                if(complaintRequest){
                    angular.copy(complaintRequest,$scope.complaintRequest);
                    if(complaintRequest.Fhhzt!=40060){
                        $scope.complaintRequest.isSaveAndSubmit = false;
                    } else {
                        $scope.complaintRequest.isSaveAndSubmit = true;
                    }
                    $scope.getHospitalMessage();
                } else {
                    $scope.complaintRequest.isSaveAndSubmit = true;
                    var nowDate = new Date();
                    var nowMonth = (nowDate.getMonth()+1)>10?(nowDate.getMonth()+1): '0'+(nowDate.getMonth()+1)
                    var nowDay = nowDate.getDate()>10?nowDate.getDate(): '0'+nowDate.getDate()
                    var nowDateString = nowDate.getFullYear()+"-"+nowMonth+"-"+nowDay;
                    $scope.complaintRequest.fid='';
                    $scope.complaintRequest.FUserID='';
                    $scope.complaintRequest.ProductTypeName='';
                    $scope.complaintRequest.ProductTypeId=0;
                    $scope.complaintRequest.FFXSPlaId=0;
                    $scope.complaintRequest.FFXSPlaName = '';
                    $scope.complaintRequest.dealAbsentLesion='';
                    $scope.complaintRequest.embeddedSecurity='false';
                    $scope.complaintRequest.unpackFindProblem='false';
                    $scope.complaintRequest.documentDate=nowDateString;
                    $scope.complaintRequest.stentsFallOff='false';
                    $scope.complaintRequest.cardGodet='false';
                    $scope.complaintRequest.otherQuality='false';
                    $scope.complaintRequest.otherQualityProblems='';
                    $scope.complaintRequest.electronicCertificate='';
                    $scope.complaintRequest.distributorName='';
                    $scope.complaintRequest.hospitalName='';
                    $scope.complaintRequest.hospitalLevel='';
                    $scope.complaintRequest.distributorPhone='';
                    $scope.complaintRequest.surgeon='';
                    $scope.complaintRequest.workingExperience='';
                    $scope.complaintRequest.salesman='';
                    $scope.complaintRequest.doctorPhone='';
                    $scope.complaintRequest.surgeryDate='';
                    $scope.complaintRequest.PatientSex='';
                    $scope.complaintRequest.PatientAge=0;
                    $scope.complaintRequest.isIntoBody='';
                    $scope.complaintRequest.problemTime='';
                    $scope.complaintRequest.diagnosis='';
                    $scope.complaintRequest.isPressure='';
                    $scope.complaintRequest.diseasedRegion='';
                    $scope.complaintRequest.diseasedRegionDetails='';
                    $scope.complaintRequest.isPreExpansion='';
                    $scope.complaintRequest.isRatedPressure='';
                    $scope.complaintRequest.productNumber='';
                    $scope.complaintRequest.productName='';
                    $scope.complaintRequest.isCalcification='';
                    $scope.complaintRequest.isCurved='';
                    $scope.complaintRequest.productModel='';
                    $scope.complaintRequest.batchNumber='';
                    $scope.complaintRequest.expiryDate='';
                    $scope.complaintRequest.isToDisinfect='';
                    $scope.complaintRequest.isTechnologyAssessment='';
                    $scope.complaintRequest.gtbasotc='';
                    $scope.complaintRequest.packaging='false';
                    $scope.complaintRequest.balloonCatheter='false';
                    $scope.complaintRequest.SupportHead='false';
                    $scope.complaintRequest.leadWire='false';
                    $scope.complaintRequest.OtherEvaluationContents='false';
                    $scope.complaintRequest.OtherEvaluationContentsDetails='';
                    $scope.complaintRequest.basogw='';
                    $scope.complaintRequest.isCd='';
                    $scope.complaintRequest.brandSpecificationBalloonCatheter='';
                    $scope.complaintRequest.otherNote='';
                    $scope.complaintRequest.clinicalOutcome='';
                    $scope.complaintRequest.patientInjury='';
                    $scope.complaintRequest.patientComplication='';
                    $scope.complaintRequest.complicationDetail='';
                    $scope.complaintRequest.selectedSite='';
                    $scope.complaintRequest.isSurgery='';
                    $scope.complaintRequest.doctorSuggests='false';
                    
                    $scope.complaintRequest.incidentDescription='';
                    $scope.complaintRequest.hospitalId=-1;
                    $scope.complaintRequest.email='';
                }
            }
            $scope.reset();

    }])
 }());
