/*jm - Controllers.js - Yadong Zhu 2018*/
(function() {
    'use strict';
    /* Controllers */
    angular.module('jm.controllers')
    .controller('yearSaleReportCtrl',['$scope','$routeParams','$location', 'report','jmService','utilSvc','constants',
        function($scope,$routeParams,$location,report,apiSvc,utilSvc,constants){
          
          
          $scope.temp={};
          $scope.reportByPage={};
          var categories = ["productType"];
            apiSvc.getListByCategories({categories:categories})
            .$promise.then(function(data){
                if (data){
                    $scope.productTypeList=data[0];
                } else {
                    utilSvc.addAlert("The Operation failed!", "fail", true);
                }
            },
            function(err){
                utilSvc.addAlert("The operation failed!", "fail", true);
            })
          if (report){
            $scope.report=report;
            $scope.Total =  $scope.report.yearTotal;
            $scope.itemPerPage = constants.pageMessage.itemPerPage;
            $scope.currentPage = constants.pageMessage.currentPage;
            $scope.maxSize = constants.pageMessage.maxSize;
            $scope.pageChanged=function(){
              $scope.reportByPage.SFE_ImplantData=[];
              var startData = $scope.itemPerPage * ($scope.currentPage-1);
              var endData = $scope.itemPerPage * $scope.currentPage-1;
              $scope.totalItems = $scope.report.SFE_ImplantData.length;
              if(endData>$scope.report.SFE_ImplantData.length){
                  endData = $scope.report.SFE_ImplantData.length-1
              }
              var num = 0;
              if($scope.report.SFE_ImplantData){
                  for(var i = startData;i<=endData;i++){
                      if($scope.report.SFE_ImplantData[i]!=undefined){
                          $scope.reportByPage.SFE_ImplantData[num]=$scope.report.SFE_ImplantData[i];
                      }
                      num++;
                  }
              }
              $scope.yearSel = report.selectDate;
              $scope.productType = report.selectProductType;
          };
          $scope.pageChanged();
          } else {
             $scope.report = report;
          }
          $scope.submitForm = function() {
            //add leading 0 to the scanned order no 
            var productType = $scope.productType;
            var date = $scope.yearSel;
            if(productType==undefined||productType=="") productType = '支架系统';
            let resDate = "";
            if(date==undefined||date==""){
              var toMonth = new Date();
              resDate = toMonth.getFullYear() + '年' ;
            }else if((typeof date)=='object'){
               resDate = date.getFullYear() + '年' ;
            }else{
              resDate = date;
            }
            $location.path("/yearSaleReport/"+resDate+"/"+productType);
        }
        function p(s){
          return s < 10 ? '0' + s : s;
        };
    }])
 }());
