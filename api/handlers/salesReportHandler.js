'use strict';

const dbSalesReportSvc=require('../dbservices/dbSalesReportSvc')
var Promise = require('Promise').default
var fs = require("fs")
var stream = require('stream')
var UUID = require('node-uuid')
exports.getMonthlySalesDifferencesComparisonList=function(req,res){
	(async function () {
		try {
			var list = await dbSalesReportSvc.getMonthlySalesDifferencesComparisonList(req.session.user.FUserID,req.session.user.iEmpId,req.session.user.UserType,req.body.productTypeName,req.body.queryYear,req.body.queryMonth);
			return res.status(200).send(list.recordset);
		} catch (error) {
			return res.status(200).send({error:true,message:error.message});
		}
	})()
};


exports.getMonthlySalesDifferencesComparisonExcel=function(req,res){
	var nodeExcel = require('excel-export');
	(async function () {
		try {
            var list = await dbSalesReportSvc.getMonthlySalesDifferencesComparisonList(req.session.user.FUserID,req.session.user.iEmpId,req.session.user.UserType,req.query.ProductTypeName,parseInt(req.query.queryYear),parseInt(req.query.queryMonth));
            var conf={};
			conf.cols = [];
			conf.cols.push({caption:'大区 ' 	,captionStyleIndex: 1, type:'string' }); 
			conf.cols.push({caption:'小区  '	,captionStyleIndex: 1, type:'string' }); 
			conf.cols.push({caption:'销售代表 ' 	,captionStyleIndex: 1, type:'string' }); 
            conf.cols.push({caption:'分销商简称' 	,captionStyleIndex: 1, type:'string' }); 
            conf.cols.push({caption:'分销商名称' 	,captionStyleIndex: 1, type:'string' }); 
			conf.cols.push({caption:'医院编码 ' 	,captionStyleIndex: 1, type:'string' }); 
            conf.cols.push({caption:'医院名称'	,captionStyleIndex: 1, type:'string' });
            conf.cols.push({caption:'报表数' 	,captionStyleIndex: 1, type:'number' });  
			conf.cols.push({caption:'发票数' 	,captionStyleIndex: 1, type:'number' }); 
			conf.cols.push({caption:'差值' 	,captionStyleIndex: 1, type:'number' }); 
			conf.cols.push({caption:'备注  '	,captionStyleIndex: 1, type:'string' }); 
			conf.rows = [];
			for(var i=0;i<list.recordset.length;i++){
				var row = [];
				row.push(list.recordset[i].BigAreaName);
				row.push(list.recordset[i].AreaName);
				row.push(list.recordset[i].FEmpName);
				row.push(list.recordset[i].FCustName);
				row.push(list.recordset[i].FFullCustName);
                row.push(list.recordset[i].FHospNum);
                row.push(list.recordset[i].FHospName);
                row.push(list.recordset[i].FSaleQty);
				row.push(list.recordset[i].FInvoiceQty);
                row.push(list.recordset[i].FDiffQty);
				row.push(list.recordset[i].FvNewNote);
				conf.rows.push(row);
			}	
			var result = nodeExcel.execute(conf);
			res.setHeader('Content-Type', 'application/vnd.openxmlformats');
			res.setHeader("Content-Disposition", "attachment; filename=" + "MonthSalesDifferencesComparison.xlsx");
			res.end(result, 'binary');   
		} catch (error) {
			return res.status(200).send({error:true,message:error.message});
		}
	})()
};


exports.getYearSaleReportList=function(req,res){
	(async function () {
		try {
			let report = await dbSalesReportSvc.getPerformanceReporterList(req.body.date);
			var positionName = "";
			if(req.session.user.userName="administrator"){
				positionName = "管理员";
			} else {
				positionName = req.session.user.positionName;
			}
			let SFE_ImplantData = await dbSalesReportSvc.getSFE_ImplantData(req.body.date,req.body.productType,positionName,req.session.user.UserType,req.session.user.iEmpId);
			report.SFE_ImplantData = SFE_ImplantData.recordset;
			report.selectDate = req.body.date;
			report.selectProductType = req.body.productType;
			let yearTotal = await dbSalesReportSvc.getYearTotal(req.body.date,req.body.productType,positionName,req.session.user.UserType,req.session.user.iEmpId);
			report.yearTotal = yearTotal.recordset;
			return res.status(200).send(report);
		} catch (error) {
			return res.status(200).send({error:true,message:error.message});
		}
	})()
};


exports.getYearSaleListForExcel=function(req,res){
	const cfgUtil=require('../config/util.js')
	var nodeExcel = require('excel-export');	
	(async function () {
		try {			
			if(req.query.date==undefined) req.query.date = '2019'; 
			if(req.query.productType==undefined) req.query.productType = '支架系统'; 
			var positionName = "";
			if(req.session.user.userName="administrator"){
				positionName = "管理员";
			} else {
				positionName = req.session.user.positionName;
			}
			var list = await dbSalesReportSvc.getSFE_ImplantData(req.query.date,req.query.productType,positionName,req.session.user.UserType,req.session.user.iEmpId);
			if (list.recordset != undefined) {
				var conf={};
				conf.cols = [];
				conf.cols.push({caption:'总监',captionStyleIndex: 1, type:'string' }); 
				conf.cols.push({caption:'大区',	captionStyleIndex: 1, type:'string' }); 
				conf.cols.push({caption:'大区经理' 	,captionStyleIndex: 1, type:'string' }); 
				conf.cols.push({caption:'小区' 	,captionStyleIndex: 1, type:'string' }); 
				conf.cols.push({caption:'小区经理' 	,captionStyleIndex: 1, type:'string' }); 
				conf.cols.push({caption:'代表'	,captionStyleIndex: 1, type:'string' }); 
				conf.cols.push({caption:'省' 	,captionStyleIndex: 1, type:'string' }); 
				conf.cols.push({caption:'市' 	,captionStyleIndex: 1, type:'string' }); 
				conf.cols.push({caption:'分销商编码' 	,captionStyleIndex: 1, type:'string' }); 
				conf.cols.push({caption:'分销商简称' 	,captionStyleIndex: 1, type:'string' }); 
				conf.cols.push({caption:'分销商名称' 	,captionStyleIndex: 1, type:'string' }); 
				conf.cols.push({caption:'医院辅助编码' 	,captionStyleIndex: 1, type:'string' }); 
				conf.cols.push({caption:'医院编码' 	,captionStyleIndex: 1, type:'string' }); 
				conf.cols.push({caption:'医院名称' 	,captionStyleIndex: 1, type:'string' }); 
				conf.cols.push({caption:'医院等级' 	,captionStyleIndex: 1, type:'string' }); 
				conf.cols.push({caption:'一月' 	,captionStyleIndex: 1, type:'number' }); 
				conf.cols.push({caption:'二月' 	,captionStyleIndex: 1, type:'number' }); 
				conf.cols.push({caption:'三月' 	,captionStyleIndex: 1, type:'number' }); 
				conf.cols.push({caption:'四月' 	,captionStyleIndex: 1, type:'number' }); 
				conf.cols.push({caption:'五月' 	,captionStyleIndex: 1, type:'number' }); 
				conf.cols.push({caption:'六月' 	,captionStyleIndex: 1, type:'number' }); 
				conf.cols.push({caption:'七月' 	,captionStyleIndex: 1, type:'number' }); 
				conf.cols.push({caption:'八月' 	,captionStyleIndex: 1, type:'number' }); 
				conf.cols.push({caption:'九月' 	,captionStyleIndex: 1, type:'number' }); 
				conf.cols.push({caption:'十月' 	,captionStyleIndex: 1, type:'number' }); 
				conf.cols.push({caption:'十一月' 	,captionStyleIndex: 1, type:'number' }); 
				conf.cols.push({caption:'十二月' 	,captionStyleIndex: 1, type:'number' }); 
				conf.cols.push({caption:'合计' 	,captionStyleIndex: 1, type:'number' }); 
				conf.rows = [];
				for(var i=0;i<list.recordset.length;i++){
					var row = [];
					row.push(list.recordset[i].FDirector);
					row.push(list.recordset[i].FBigAreaName);
					row.push(list.recordset[i].FBigAreaMgr);
					row.push(list.recordset[i].FAreaName);
					row.push(list.recordset[i].FMgrName);
					row.push(list.recordset[i].FSalerName);
					row.push(list.recordset[i].FProvince);
					row.push(list.recordset[i].FCity);
					row.push(list.recordset[i].FCustNum);
					row.push(list.recordset[i].FCustNameShort);
					row.push(list.recordset[i].FCustNameOk);
					row.push(list.recordset[i].FHospNum);
					row.push(list.recordset[i].FHospNumOk);
					row.push(list.recordset[i].FHospNameOk);
					row.push(list.recordset[i].FHospLevelName);
					row.push(list.recordset[i].F1);
					row.push(list.recordset[i].F2);
					row.push(list.recordset[i].F3);
					row.push(list.recordset[i].F4);
					row.push(list.recordset[i].F5);
					row.push(list.recordset[i].F6);
					row.push(list.recordset[i].F7);
					row.push(list.recordset[i].F8);
					row.push(list.recordset[i].F9);
					row.push(list.recordset[i].F10);
					row.push(list.recordset[i].F11);
					row.push(list.recordset[i].F12);
					row.push(list.recordset[i].FSumQty);
					conf.rows.push(row);
				}		
				var result = nodeExcel.execute(conf);
				res.setHeader('Content-Type', 'application/vnd.openxmlformats');
				res.setHeader("Content-Disposition", "attachment; filename=" + "yearSaleReport.xlsx");
				res.end(result, 'binary');
			}
		} catch (error) {
			return res.status(200).send({error:true,message:error.message});
		}
	})()
};

exports.getMonthSaleReportList=function(req,res){
	(async function () {
		try {
			let report = await dbSalesReportSvc.getPerformanceReporterList(req.body.date);
			let SFE_ImplantData = await dbSalesReportSvc.getMonthSaleList(req.body.date,req.body.productType,req.session.user.UserType,req.session.user.sDeptName,req.session.user.iEmpId);
			if (SFE_ImplantData.recordset == undefined) {
				report.SFE_ImplantData = [];
			} else {
				report.SFE_ImplantData = SFE_ImplantData.recordset;
			}
			report.selectDate = req.body.date;
			report.selectProductType = req.body.productType;
			//审核人和时间
			let peopleAndTime = await dbSalesReportSvc.getPeopleAndTime(req.body.date,req.body.productType);
			report.people = peopleAndTime.recordset;
			return res.status(200).send(report);
		} catch (error) {
			return res.status(200).send({error:true,message:error.message});
		}
	})()
};

exports.getMonthSaleListForExcel=function(req,res){
	const cfgUtil=require('../config/util.js')
	var nodeExcel = require('excel-export');	
	(async function () {
		try {			
			if(req.query.date==undefined) req.query.date = '2019年01月'; 
			if(req.query.productType==undefined) req.query.productType = '支架系统'; 
			var list = await dbSalesReportSvc.getMonthSaleList(req.query.date,req.query.productType,req.session.user.UserType,req.session.user.sDeptName,req.session.user.iEmpId);
			if (list.recordset != undefined) {
				var conf={};
				conf.cols = [];
				conf.cols.push({caption:'总监',captionStyleIndex: 1, type:'string' }); 
				conf.cols.push({caption:'大区',	captionStyleIndex: 1, type:'string' }); 
				conf.cols.push({caption:'大区经理' 	,captionStyleIndex: 1, type:'string' }); 
				conf.cols.push({caption:'小区' 	,captionStyleIndex: 1, type:'string' }); 
				conf.cols.push({caption:'小区经理' 	,captionStyleIndex: 1, type:'string' }); 
				conf.cols.push({caption:'销售代表'	,captionStyleIndex: 1, type:'string' }); 
				conf.cols.push({caption:'省' 	,captionStyleIndex: 1, type:'string' }); 
				conf.cols.push({caption:'市' 	,captionStyleIndex: 1, type:'string' }); 
				conf.cols.push({caption:'分销商编码' 	,captionStyleIndex: 1, type:'string' }); 
				conf.cols.push({caption:'分销商简称' 	,captionStyleIndex: 1, type:'string' }); 
				conf.cols.push({caption:'分销商名称' 	,captionStyleIndex: 1, type:'string' }); 
				conf.cols.push({caption:'医院辅助编码' 	,captionStyleIndex: 1, type:'string' }); 
				conf.cols.push({caption:'医院编码' 	,captionStyleIndex: 1, type:'string' }); 
				conf.cols.push({caption:'医院名称' 	,captionStyleIndex: 1, type:'string' }); 
				conf.cols.push({caption:'医院等级' 	,captionStyleIndex: 1, type:'string' }); 
				conf.cols.push({caption:'销量' 	,captionStyleIndex: 1, type:'string' }); 
				conf.cols.push({caption:'备注' 	,captionStyleIndex: 1, type:'string' }); 
				conf.cols.push({caption:'商务负责人' 	,captionStyleIndex: 1, type:'string' }); 
				conf.rows = [];
				for(var i=0;i<list.recordset.length;i++){
					var row = [];
					row.push(list.recordset[i].FDirectorName);
					row.push(list.recordset[i].FBigAreaName);
					row.push(list.recordset[i].FBigAreaMgrName);
					row.push(list.recordset[i].FAreaName);
					row.push(list.recordset[i].FMgrName);
					row.push(list.recordset[i].FSalerName);
					row.push(list.recordset[i].FProvince);
					row.push(list.recordset[i].FCity);
					row.push(list.recordset[i].FCustNum);
					row.push(list.recordset[i].FCustNameShort);
					row.push(list.recordset[i].FCustNameOk);
					row.push(list.recordset[i].FHospNum);
					row.push(list.recordset[i].FHospNumOk);
					row.push(list.recordset[i].FHospNameOk);
					row.push(list.recordset[i].FHospLevelName);
					row.push(list.recordset[i].FQty);
					row.push(list.recordset[i].FNote);
					row.push(list.recordset[i].price);
					conf.rows.push(row);
				}		
				var result = nodeExcel.execute(conf);
				res.setHeader('Content-Type', 'application/vnd.openxmlformats');
				res.setHeader("Content-Disposition", "attachment; filename=" + "MonthSaleReport.xlsx");
				res.end(result, 'binary');
			} 
		} catch (error) {
			return res.status(200).send({error:true,message:error.message});
		}
	})()
};