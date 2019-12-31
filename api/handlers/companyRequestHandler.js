'use strict';

const dbCompanyRequestSvc=require('../dbservices/dbCompanyRequestSvc')
var Promise = require('Promise').default
var fs = require("fs")
var UUID = require('node-uuid')
var binaryData = '';
exports.getCompanyInformationList=function(req,res){
	(async function () {
		try {
			var list = await dbCompanyRequestSvc.getCompanyInformationList(req.session.user.FCustID);
			return res.status(200).send(list.recordset);
		} catch (error) {
			return res.status(200).send({error:true,message:error.message});
		}
	})()
};

exports.addCompanyInformation=function(req,res){
	(async function () {
		try {
			await dbCompanyRequestSvc.addCompanyInformation(req.session.user.FCustID,req.body.cust);
			var list = await dbCompanyRequestSvc.getCompanyInformationList(req.session.user.FCustID);
			return res.status(200).send(list.recordset);
		} catch (error) {
			return res.status(200).send({error:true,message:error.message});
		}
	})()
};
exports.deleteCompanyInfo=function(req,res){
	(async function () {
		try {
			await dbCompanyRequestSvc.deleteCompanyInfo(req.body.FID);
			var list = await dbCompanyRequestSvc.getCompanyInformationList(req.session.user.FCustID);
			return res.status(200).send(list.recordset);
		} catch (error) {
			return res.status(200).send({error:true,message:error.message});
		}
	})()
};

exports.getHospitalInformationList=function(req,res){
	(async function () {
		try {
			var list = await dbCompanyRequestSvc.getHospitalInformationList(req.session.user.FUserID,req.session.user.FCustID);
			var fname_ = await dbCompanyRequestSvc.getFname_();
			return res.status(200).send([list.recordset,fname_.recordset]);
		} catch (error) {
			return res.status(200).send({error:true,message:error.message});
		}
	})()
};

exports.editHospitalInformationList=function(req,res){
	(async function () {
		try {
			if(req.body.cust.FItemID){
				await dbCompanyRequestSvc.editHospitalInformationList(req.body.cust,req.body.submID);
			}else{
				var FItemClassIDStr = await dbCompanyRequestSvc.getFItemClassID();//获取FItemClassID
				var FItemClassID = FItemClassIDStr.recordset[0].FItemClassID;
				var FNumberStr = await dbCompanyRequestSvc.getFNumber(FItemClassID);//获取FNumber
				var FNumber = FNumberStr.recordset[0].FNumber;
				await dbCompanyRequestSvc.addT_Item(req.body.cust.FName,FItemClassID,FNumber);//新增t_Item表一条数据，目的获取FItemID
				var FItemIDStr = await dbCompanyRequestSvc.getFItemID();//获取FItemID
				var FItemID = FItemIDStr.recordset[0].FItemID;
				await dbCompanyRequestSvc.addHospitalInformationList(req.body.cust,req.body.submID,FItemID,FNumber);
			}
			var list = await dbCompanyRequestSvc.getDoctorInformationList(req.session.user.FUserID);
			return res.status(200).send(list.recordset);
		} catch (error) {
			return res.status(200).send({error:true,message:error.message});
		}
	})()
};

exports.deleteDoctorInformationRequest=function(req,res){
	(async function () {
		try {
			await dbCompanyRequestSvc.deleteDoctorInformationRequest(req.body.FItemID);
			var list = await dbCompanyRequestSvc.getDoctorInformationList(req.session.user.FUserID);
			return res.status(200).send(list.recordset);
		} catch (error) {
			return res.status(200).send({error:true,message:error.message});
		}
	})()
};


exports.getElectronicSignatureRequest=function(req,res){
	(async function () {
		try {
			var list = await dbCompanyRequestSvc.getElectronicSignatureRequest(req.session.user.FUserID);
			return res.status(200).send([list.recordset]);
		} catch (error) {
			return res.status(200).send({error:true,message:error.message});
		}
	})()
};


exports.getElectronicSignaturePic=function(req,res){
	(async function () {
		try {
			var list = await dbCompanyRequestSvc.getElectronicSignaturePic(req.body.electronicSignature,req.session.user.FUserID);
			if(list.recordset[0].FData != "" &&list.recordset[0].FData != null){
				list.recordset[0].FData = list.recordset[0].FData.toString('base64');
			}
			return res.status(200).send([list.recordset]);
		} catch (error) {
			return res.status(200).send({error:true,message:error.message});
		}
	})()
};

exports.saveElectronicSignatureRequest=function(req,res){
	(async function () {
		try {
			var fxsbm = req.body.fxsbm;//分销商编码
			var mc = req.body.mc;//分销商名称
			var miaoshu = req.body.miaoshu;//签章描述
			console.log(req.files.FData.data);
			await dbCompanyRequestSvc.insertTAccessory(req.files.FData.data);
			res.redirect('/#/electronicSignature');
			
		} catch (error) {
			return res.status(200).send({error:true,message:error.message});
		}
	})()
};


exports.getCustomWareHouserInformationList=function(req,res){
	(async function () {
		try {
			var list = await dbCompanyRequestSvc.getCustomWareHouserInformationList(req.session.user.FUserID);
			return res.status(200).send(list.recordset);
		} catch (error) {
			return res.status(200).send({error:true,message:error.message});
		}
	})()
};


exports.addEditCustomWareHouserInformationList=function(req,res){
	(async function () {
		try {
			// await dbCompanyRequestSvc.addEditCustomWareHouserInformationList(req.session.user.FUserID);
				
			if(req.body.cust.FItemID==undefined){
				//如果FUserID为空，执行insert。本次insert需要同时插入三张表
				//判断仓库名是否存在
				var houseIsNotExit = await dbCompanyRequestSvc.houseIsNotExit(req.body.cust.FName);
				if(houseIsNotExit.recordset[0]!=null){
					return res.status(200).send(['exit']);
				}else{
					var fparentID = await dbCompanyRequestSvc.fparentID();//获取fparentID
					fparentID = fparentID.recordset[0].FItemID;
					var FNumber =  await dbCompanyRequestSvc.FNumber();//获取FNumber
					FNumber = FNumber.recordset[0].FNumber;
					if(FNumber==undefined||FNumber==null){
						FNumber = '99.0001';
					}
					var FNumber_ = parseFloat(FNumber)+0.0001;
					var FNumber_4 = FNumber_.toString().split(".")[1];//截取FNumber的后4位
					await dbCompanyRequestSvc.insertIntoItem(fparentID,FNumber_,req.body.cust.FName,FNumber_4);//插入t_Item表数据
					var t_ItemList = await dbCompanyRequestSvc.t_ItemList(FNumber_);//查询t_Item表
					await dbCompanyRequestSvc.insertTstock(t_ItemList.recordset);//插入t_Stock表
					await dbCompanyRequestSvc.insertAstockCustom(t_ItemList.recordset,req.session.user.FUserID);//插入a_Stock_Custom表
					var list = await dbCompanyRequestSvc.getCustomWareHouserInformationList(req.session.user.FUserID);
					return res.status(200).send(list.recordset);
				}
			}else{
				//如果FItemID不为空，执行update
				var houseIsNotExit = await dbCompanyRequestSvc.houseIsNotExit(req.body.cust.FName);
				if(houseIsNotExit.recordset[0]!=null){
					return res.status(200).send(['exit']);
				}else{
					await dbCompanyRequestSvc.updateTitem(req.body.cust.FName,req.body.cust.FItemID);
					await dbCompanyRequestSvc.updateTstock(req.body.cust.FName,req.body.cust.FItemID);
					var list = await dbCompanyRequestSvc.getCustomWareHouserInformationList(req.session.user.FUserID);
					return res.status(200).send(list.recordset);
				}	
			}
			
		} catch (	error) {
			return res.status(200).send({error:true,message:error.message});
		}
	})()
};

exports.deleteeCustomWareHouserInformationList=function(req,res){
	(async function () {
		try {
			await dbCompanyRequestSvc.deleteTitem(req.body.cust.FItemID);
			await dbCompanyRequestSvc.deleteTstock(req.body.cust.FItemID);
			await dbCompanyRequestSvc.deleteAstockCustom(req.body.cust.FStockID,req.body.cust.FUserID);
			var list = await dbCompanyRequestSvc.getCustomWareHouserInformationList(req.session.user.FUserID);
			return res.status(200).send(list.recordset);
		} catch (error) {
			return res.status(200).send({error:true,message:error.message});
		}
	})()
};


exports.getDoctorInformationList=function(req,res){
	(async function () {
		try {
			//获取医生信息
			var list = await dbCompanyRequestSvc.getDoctorInformationList(req.session.user.FUserID);
			//获取医院信息
			var fname_ = await dbCompanyRequestSvc.getHospitalFname(req.session.user.FUserID,req.session.user.FCustID);
			return res.status(200).send([list.recordset,fname_.recordset]);
		} catch (error) {
			return res.status(200).send({error:true,message:error.message});
		}
	})()
};