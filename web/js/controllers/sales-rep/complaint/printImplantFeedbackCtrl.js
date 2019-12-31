/*jm - Controllers.js - Yadong Zhu 2018*/
(function() {
    'use strict';
    /* Controllers */
    angular.module('jm.controllers')
    .controller('printImplantFeedbackCtrl', ['$scope',"$location",'implantFeedback','jmService','utilSvc','constants',
    	 function($scope,$location,implantFeedback,apiSvc,utilSvc,constants){
            
            //implantFeedback.fdzzsUrl = encodeURI(implantFeedback.fdzzsUrl);
            $scope.implantFeedback = implantFeedback;

            $scope.return=function(){
                $location.path("/addEditComplaintRequest/"+implantFeedback.fid);
            }
            $scope.print = function(){
                if (document.getElementById('imgStyle') != null){
                    document.getElementById('imgStyle').style.marginTop = '18%';
                    document.getElementById('imgStyle').style.marginLeft = '60%';
                    document.getElementsByTagName('body')[0].style.marginTop = '-5%';
                    document.getElementsByTagName('body')[0].style.fontSize = '10px';
                    window.print();
                    document.getElementById('imgStyle').style.marginTop = '10%';
                    document.getElementById('imgStyle').style.marginLeft = '54%';
                    document.getElementsByTagName('body')[0].style.marginTop = '0%';
                    document.getElementsByTagName('body')[0].style.fontSize = '14px';
                } else {
                    window.print();
                }
            }
    }])
 }());
