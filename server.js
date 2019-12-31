let port = "6060"
if (process.argv.length <= 2) {
	console.log("Usage: node server.js [dev/qas/prod] [port]");
	process.exit(-1);
} else if (process.argv.length > 2){
	let env = process.argv[2];
	require('./api/config/appConfig').getInstance().setEnv(env);
	if (process.argv.length > 3)
		port = process.argv[3];
}
 
const express = require('express');
const fileUpload = require('express-fileupload');
const app = express();
const bodyParser = require('body-parser');
const session = require("express-session");


app.use(fileUpload({
	limits: { fileSize: 10 * 1024 * 1024 },
	createParentPath:true
  }));
  app.use(bodyParser.json({limit:'1024mb'}));
app.use(bodyParser.text({ type: 'text/html' }))
app.use(bodyParser.urlencoded({
	limit:'1024mb',
    extended: true
}));


 app.use(session({
 	secret:"jmuser",
	 resave:true,
	 rolling:true,//reset expiration to the original maxAage on every response
 	saveUninitialized:true,
 	cookie:{
 		maxAge:1000*60*10 //ten mins
 	}

 }))
 
app.use('/', express.static(__dirname + '/web'));
app.use('/bower_components', express.static(__dirname + '/bower_components'));
app.get('/jmapi', function (req, res) {
   return res.send({message: 'hello, jmapi!' })
});
 
var auth=require('./api/handlers/authHandler');
app.get('/jmapi/common/public/check-login-status.json',auth.checkLoginStatus);
app.post('/jmapi/common/public/login.json',auth.login);
app.get('/jmapi/common/public/logout.json',auth.logout);

app.get('/db-info.json',auth.dbInfo);

var commonHandler = require('./api/handlers/commonHandler');

var complaintRequestHandler = require('./api/handlers/complaintRequestHandler');
var salesReportHandler = require('./api/handlers/salesReportHandler');
var companyRequestHandler = require('./api/handlers/companyRequestHandler');

app.post('/jmapi/supply-chain/monthlySale-report/year-sale-reportList.json',auth.authCheck,salesReportHandler.getYearSaleReportList);
app.get('/jmapi/supply-chain/monthlySale-report/get-year-sale-list-for-excel.json',auth.authCheck,salesReportHandler.getYearSaleListForExcel);
app.post('/jmapi/supply-chain/monthlySale-report/month-sale-reportList.json',auth.authCheck,salesReportHandler.getMonthSaleReportList);
app.get('/jmapi/supply-chain/monthlySale-report/get-month-sale-list-for-excel.json',auth.authCheck,salesReportHandler.getMonthSaleListForExcel);
app.post('/jmapi/sales-rep/complaint-requrest/upload-file.json',complaintRequestHandler.uploadFile);
app.get('/jmapi/common/user/get-user-list.json',auth.adminCheck,commonHandler.getUserList);
app.post('/jmapi/common/user/add-edit-user.json',auth.adminCheck,commonHandler.addEditUser);
app.post('/jmapi/common/user/delete-user.json',auth.adminCheck,commonHandler.deleteUser);
app.post('/jmapi/common/logMessage/view-info-log.json',auth.authCheck,commonHandler.viewLog);
app.post('/jmapi/common/logMessage/view-error-log.json',auth.authCheck,commonHandler.viewLog);
app.post('/jmapi/get-performance-report.json',auth.authCheck,commonHandler.getPerformanceReport);
app.post('/jmapi/common/public/get-navigation-menu.json',commonHandler.getNavigationMenu);
app.post('/jmapi/common/public/get-navigation-menu-auth.json',auth.authCheck,commonHandler.getNavigationMenu);
app.post('/jmapi/sales-rep/complaint-requrest/get-complaint-request-list.json',auth.authCheck,complaintRequestHandler.getComplaintRequestList);
app.post('/jmapi/supply-chain/monthlySale-report/get-monthly-sales-differences-comparison-list.json',auth.authCheck,salesReportHandler.getMonthlySalesDifferencesComparisonList);
app.post('/jmapi/sales-rep/complaint-requrest/get-feedback-photos-list.json',auth.authCheck,complaintRequestHandler.getFeedbackPhotosList);
app.post('/jmapi/sales-rep/complaint-requrest/get-feedback-detail-list.json',auth.authCheck,complaintRequestHandler.getFeedbackDetailList);

app.get('/jmapi/common/public/get-doctor-list.json',auth.authCheck,commonHandler.getDoctorList);
app.get('/jmapi/common/public/get-electronicCertificate-list.json',auth.authCheck,commonHandler.getElectronicCertificate);
app.get('/jmapi/common/public/get-hospital-list.json',auth.authCheck,commonHandler.getHospitalList);
app.get('/jmapi/common/public/get-product-type-list.json',auth.authCheck,commonHandler.getProductTypeList);
app.post('/jmapi/common/public/get-list-by-categories.json',auth.authCheck,commonHandler.getListByCategories);
app.post('/jmapi/sales-rep/complaint-requrest/get-complaint_request.json',auth.authCheck,complaintRequestHandler.getComplaintRequest);
//app.post('/jmapi/sales-rep/complaint-requrest/get-implant_feedback.json',auth.authCheck,complaintRequestHandler.getImplantFeedback);
app.post('/jmapi/sales-rep/complaint-requrest/add-complaint_request.json',auth.authCheck,complaintRequestHandler.addComplaintRequest);
app.post('/jmapi/sales-rep/complaint-requrest/commit-complaint_request.json',auth.authCheck,complaintRequestHandler.commitComplaintRequest);
app.post('/jmapi/sales-rep/complaint-requrest/validation-productNumber.json',auth.authCheck,complaintRequestHandler.validationProductNumber);
app.post('/jmapi/sales-rep/complaint-requrest/get-hospitalMessage.json',auth.authCheck,complaintRequestHandler.getHospitalMessage);
app.post('/jmapi/sales-rep/complaint-requrest/delete-complaint_request.json',auth.authCheck,complaintRequestHandler.deleteComplaintRequest);
app.post('/jmapi/sales-rep/complaint-requrest/check-complaint_request.json',auth.authCheck,complaintRequestHandler.checkComplaintRequest);

app.post('/jmapi/common/logMessage/get-audit-log-list.json',auth.authCheck,complaintRequestHandler.getAuditLogList);
app.post('/jmapi/sales-rep/complaint-requrest/get-feedback-number-list.json',auth.authCheck,complaintRequestHandler.getFeedbackNumberList);

app.get('/jmapi/supply-chain/monthlySale-report/get-monthly-sales-differences-comparison-excel.json',auth.authCheck,salesReportHandler.getMonthlySalesDifferencesComparisonExcel);

app.post('/jmapi/sales-disbtributor/company/get-company-information-list.json',auth.authCheck,companyRequestHandler.getCompanyInformationList);
app.post('/jmapi/sales-disbtributor/company/add-company-information-list.json',auth.authCheck,companyRequestHandler.addCompanyInformation);
app.post('/jmapi/sales-disbtributor/company/delete-company-information.json',auth.authCheck,companyRequestHandler.deleteCompanyInfo);
app.post('/jmapi/sales-disbtributor/company/get-hospital-information-list.json',auth.authCheck,companyRequestHandler.getHospitalInformationList);
app.post('/jmapi/sales-disbtributor/company/edit-hospital-information-list.json',auth.authCheck,companyRequestHandler.editHospitalInformationList);
app.post('/jmapi/sales-disbtributor/company/get-customWareHouse-information-list.json',auth.authCheck,companyRequestHandler.getCustomWareHouserInformationList);
app.post('/jmapi/sales-disbtributor/company/addEdit-customWareHouse-information-list.json',auth.authCheck,companyRequestHandler.addEditCustomWareHouserInformationList);
app.post('/jmapi/sales-disbtributor/company/delete-customWareHouse-information-list.json',auth.authCheck,companyRequestHandler.deleteeCustomWareHouserInformationList);
app.post('/jmapi/sales-disbtributor/company/get-doctor-information-list.json',auth.authCheck,companyRequestHandler.getDoctorInformationList);
app.post('/jmapi/sales-disbtributor/company/delete-doctor-information-list.json',auth.authCheck,companyRequestHandler.deleteDoctorInformationRequest);
app.post('/jmapi/sales-disbtributor/company/get-electronic-signature-list.json',auth.authCheck,companyRequestHandler.getElectronicSignatureRequest);
app.post('/jmapi/sales-disbtributor/company/save-electronic-signature-list.json',auth.authCheck,companyRequestHandler.saveElectronicSignatureRequest);
app.post('/jmapi/sales-disbtributor/company/get-electronic-signature-pic.json',auth.authCheck,companyRequestHandler.getElectronicSignaturePic);

app.post('/jmapi/common/public/selectPerByPerName.json',auth.authCheck,commonHandler.selectPerByPerName);
app.post('/jmapi/common/public/selectProjectNum.json',auth.authCheck,commonHandler.selectProjectNum);
app.post('/jmapi/common/public/selectDepartment.json',auth.authCheck,commonHandler.selectDepartment);
app.post('/jmapi/common/public/selectCostCenter.json',auth.authCheck,commonHandler.selectCostCenter);
app.post('/jmapi/common/public/GetNewRequestNo.json',auth.authCheck,commonHandler.GetNewRequestNo);
app.post('/jmapi/common/public/saveAllTravelRequest.json',auth.authCheck,commonHandler.saveAllTravelRequest);
app.post('/jmapi/common/public/saveFileTravelRequest.json',auth.authCheck,commonHandler.saveFileTravelRequest);
app.post('/jmapi/common/public/uploadFile.json',auth.authCheck,commonHandler.uploadFile);
app.post('/jmapi/common/public/getMyApplyList.json',auth.authCheck,commonHandler.getMyApplyList);
app.post('/jmapi/common/public/getTraReqNoList.json',auth.authCheck,commonHandler.getTraReqNoList);
app.post('/jmapi/common/public/getCurrencyList.json',auth.authCheck,commonHandler.getCurrencyList);
app.post('/jmapi/common/public/selectHeaderInfoByProcessID.json',auth.authCheck,commonHandler.selectHeaderInfoByProcessID);
app.post('/jmapi/common/public/selectDetailInfoByProcessID.json',auth.authCheck,commonHandler.selectDetailInfoByProcessID);
app.post('/jmapi/common/public/selectFileInfoByProcessID.json',auth.authCheck,commonHandler.selectFileInfoByProcessID);
app.get('/jmapi/common/public/downLoadFile.json',auth.authCheck,commonHandler.downLoadFile);//下载文件
app.post('/jmapi/common/public/deleteTravelRequestData.json',auth.authCheck,commonHandler.deleteTravelRequestData);

app.post('/jmapi/common/public/selectExpenseTypeList.json',auth.authCheck,commonHandler.selectExpenseTypeList);
app.post('/jmapi/common/public/selectCnTaxTypeList.json',auth.authCheck,commonHandler.selectCnTaxTypeList);
app.post('/jmapi/common/public/saveAllTravelExpense.json',auth.authCheck,commonHandler.saveAllTravelExpense);
app.post('/jmapi/common/public/selectTEXHeaderInfoByProcessID.json',auth.authCheck,commonHandler.selectTEXHeaderInfoByProcessID);
app.post('/jmapi/common/public/selectDetailTEXInfoByProcessID.json',auth.authCheck,commonHandler.selectDetailTEXInfoByProcessID);

app.get('*', function(req, res){
   res.send({ERROR:'Sorry, '+req.originalUrl+' is an invalid URL.'});
});
app.listen(port, function () {
    console.log('Node app is running on port '+(port));
});