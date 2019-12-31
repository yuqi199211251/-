'use strict';

const dbComplaintRequestSvc=require('../dbservices/dbComplaintRequestSvc')
var Promise = require('Promise').default
var fs = require("fs")
var UUID = require('node-uuid')
exports.getComplaintRequestList=function(req,res){
	(async function () {
		try {
			var list = await dbComplaintRequestSvc.getComplaintRequestList(req.session.user.FUserID,req.body.startDate,req.body.endDate);
			return res.status(200).send(list.recordset);
		} catch (error) {
			return res.status(200).send({error:true,message:error.message});
		}
	})()
};

exports.getFeedbackPhotosList=function(req,res){
	(async function () {
		try {
			var list = await dbComplaintRequestSvc.getFeedbackPhotosList(req.body.FID);
			return res.status(200).send(list.recordset);
		} catch (error) {
			return res.status(200).send({error:true,message:error.message});
		}
	})()
};


exports.getFeedbackDetailList=function(req,res){
	(async function () {
		try {
			var list = await dbComplaintRequestSvc.getFeedbackDetailList(req.session.user.FUserID);
			return res.status(200).send(list.recordset);
		} catch (error) {
			return res.status(200).send({error:true,message:error.message});
		}
	})()
};




/**
 * 
 * 根据id查询投诉换货信息
 * @author  Frank
 * @version v1.1.1
 * @event 2019-06-04
 * 
 */
exports.getComplaintRequest=function(req,res){
	(async function () {
		try {
			var list = await dbComplaintRequestSvc.getComplaintRequest(req.body.FID);
			if(list.recordset[0].fdzzsUrl != "" &&list.recordset[0].fdzzsUrl != null){
				list.recordset[0].fdzzsUrl = list.recordset[0].fdzzsUrl.toString('base64');
			}
			return res.status(200).send(list.recordset[0]);
		} catch (error) {
			return res.status(200).send({error:true,message:error.message});
		}
	})()
};


/**
 * 
 * 添加修改投诉换货信息
 * @author  Frank
 * @version v1.1.1
 * @event 2019-06-04
 * 
 */
exports.addComplaintRequest=function(req,res){
	(async function () {
		try {
			req.body.complaintRequest.FUserID = req.session.user.FUserID;
			var list = await dbComplaintRequestSvc.addComplaintRequest(req.body.complaintRequest);
			return res.status(200).send(list.recordset[0]);
		} catch (error) {
			return res.status(200).send({error:true,message:error.message});
		}
	})()
};

/**
 * 
 * 提交投诉换货信息
 * @author  Frank
 * @version v1.1.1
 * @event 2019-06-04
 * 
 */
exports.commitComplaintRequest=function(req,res){
	(async function () {
		try {
			req.body.complaintRequest.FUserID = req.session.user.FUserID;
			var list = await dbComplaintRequestSvc.commitComplaintRequest(req.body.complaintRequest);
			return res.status(200).send(list.recordset[0]);
		} catch (error) {
			return res.status(200).send({error:true,message:error.message});
		}
	})()
}; 
/* exports.commitComplaintRequest=function(req,res){
	(async function () {
		try {
			var list = await dbComplaintRequestSvc.commitComplaintRequest(req.body.complaintRequest.fid,req.session.user.FUserID,req.body.complaintRequest.electronicCertificate);
			return res.status(200).send(list.recordset[0]);
		} catch (error) {
			return res.status(200).send({error:true,message:error.message});
		}
	})()
}; */

/**
 * 
 * 删除投诉换货信息
 * @author  Frank
 * @version v1.1.1
 * @event 2019-06-06
 * 
 */
exports.deleteComplaintRequest=function(req,res){
	(async function () {
		try {
			await dbComplaintRequestSvc.deleteComplaintRequest(req.body.complaintRequest.FID);
			var list = await dbComplaintRequestSvc.getComplaintRequestList(req.session.user.FUserID,req.body.startDate,req.body.endDate);
			return res.status(200).send(list.recordset);
		} catch (error) {
			return res.status(200).send({error:true,message:error.message});
		}
	})()
};

/**
 * 
 * 批改投诉换货信息
 * @author  Frank
 * @version v1.1.1
 * @event 2019-06-017
 * 
 */
exports.checkComplaintRequest=function(req,res){
	(async function () {
		try {
			await dbComplaintRequestSvc.checkComplaintRequest(req.body.complaintRequest);
			var list = await dbComplaintRequestSvc.getComplaintRequestList(req.session.user.FUserID,req.body.startDate,req.body.endDate);
			return res.status(200).send(list.recordset);
		} catch (error) {
			return res.status(200).send({error:true,message:error.message});
		}
	})()
};

/**
 * 
 * 查询要换货序列号产品的信息
 * @author  Frank
 * @version v1.1.1
 * @event 2019-06-03
 * 
 */
exports.validationProductNumber=function(req,res){
	(async function () {
		try {
			var FkbgList = await dbComplaintRequestSvc.validationProductNumber(req.body.productNumber,req.body.feedbackNumber);
			if (FkbgList.recordset.length>0) {
				return res.status(200).send({error:true});
			} 
			var productList = await dbComplaintRequestSvc.getProductByNumber(req.body.productNumber);
			return res.status(200).send(productList.recordset[0]);
		} catch (error) {
			return res.status(200).send({error:true,message:error.message});
		}
	})()
};

/**
 * 
 * 根据医院名称查询医院信息
 * @author  Frank
 * @version v1.1.1
 * @event 2019-06-04
 * 
 */
exports.getHospitalMessage=function(req,res){
	(async function () {
		try {
			var hospitalMessage = await dbComplaintRequestSvc.getHospitalMessage(req.session.user.FUserID,req.body.hospitalId);
			var doctorList = await dbComplaintRequestSvc.getDoctorList(req.session.user.FUserID,req.body.hospitalId);
			var certificateList = await dbComplaintRequestSvc.getCertificateList(req.session.user.FUserID,req.body.hospitalId);
			var allData = {
				'hospitalMessage':hospitalMessage.recordset[0],
				'doctorList':doctorList.recordset,
				'certificateList':certificateList.recordset
			};
			return res.status(200).send(allData);
		} catch (error) {
			return res.status(200).send({error:true,message:error.message});
		}
	})()
};

/**
 * 
 * 获取反馈报告的日志信息
 * @author  Frank
 * @version v1.1.1
 * @event 2019-06-14
 * 
 */
exports.getAuditLogList=function(req,res){
	(async function () {
		try {
			var list = await dbComplaintRequestSvc.getAuditLogList(req.body.complaintRequest.FID);
			return res.status(200).send(list.recordset);
		} catch (error) {
			return res.status(200).send({error:true,message:error.message});
		}
	})()
};

/**
 * 
 * 获取所有反馈单号列表
 * @author  Frank
 * @version v1.1.1
 * @event 2019-07-04
 * 
 */
exports.getFeedbackNumberList=function(req,res){
	(async function () {
		try {
			var list = await dbComplaintRequestSvc.getFeedbackNumberList(req.session.user.FUserID);
			return res.status(200).send(list.recordset);
		} catch (error) {
			return res.status(200).send({error:true,message:error.message});
		}
	})()
};

/**
 * 
 * 上传反馈图片
 * @author  Frank
 * @version v1.1.1
 * @event 2019-07-18
 * 
 */
exports.uploadFile=function(req,res){
	(async function () {
		try {
			if (Object.keys(req.files).length == 0) {
				throw new Error('No files were uploaded.');
			}
			var feedbackNumber = req.query.feedbackNumber;
			var FkbgFid = req.query.FkbgFid;
			var date = new Date();
			var year = date.getFullYear();
			var month = date.getMonth()+1;
			var day = date.getDate();
			if (month >= 1 && month <= 9) {
				month = "0" + month;
			}
			if (day >= 0 && day <= 9) {
				day = "0" + day;
			}
			var fileFoldFirst = './web/upload/'+year+'/';
			fileFoldFirst = fileFoldFirst.toString();
			var fileFoldSecond = './web/upload/'+year+'/'+month+'/';
			fileFoldSecond = fileFoldSecond.toString();
			var fileFoldThird = './web/upload/'+year+'/'+month+'/'+day+'/';
			fileFoldThird = fileFoldThird.toString();
			var fileFoldFinal = './upload/'+year+'/'+month+'/'+day+'/';
			fileFoldFinal = fileFoldFinal.toString();
			try {
				if(!fs.existsSync('./web/upload')){
					fs.mkdirSync('./web/upload',function(err){
						return res.status(400).send({error:true,message:'文件夹创建失败！'});
					})
				}
				if(!fs.existsSync(fileFoldFirst)){
					fs.mkdirSync(fileFoldFirst,function(err){
						return res.status(400).send({error:true,message:'文件夹创建失败！'});
					})
				}
				if(!fs.existsSync(fileFoldSecond)){
					fs.mkdirSync(fileFoldSecond,function(err){
						return res.status(400).send({error:true,message:'文件夹创建失败！'});
					})
				}
				if(!fs.existsSync(fileFoldThird)){
					fs.mkdirSync(fileFoldThird,function(err){
						return res.status(400).send({error:true,message:'文件夹创建失败！'});
					})
				}
			} catch (error) {
				console.log("上传了多张图片");
			}
			var uuid1 = UUID.v1();
			uuid1 ='img-' + uuid1 + '.jpeg';
			await req.files.file.mv(fileFoldThird+uuid1);
			await dbComplaintRequestSvc.uploadPthotos(FkbgFid,feedbackNumber,year,month,day,fileFoldFinal+uuid1,req.session.user.FUserID);
			return res.status(200).send({confirm:"successful"});
		} catch (error) {
			return res.status(400).send({error:true,message:error.message});
		}
	})()
};