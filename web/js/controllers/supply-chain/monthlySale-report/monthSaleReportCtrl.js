/*jm - Controllers.js - Yadong Zhu 2018*/
(function() {
    'use strict';
    /* Controllers */
    angular.module('jm.controllers')
    .controller('monthSaleReportCtrl',['$scope','$routeParams','$location', 'report','jmService','utilSvc','constants',
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
            //审核人和时间
            if( $scope.report.people==null||$scope.report.people==""||$scope.report.people==undefined){
              $scope.tFname = "";
              $scope.FCheckTime1 = "";
              $scope.t_Fname = "";
              $scope.FCheckTime2 = "";
            }else{
              $scope.tFname = $scope.report.people[0].tFname;//客服
              if($scope.report.people[0].FCheckTime1!=null){
                  $scope.FCheckTime1 = $scope.report.people[0].FCheckTime1.replace('T',' ').substring(0,19);
              }else{
                  $scope.FCheckTime1 = '';
              }
              $scope.t_Fname = $scope.report.people[0].t_Fname;//销售
              if($scope.report.people[0].FCheckTime2!=null){
                 $scope.FCheckTime2 = $scope.report.people[0].FCheckTime2.replace('T',' ').substring(0,19);
              } else{
                  $scope.FCheckTime2 = '';
              }
             
            }


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
               resDate = toMonth.getFullYear() + '年' + p((toMonth.getMonth() + 1)) + '月' ;
            }else if((typeof date)=='object'){
               resDate = date.getFullYear() + '年' + p((date.getMonth() + 1)) + '月' ;
            }else{
              resDate = date;
            }
            $location.path("/monthSaleReport/"+resDate+"/"+productType);
        }
        function p(s){
          return s < 10 ? '0' + s : s;
        };
        function parserDate (date) {  
          var t = Date.parse(date);  
          if (!isNaN(t)) {  
              return new Date(Date.parse(date.replace(/-/g, "/")));  
          } else {  
              return new Date();  
          }  
        }
     
    }])
 }());
