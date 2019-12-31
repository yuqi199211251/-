/*jm - App.js - Yadong Zhu 2018*/
(function() {
    'use strict';
    
    angular.module('jm')                
    .config(['$routeProvider',
        function($routeProvider) {
            $routeProvider
            .when('/home', {
                templateUrl: 'partials/common/public/home.html',
                controller: 'homeCtrl'
            })
            .when('/display-image:FID?', {
                templateUrl: 'partials/sales-rep/complaint/display-image.html',
                controller: 'displayImageCtrl',
                resolve:{
                    feedbackPhotosList:['$q','$route','utilSvc','jmService',
                        function($q,$route,util,apiSvc){
                            var deferred = $q.defer();
                            if ($route.current.params.FID){
                                util.pageLoading("start");
                                apiSvc.getFeedbackPhotosList({FID:$route.current.params.FID}).$promise.then(function(data){
                                    if (data){
                                        deferred.resolve(data);
                                    } else {
                                        deferred.resolve(undefined);
                                    }
                                    util.pageLoading("stop");
                                },function(err){
                                    deferred.reject(err);
                                    util.pageLoading("stop");
                                })
                            } else {
                                deferred.resolve(undefined)
                                util.pageLoading("stop");
                            }
                            return deferred.promise;
                        }]
                }
            })
            .when('/display-image:FID?', {
                templateUrl: 'partials/sales-rep/complaint/display-image.html',
                controller: 'displayImageCtrl',
                resolve:{
                    feedbackPhotosList:['$q','$route','utilSvc','jmService',
                        function($q,$route,util,apiSvc){
                            var deferred = $q.defer();
                            if ($route.current.params.FID){
                                util.pageLoading("start");
                                apiSvc.getFeedbackPhotosList({FID:$route.current.params.FID}).$promise.then(function(data){
                                    if (data){
                                        deferred.resolve(data);
                                    } else {
                                        deferred.resolve(undefined);
                                    }
                                    util.pageLoading("stop");
                                },function(err){
                                    deferred.reject(err);
                                    util.pageLoading("stop");
                                })
                            } else {
                                deferred.resolve(undefined)
                                util.pageLoading("stop");
                            }
                            return deferred.promise;
                        }]
                }
            })
            .when('/printImplantFeedback/:fid?', {
                templateUrl: 'partials/sales-rep/complaint/print_implant_feedback.html',
                controller: 'printImplantFeedbackCtrl',
                resolve:{
                    implantFeedback:['$q','$route','utilSvc','jmService',
                        function($q,$route,util,apiSvc){
                            var deferred = $q.defer();
                            if ($route.current.params.fid){
                                util.pageLoading("start");
                               /*  apiSvc.getImplantFeedback({date:$route.current.params.fid}).$promise.then(function(data){ */
                                apiSvc.getComplaintRequest({FID:$route.current.params.fid}).$promise.then(function(data){
                                if (data){
                                    deferred.resolve(data);
                                } else {
                                    deferred.resolve(undefined);
                                }
                                util.pageLoading("stop");
                                },function(err){
                                    deferred.reject(err);
                                    util.pageLoading("stop");
                                })
                            } else {
                                deferred.resolve(undefined)
                                util.pageLoading("stop");
                            }
                            return deferred.promise;
                        }]
                }
            })
            .when('/printReplacementRequest/:fid?', {
                templateUrl: 'partials/sales-rep/complaint/print_replacement_request.html',
                controller: 'printReplacementRequestCtrl',
                resolve:{
                    implantFeedback:['$q','$route','utilSvc','jmService',
                        function($q,$route,util,apiSvc){
                            var deferred = $q.defer();
                            if ($route.current.params.fid){
                                util.pageLoading("start");
                               /*  apiSvc.getImplantFeedback({date:$route.current.params.fid}).$promise.then(function(data){ */
                                apiSvc.getComplaintRequest({FID:$route.current.params.fid}).$promise.then(function(data){
                                if (data){
                                    deferred.resolve(data);
                                } else {
                                    deferred.resolve(undefined);
                                }
                                util.pageLoading("stop");
                                },function(err){
                                    deferred.reject(err);
                                    util.pageLoading("stop");
                                })
                            } else {
                                deferred.resolve(undefined)
                                util.pageLoading("stop");
                            }
                            return deferred.promise;
                        }]
                }
            })
            .when('/admin', {
                templateUrl: 'partials/common/user/admin.html',
                controller: 'adminCtrl',
                resolve:{
                    userList:['$q','jmService','utilSvc',
                        function($q,apiSvc,util){
                            var deferred = $q.defer();
                            util.pageLoading("start");
                            apiSvc.getUserList().$promise.then(function(data){
                                if (data){
                                    deferred.resolve(data);
                                } else {
                                    deferred.resolve(undefined);
                                }
                                util.pageLoading("stop");
                            },function(err){
                                deferred.reject(err);
                                util.pageLoading("stop");
                            })
                            return deferred.promise;
                        }]
                }
            })
            .when('/view-error-log', {
                templateUrl: 'partials/common/logMessage/view-log.html',
                controller: 'viewLogCtrl',
                resolve:{
                    logs:['$q','jmService','utilSvc',
                    function($q,apiSvc,util){
                            var deferred = $q.defer();
                            util.pageLoading("start");
                            apiSvc.viewErrorLog({type:"error-log"}).$promise.then(function(data){
                                if (data){
                                    deferred.resolve(data);
                                } else {
                                    deferred.resolve(undefined);
                                }
                                util.pageLoading("stop");
                            },function(err){
                                deferred.reject(err);
                                util.pageLoading("stop");
                            })
                            return deferred.promise;
                        }]
                }
            })
            .when('/view-info-log', {
                templateUrl: 'partials/common/logMessage/view-log.html',
                controller: 'viewLogCtrl',
                resolve:{
                    logs:['$q','jmService','utilSvc',
                    function($q,apiSvc,util){
                            var deferred = $q.defer();
                            util.pageLoading("start");
                            apiSvc.viewInfoLog({type:"info-log"}).$promise.then(function(data){
                                if (data){
                                    deferred.resolve(data);
                                } else {
                                    deferred.resolve(undefined);
                                }
                                util.pageLoading("stop");
                            },function(err){
                                deferred.reject(err);
                                util.pageLoading("stop");
                            })
                            return deferred.promise;
                        }]
                }
            })
            .when('/companyInformation', {
                templateUrl: 'partials/sales-disbtributor/company/companyInformation-request.html',
                controller: 'companyInformationRequestCtrl',
                resolve:{
                    companyInformationList:['$q','$route','jmService','utilSvc',
                        function($q,$route,apiSvc,util){
                            var deferred = $q.defer();
                            util.pageLoading("start");
                            apiSvc.getCompanyInformationList({startDate:$route.current.params.startDate,endDate:$route.current.params.endDate}).$promise.then(function(data){
                                if (data){
                                    deferred.resolve(data);
                                } else {
                                    deferred.resolve(undefined);
                                }
                                util.pageLoading("stop");
                            },function(err){
                                deferred.reject(err);
                                util.pageLoading("stop");
                            })
                            
                            return deferred.promise;
                        }]
                }
            })

            //差旅申请
            .when('/travelRequest', {
                templateUrl: 'partials/TRE/travel-request.html',
                controller: 'travelRequestCtrl'
            })

            //差旅报销
            .when('/travelExpense', {
                templateUrl: 'partials/TEX/travel-expense.html',
                controller: 'travelExpenseCtrl'
            })

            //我的申请
            .when('/myApply', {
                templateUrl: 'partials/myApply/myApply.html',
                controller: 'myApplyCtrl'
            })

            
        }
    ])
}());

