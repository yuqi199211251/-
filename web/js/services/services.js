/*jm - services.js - Yadong Zhu 2018*/
(function() {
    'use strict';
    /* Services */
    angular.module('jm.services')
    .factory('apiValues', function() {
      return {
        pattern:'/jmapi/:module/:submodule/:type/:subtype/:param1/:param2/:param3/:param4.json',
        actions:{
          //start authentication api
            checkLoginStatus: {
              method: 'GET',
              params: {
                module:"common",
                submodule:"public",
                type: "check-login-status"
              }
            },
            login: { 
               method: 'POST',
               headers: {'Accept': 'application/json'},
               params: {
                module:"common",
                submodule:"public",
                type:"login"
              }
             },
              logout: { 
               method: 'GET',
               params: {
                module:"common",
                submodule:"public",
                type:"logout"
              }
             },
             uploadFile: { 
              method: 'POST',
              /* headers: {'Content-Type': 'multipart/form-data'}, */
              /* headers: {'Accept': 'application/json'}, */
              module:"sales-rep",
              submodule:"complaint-requrest",
              params: {type:"upload-file"}
            },
             getUserList:{
              method: 'GET',
              params:{
                module:"common",
                submodule:"user",
                type: 'get-user-list'
              },
              isArray:true
            },
            addEditUser:{
              method: 'POST',
              params:{
                module:"common",
                submodule:"user",
                type: 'add-edit-user'
              },
              isArray:true
            },
            deleteUser:{
              method: 'POST',
              params:{
                module:"common",
                submodule:"user",
                type: 'delete-user'
              },
              isArray:true
            },
            viewErrorLog:{
              method: 'POST',
              params:{
                module:"common",
                submodule:"logs",
                type: 'view-error-log'
              },
              isArray:true
            },
            viewInfoLog:{
              method: 'POST',
              params:{
                module:"common",
                submodule:"logs",
                type: 'view-info-log'
              },
              isArray:true
            },
            getCompanyInformationList:{
              method: 'POST',
              params: {
                module:"sales-disbtributor",
                submodule:"company",
                type: "get-company-information-list"
              },
              isArray:true
            },
            addCompanyInformation:{
              method: 'POST',
              params: {
                module:"sales-disbtributor",
                submodule:"company",
                type: "add-company-information-list"
              },
              isArray:true
            },

            deleteCompanyInfo:{
              method: 'POST',
              params: {
                module:"sales-disbtributor",
                submodule:"company",
                type: "delete-company-information"
              },
              isArray:true
            },
            getHospitalInformationList:{
              method: 'POST',
              params: {
                module:"sales-disbtributor",
                submodule:"company",
                type: "get-hospital-information-list"
              },
              isArray:true
            },
            editHospitalInformation:{
              method: 'POST',
              params: {
                module:"sales-disbtributor",
                submodule:"company",
                type: "edit-hospital-information-list"
              },
              isArray:true
            },
            getCustomWareHouseInformationList:{
              method: 'POST',
              params: {
                module:"sales-disbtributor",
                submodule:"company",
                type: "get-customWareHouse-information-list"
              },
              isArray:true
            },
            addEditCustomWareHouseInformation:{
              method: 'POST',
              params: {
                module:"sales-disbtributor",
                submodule:"company",
                type: "addEdit-customWareHouse-information-list"
              },
              isArray:true
            },
            
            deleteCustomInformationRequest:{
              method: 'POST',
              params: {
                module:"sales-disbtributor",
                submodule:"company",
                type: "delete-customWareHouse-information-list"
              },
              isArray:true
            },

            getDoctorInformationList:{
              method: 'POST',
              params: {
                module:"sales-disbtributor",
                submodule:"company",
                type: "get-doctor-information-list"
              },
              isArray:true
            },
            
            deleteDoctorInformationRequest:{
              method: 'POST',
              params: {
                module:"sales-disbtributor",
                submodule:"company",
                type: "delete-doctor-information-list"
              },
              isArray:true
            },
            getElectronicSignaturePic:{
              method: 'POST',
              params: {
                module:"sales-disbtributor",
                submodule:"company",
                type: "get-electronic-signature-pic"
              },
              isArray:true
            },
            getElectronicSignatureList:{
              method: 'POST',
              params: {
                module:"sales-disbtributor",
                submodule:"company",
                type: "get-electronic-signature-list"
              },
              isArray:true
            },
            
            saveElectronicSignatureInformation:{
              method: 'POST',
              params: {
                module:"sales-disbtributor",
                submodule:"company",
                type: "save-electronic-signature-list"
              },
              isArray:true
            },

            getComplaintRequestList:{
              method: 'POST',
              params: {
                module:"sales-rep",
                submodule:"complaint-requrest",
                type: "get-complaint-request-list"
              },
              isArray:true
            },
            getMonthlySalesDifferencesComparisonList:{
              method: 'POST',
              params: {
                module:"supply-chain",
                submodule:"monthlySale-report",
                type: "get-monthly-sales-differences-comparison-list"
              },
              isArray:true
            },
           
            getFeedbackPhotosList:{
              method: 'POST',
              params: {
                module:"sales-rep",
                submodule:"complaint-requrest",
                type: "get-feedback-photos-list"
              },
              isArray:true
            },
            getFeedbackDetailList:{
              method: 'POST',
              params: {
                module:"sales-rep",
                submodule:"complaint-requrest",
                type: "get-feedback-detail-list"
              },
              isArray:true
            },
            getComplaintRequest:{
              method: 'POST',
              params: {
                module:"sales-rep",
                submodule:"complaint-requrest",
                type: "get-complaint_request"
              }
            },
            getImplantFeedback:{
              method: 'POST',
              params: {
                module:"sales-rep",
                submodule:"complaint-requrest",
                type: "get-implant_feedback"
              }
            },
            getDoctor:{
              method: 'GET',
              params:{
                module:"common",
                submodule:"public",
                type: 'get-doctor-list'
              },
              isArray:true
            },

            getDoctor:{
              method: 'GET',
              params:{
                module:"common",
                submodule:"public",
                type: 'getPicture'
              },
              isArray:true
            },

            getElectronicCertificate:{
              method: 'GET',
              params:{
                module:"common",
                submodule:"public",
                type: 'get-electronicCertificate-list'
              },
              isArray:true
            },
            getHospital:{
              method: 'GET',
              params:{
                module:"common",
                submodule:"public",
                type: 'get-hospital-list'
              },
              isArray:true
            },
            getProductType:{
              method: 'GET',
              params:{
                module:"common",
                submodule:"public",
                type: 'get-product-type-list'
              },
              isArray:true
            },
             getPerformanceReport:{
              method: 'POST',
              params: {
                type: "get-performance-report"
              }
            },
            getListByCategories:{
              method: 'POST',
              params:{
                module:"common",
                submodule:"public",
                type: 'get-list-by-categories'
              },
              isArray:true
            },
            addComplaintRequest:{
              method: 'POST',
              params:{
                module:"sales-rep",
                submodule:"complaint-requrest",
                type: 'add-complaint_request'
              },
              isArray:false
            },
            commitComplaintRequest:{
              method: 'POST',
              params:{
                module:"sales-rep",
                submodule:"complaint-requrest",
                type: 'commit-complaint_request'
              },
              isArray:false
            },
            getAuditLogList:{
              method: 'POST',
              params:{
                module:"common",
                submodule:"logMessage",
                type: 'get-audit-log-list'
              },
              isArray:true
            },
            getFeedbackNumberList:{
              method: 'POST',
              params:{
                module:"sales-rep",
                submodule:"complaint-requrest",
                type: 'get-feedback-number-list'
              },
              isArray:true
            },
            validationProductNumber:{
              method: 'POST',
              params:{
                module:"sales-rep",
                submodule:"complaint-requrest",
                type: 'validation-productNumber'
              }
            },
            deleteComplaintRequest:{
              method: 'POST',
              params:{
                module:"sales-rep",
                submodule:"complaint-requrest",
                type: 'delete-complaint_request'
              },
              isArray:true
            },
            checkComplaintRequest:{
              method: 'POST',
              params:{
                module:"sales-rep",
                submodule:"complaint-requrest",
                type: 'check-complaint_request'
              },
              isArray:true
            },
            getHospitalMessage:{
              method: 'POST',
              params:{
                module:"sales-rep",
                submodule:"complaint-requrest",
                type: 'get-hospitalMessage'
              }
            },
            getNavigationMenu:{
             method: 'POST',
             params: {
              module:"common",
              submodule:"public",
               type: "get-navigation-menu"
             }
           },
           getNavigationMenuAuth:{
            method: 'POST',
            params: {
              module:"common",
              submodule:"public",
              type: "get-navigation-menu-auth"
            }
          },
          getYearSaleReport:{
            method: 'POST',
            params: {
              module:"supply-chain",
              submodule:"monthlySale-report",
              type: "year-sale-reportList"
            }
          },

          getMonthSaleReport:{
            method: 'POST',
            params: {
              module:"supply-chain",
              submodule:"monthlySale-report",
              type: "month-sale-reportList"
            }
          },

          selectPerByPerName:{
            method: 'POST',
            params: {
              module:"common",
              submodule:"public",
              type: "selectPerByPerName"
            },
            isArray:true
          },

          selectProjectNum:{
            method: 'POST',
            params: {
              module:"common",
              submodule:"public",
              type: "selectProjectNum"
            },
            isArray:true
          },
          
          selectDepartment:{
            method: 'POST',
            params: {
              module:"common",
              submodule:"public",
              type: "selectDepartment"
            },
            isArray:true
          },

          selectCostCenter:{
            method: 'POST',
            params: {
              module:"common",
              submodule:"public",
              type: "selectCostCenter"
            },
            isArray:true
          },
          
          GetNewRequestNo:{
            method: 'POST',
            params: {
              module:"common",
              submodule:"public",
              type: "GetNewRequestNo"
            },
            isArray:true
          },

          saveAllTravelRequest :{
            method: 'POST',
            params: {
              module:"common",
              submodule:"public",
              type: "saveAllTravelRequest"
            },
            isArray:true
          },
          
          saveFileTravelRequest :{
            method: 'POST',
            params: {
              module:"common",
              submodule:"public",
              type: "saveFileTravelRequest"
            },
            isArray:true
          },

          getMyApplyList :{
            method: 'POST',
            params: {
              module:"common",
              submodule:"public",
              type: "getMyApplyList"
            },
            isArray:true
          },

          getTraReqNoList :{
            method: 'POST',
            params: {
              module:"common",
              submodule:"public",
              type: "getTraReqNoList"
            },
            isArray:true
          },

          
          getCurrencyList :{
            method: 'POST',
            params: {
              module:"common",
              submodule:"public",
              type: "getCurrencyList"
            },
            isArray:true
          },

          selectHeaderInfoByProcessID :{
            method: 'POST',
            params: {
              module:"common",
              submodule:"public",
              type: "selectHeaderInfoByProcessID"
            },
            isArray:true
          },

          selectDetailInfoByProcessID :{
            method: 'POST',
            params: {
              module:"common",
              submodule:"public",
              type: "selectDetailInfoByProcessID"
            },
            isArray:true
          },

          selectFileInfoByProcessID :{
            method: 'POST',
            params: {
              module:"common",
              submodule:"public",
              type: "selectFileInfoByProcessID"
            },
            isArray:true
          },

          // 删除差旅申请数据
          deleteTravelRequestData :{
            method: 'POST',
            params: {
              module:"common",
              submodule:"public",
              type: "deleteTravelRequestData"
            },
            isArray:true
          },
         
          // 费用类型
          selectExpenseTypeList :{
            method: 'POST',
            params: {
              module:"common",
              submodule:"public",
              type: "selectExpenseTypeList"
            },
            isArray:true
          },

          // 税率
          selectCnTaxTypeList :{
            method: 'POST',
            params: {
              module:"common",
              submodule:"public",
              type: "selectCnTaxTypeList"
            },
            isArray:true
          },

          saveAllTravelExpense :{
            method: 'POST',
            params: {
              module:"common",
              submodule:"public",
              type: "saveAllTravelExpense"
            },
            isArray:true
          },

          // 根据processID获取TEX头部信息
          selectTEXHeaderInfoByProcessID :{
            method: 'POST',
            params: {
              module:"common",
              submodule:"public",
              type: "selectTEXHeaderInfoByProcessID"
            },
            isArray:true
          },
          
          // 根据processID获取TEX DETAIL信息
          selectDetailTEXInfoByProcessID :{
            method: 'POST',
            params: {
              module:"common",
              submodule:"public",
              type: "selectDetailTEXInfoByProcessID"
            },
            isArray:true
          }
        }
      }
       
    })
    .factory('jmService', ['$resource','apiValues','constants',
      function($resource,apiValues,constants) {
        return $resource
          (
            apiValues.pattern,
            {},
            apiValues.actions
          );
    }])
    .service('utilSvc',['$timeout','$rootScope',function($timeout,$rootScope){
        return {
          isServerRequest:function(url){
                var re = new RegExp('/jmapi');//start with '/jmapi'
                var match=re.exec(url);
                if (match===null) return false;
                else return true;
            },
          addAlert: function(text, type, isAutoClosed, callback) {
            $rootScope.pageParts = {};
            $rootScope.pageParts.alerts = [];
            $rootScope.addAlert = function(type, text) {
              return $rootScope.pageParts.alerts.push({
                type: type,
                msg: text
              });
            };
            $rootScope.closeAlert = function(index) {
              $rootScope.pageParts.alerts.splice(index, 1);
            };
            var alert;
            if (type === 'success') {
              alert = $rootScope.addAlert('success', text);
            } else  if (type === 'warning'){
              $rootScope.addAlert('warning', text);
            }else {
              $rootScope.addAlert('danger', text);
            }
            if (isAutoClosed) {
              $timeout(function() {
                $rootScope.closeAlert($rootScope.pageParts.alerts.indexOf(alert));
                if (callback) {
                  callback.call();
                  return
                }
              }, 5000);
            } else {
              if (callback)
                callback.call();
              return;
            }
          }
          ,
          findItemById: function(id, itemList,idName) {
            if (angular.isDefined(id)) {
              for (var i = 0; i < itemList.length; i++) {
                if (itemList[i][idName] === id) {
                  return itemList[i];
                }
              }
            }
          },
          dateToString: function(date){
            var dateTime;
                if(typeof date == 'string'){
                    dateTime = date.substring(0,10);
                }else {
                    var year = date.getFullYear(); 
                    var month =(date.getMonth() + 1).toString(); 
                    var day = (date.getDate()).toString();  
                    if (month.length == 1) { 
                        month = "0" + month; 
                    } 
                    if (day.length == 1) { 
                        day = "0" + day; 
                    }
                    dateTime = year + "-" + month + "-" + day;
                }
                return dateTime;
          },
          findItemIndexById: function(id, itemList, idName) {
            if (angular.isDefined(id)) {
              for (var i = 0; i < itemList.length; i++) {
                if (itemList[i][idName] === id) {
                    return i;
                  }
              }
              return -1;
            }
          },
          removeItemById: function(id, itemList,idName) {
              if (angular.isDefined(id)) {
                for (var i = 0; i < itemList.length; i++) {
                  if (itemList[i][idName] === id) {
                    itemList.splice(i, 1);
                    return true;
                  }
                }
                return false;
              }
              return false;
            },
            formatDate:function(date,separator) {
              var d = (date)?new Date(date):new Date(),
                  month = '' + (d.getMonth() + 1),
                  day = '' + d.getDate(),
                  year = d.getFullYear();
          
              if (month.length < 2) month = '0' + month;
              if (day.length < 2) day = '0' + day;
          
              return [year, month, day].join(separator||"");
          },
          pageLoading:function(arg){
            if (arg==="start"&&$rootScope.pageLoading){ //prevent from submit twice before return
              throw new Error("Please don't submit twice!");
            }
            if (arg==="start"){
              $rootScope.pageLoading=true;
            } else {
              $rootScope.pageLoading=false;
            }
          }
        }
    }])
    .value('constants', {
      categories:[
        {
          id:"SGW",
          display:"BIT"
        },
        {
          id:"CHW",
          display:"BESA"
        },
        {
          id:"SGQ",
          display:"QA Sample"
        }
      ],
      pageMessage:
        {
          itemPerPage:10,
          currentPage:1,
          maxSize:8
        },
      productType:
      {
        bracketry:"支架系统",
        bracketrySecond:"支架系统Ⅱ",
        PowlineDilatedCatheter:"Powline球囊扩张导管",
        baylusProduct:"贝鲁斯产品",
        MozecDilatedCatheter:"Mozec球囊扩张导管",
        angiographicCatheter:"血管造影导管"
      },
      userRoles:["agent","businessDirector","businessLeader","admin","superAdmin"],
      units:[
        {id:"IN",display:"inch"},
        {id:"BOT",display:"BT"},
        {id:"KAR",display:"CAR"},
        {id:"GLL",display:"GAL"},
        {id:"STD",display:"HR"},
        {id:"PAK",display:"PAC"},
        {id:"ST",display:"PC"}
      ]
    })
    .service('dynamicLocale',function(){
            var locale = {
                "en-sg":{
                    "DATETIME_FORMATS": {
                      "AMPMS": [
                        "AM",
                        "PM"
                      ],
                      "DAY": [
                        "Sunday",
                        "Monday",
                        "Tuesday",
                        "Wednesday",
                        "Thursday",
                        "Friday",
                        "Saturday"
                      ],
                      "ERANAMES": [
                        "Before Christ",
                        "Anno Domini"
                      ],
                      "ERAS": [
                        "BC",
                        "AD"
                      ],
                      "FIRSTDAYOFWEEK": 6,
                      "MONTH": [
                        "January",
                        "February",
                        "March",
                        "April",
                        "May",
                        "June",
                        "July",
                        "August",
                        "September",
                        "October",
                        "November",
                        "December"
                      ],
                      "SHORTDAY": [
                        "Sun",
                        "Mon",
                        "Tue",
                        "Wed",
                        "Thu",
                        "Fri",
                        "Sat"
                      ],
                      "SHORTMONTH": [
                        "Jan",
                        "Feb",
                        "Mar",
                        "Apr",
                        "May",
                        "Jun",
                        "Jul",
                        "Aug",
                        "Sep",
                        "Oct",
                        "Nov",
                        "Dec"
                      ],
                      "STANDALONEMONTH": [
                        "January",
                        "February",
                        "March",
                        "April",
                        "May",
                        "June",
                        "July",
                        "August",
                        "September",
                        "October",
                        "November",
                        "December"
                      ],
                      "WEEKENDRANGE": [
                        5,
                        6
                      ],
                      "fullDate": "EEEE, d MMMM y",
                      "longDate": "d MMMM y",
                      "medium": "d MMM y h:mm:ss a",
                      "mediumDate": "d MMM y",
                      "mediumTime": "h:mm:ss a",
                      "short": "d/M/yy h:mm a",
                      "shortDate": "d/M/yy",
                      "shortTime": "h:mm a"
                    },
                    "NUMBER_FORMATS": {
                      "CURRENCY_SYM": "$",
                      "DECIMAL_SEP": ".",
                      "GROUP_SEP": ",",
                      "PATTERNS": [
                        {
                          "gSize": 3,
                          "lgSize": 3,
                          "maxFrac": 3,
                          "minFrac": 0,
                          "minInt": 1,
                          "negPre": "-",
                          "negSuf": "",
                          "posPre": "",
                          "posSuf": ""
                        },
                        {
                          "gSize": 3,
                          "lgSize": 3,
                          "maxFrac": 2,
                          "minFrac": 2,
                          "minInt": 1,
                          "negPre": "-\u00a4",
                          "negSuf": "",
                          "posPre": "\u00a4",
                          "posSuf": ""
                        }
                      ]
                    },
                    "id": "en-sg",
                    "localeID": "en_SG",
                },
                "zh-cn":{
                    "DATETIME_FORMATS": {
                        "AMPMS": [
                          "\u4e0a\u5348",
                          "\u4e0b\u5348"
                        ],
                        "DAY": [
                          "\u661f\u671f\u65e5",
                          "\u661f\u671f\u4e00",
                          "\u661f\u671f\u4e8c",
                          "\u661f\u671f\u4e09",
                          "\u661f\u671f\u56db",
                          "\u661f\u671f\u4e94",
                          "\u661f\u671f\u516d"
                        ],
                        "MONTH": [
                          "\u4e00\u6708",
                          "\u4e8c\u6708",
                          "\u4e09\u6708",
                          "\u56db\u6708",
                          "\u4e94\u6708",
                          "\u516d\u6708",
                          "\u4e03\u6708",
                          "\u516b\u6708",
                          "\u4e5d\u6708",
                          "\u5341\u6708",
                          "\u5341\u4e00\u6708",
                          "\u5341\u4e8c\u6708"
                        ],
                        "SHORTDAY": [
                          "\u5468\u65e5",
                          "\u5468\u4e00",
                          "\u5468\u4e8c",
                          "\u5468\u4e09",
                          "\u5468\u56db",
                          "\u5468\u4e94",
                          "\u5468\u516d"
                        ],
                        "SHORTMONTH": [
                          "1\u6708",
                          "2\u6708",
                          "3\u6708",
                          "4\u6708",
                          "5\u6708",
                          "6\u6708",
                          "7\u6708",
                          "8\u6708",
                          "9\u6708",
                          "10\u6708",
                          "11\u6708",
                          "12\u6708"
                        ],
                        "fullDate": "y\u5e74M\u6708d\u65e5EEEE",
                        "longDate": "y\u5e74M\u6708d\u65e5",
                        "medium": "yyyy-M-d a h:mm:ss",
                        "mediumDate": "yyyy-M-d",
                        "mediumTime": "a h:mm:ss",
                        "short": "yy-M-d a h:mm",
                        "shortDate": "yy-M-d",
                        "shortTime": "ah:mm"
                  },
                  "NUMBER_FORMATS": {
                    "CURRENCY_SYM": "\u00a5",
                    "DECIMAL_SEP": ".",
                    "GROUP_SEP": ",",
                    "PATTERNS": [
                      {
                        "gSize": 3,
                        "lgSize": 3,
                        "macFrac": 0,
                        "maxFrac": 3,
                        "minFrac": 0,
                        "minInt": 1,
                        "negPre": "-",
                        "negSuf": "",
                        "posPre": "",
                        "posSuf": ""
                      },
                      {
                        "gSize": 3,
                        "lgSize": 3,
                        "macFrac": 0,
                        "maxFrac": 2,
                        "minFrac": 2,
                        "minInt": 1,
                        "negPre": "(\u00a4",
                        "negSuf": ")",
                        "posPre": "\u00a4",
                        "posSuf": ""
                      }
                    ]
                  },
                  "id": "zh-cn"
                }
            }; //end of var locale
            
        return {
          setLocale:function($locale){
              $locale.DATETIME_FORMATS = locale[$locale.id].DATETIME_FORMATS;
              $locale.NUMBER_FORMATS = locale[$locale.id].NUMBER_FORMATS;
          }
        }
    });
 }());