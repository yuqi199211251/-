/*jm - Controllers.js - Yadong Zhu 2018*/
(function() {
    'use strict';
    /* Controllers */
    angular.module('jm.controllers')
    .controller('printReplacementRequestCtrl', ['$scope',"$location",'implantFeedback','jmService','utilSvc','constants',
    	 function($scope,$location,implantFeedback,apiSvc,utilSvc,constants){
            
            
            $scope.implantFeedback = implantFeedback;


            $scope.return=function(){
                $location.path("/addEditComplaintRequest/"+implantFeedback.fid);
            }
            $scope.print = function(){
                if (document.getElementById('imgStyle') != null){
                    document.getElementById('imgStyle').style.marginTop = '11%';
                    document.getElementById('imgStyle').style.marginLeft = '10%';
                    window.print();
                    document.getElementById('imgStyle').style.marginTop = '5%';
                    document.getElementById('imgStyle').style.marginLeft = '6%';
                }else {
                    window.print();
                }
            }
    }])
 }());
