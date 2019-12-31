/*jm - Controllers.js - Yadong Zhu 2018*/
(function() {
    'use strict';
    /* Controllers */
    angular.module('jm.controllers')
    .controller('uploadFeedbackPictureCtrl', ['$scope',"$location",'FileUploader','jmService','utilSvc','$modal',
    	 function($scope,$location,FileUploader,apiSvc,utilSvc,$modal){
            $scope.files = [];
            $scope.return=function(){
                $location.path("/complaintRequest");
            }

            $scope.uploadFeedbackPicture=function(){
            } 

            $scope.reset=function(){
            }
            $scope.reset();


            $scope.selectFeedbackNumber=function(){
                var modalInstance;
                modalInstance = $modal.open({
                    templateUrl: 'partials/sales-rep/complaint/select-feedback-number.html',
                    windowClass: "sub-detail-modal",
                    controller: "selectFeedbackNumberCtrl",
                    backdrop: "static",
                    resolve:{
                        selectFeedbackNumberList:['$q','jmService','utilSvc',
                        function($q,apiSvc,util){
                            var deferred = $q.defer();
                            util.pageLoading("start");
                            if (true){
                                apiSvc.getFeedbackNumberList().$promise.then(function(data){
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
                            }else {
                                deferred.resolve(undefined)
                                util.pageLoading("stop");
                            }
                            
                            return deferred.promise;
                        }]
                    }
                });
                modalInstance.result.then(function(selectFeedbackNumber) {
                    uploader.url = '/jmapi/sales-rep/complaint-requrest/upload-file.json?feedbackNumber='+selectFeedbackNumber.FBillNo+'&&FkbgFid='+selectFeedbackNumber.FkbgFid;
                    $scope.feedbackMessage = "[投诉单号：" + selectFeedbackNumber.FBillNo +"]；[医院名称："+selectFeedbackNumber.hospitalName+"]；[状态："+selectFeedbackNumber.Fhhzt+"]";
                });
            };

            var uploader = $scope.uploader = new FileUploader({
                
                //url: 'upload.php'
            });

            // a sync filter
        uploader.filters.push({
            name: 'syncFilter',
            fn: function(item /*{File|FileLikeObject}*/, options) {
                console.log('syncFilter');
                return this.queue.length < 10;
            }
        });
      
        // an async filter
        uploader.filters.push({
            name: 'asyncFilter',
            fn: function(item /*{File|FileLikeObject}*/, options, deferred) {
                console.log('asyncFilter');
                setTimeout(deferred.resolve, 1e3);
            }
        });

        // CALLBACKS

        uploader.onWhenAddingFileFailed = function(item /*{File|FileLikeObject}*/, filter, options) {
            console.info('onWhenAddingFileFailed', item, filter, options);
        };
        uploader.onAfterAddingFile = function(fileItem) {
            console.info('onAfterAddingFile', fileItem);
            $scope.files.push(fileItem._file)
            //uploader.body.feedbackNumber = $scope.feedbackNumber;
            uploader.files = $scope.files;
        };
        uploader.onAfterAddingAll = function(addedFileItems) {
            console.info('onAfterAddingAll', addedFileItems);
        };
        uploader.onBeforeUploadItem = function(item) {
            console.info('onBeforeUploadItem', item);
        };
        uploader.onProgressItem = function(fileItem, progress) {
            console.info('onProgressItem', fileItem, progress);
        };
        uploader.onProgressAll = function(progress) {
            console.info('onProgressAll', progress);
        };
        uploader.onSuccessItem = function(fileItem, response, status, headers) {
            console.info('onSuccessItem', fileItem, response, status, headers);
        };
        uploader.onErrorItem = function(fileItem, response, status, headers) {
            console.info('onErrorItem', fileItem, response, status, headers);
        };
        uploader.onCancelItem = function(fileItem, response, status, headers) {
            console.info('onCancelItem', fileItem, response, status, headers);
        };
        uploader.onCompleteItem = function(fileItem, response, status, headers) {
            console.info('onCompleteItem', fileItem, response, status, headers);
        };
        uploader.onCompleteAll = function() {
            utilSvc.addAlert("图片上传成功!", "success", true);
            console.info('onCompleteAll');
        };

        console.info('uploader', uploader);
        //uploader.url = '/jmapi/upload-file.json?feedbackNumber='+$scope.feedbackNumber;
        
    }])
 }());
