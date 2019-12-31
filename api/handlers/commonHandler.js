'use strict';

const dbCommonSvc = require('../dbservices/dbCommonSvc')
var Promise = require('Promise').default
var fs = require("fs")
var UUID = require('node-uuid')
exports.getUserList = function (req, res) {
	(async function () {
		try {
			var list = await dbCommonSvc.getUserList(req.session.user.Domain);
			return res.status(200).send(list.recordset);
		} catch (error) {
			return res.status(200).send({ error: true, message: error.message });
		}
	})()
};

exports.addEditUser = function (req, res) {
	(async function () {
		try {
			var list = await dbCommonSvc.addUser(req.body.user);
			return res.status(200).send(list.recordset);
		} catch (error) {
			return res.status(200).send({ error: true, message: error.message });
		}
	})()
};
exports.getDoctorList = function (req, res) {
	(async function () {
		try {
			var list = await dbCommonSvc.getDoctorList(req.session.user.FUserID);
			return res.status(200).send(list.recordset);
		} catch (error) {
			return res.status(200).send({ error: true, message: error.message });
		}
	})()
};
/**
 * 
 * 查询代理商所有电子证书
 * @author  Frank
 * @version v1.1.1
 * @event 2019-06-10
 * 
 */
exports.getElectronicCertificate = function (req, res) {
	(async function () {
		try {
			var list = await dbCommonSvc.getElectronicCertificate(req.session.user.FUserID);
			return res.status(200).send(list.recordset);
		} catch (error) {
			return res.status(200).send({ error: true, message: error.message });
		}
	})()
};

exports.getHospitalList = function (req, res) {
	(async function () {
		try {
			var list = await dbCommonSvc.getHospitalList(req.session.user.FUserID);
			return res.status(200).send(list.recordset);
		} catch (error) {
			return res.status(200).send({ error: true, message: error.message });
		}
	})()
};
exports.getProductTypeList = function (req, res) {
	(async function () {
		try {
			var list = await dbCommonSvc.getProductTypeList();
			return res.status(200).send(list.recordset);
		} catch (error) {
			return res.status(200).send({ error: true, message: error.message });
		}
	})()
};
exports.getListByCategories = function (req, res) {
	(async function () {
		try {
			var list = await dbCommonSvc.getListByCategories(req.session.user.FUserID, req.body.categories);
			return res.status(200).send(list.recordsets);
		} catch (error) {
			return res.status(200).send({ error: true, message: error.message });
		}
	})()
};
exports.deleteUser = function (req, res) {
	(async function () {
		try {
			await dbCommonSvc.deleteUserProfile(req.body.user.UserID);
			var list = await dbCommonSvc.getUserList(req.session.user.Domain);
			return res.status(200).send(list.recordset);
		} catch (error) {
			return res.status(200).send({ error: true, message: error.message });
		}
	})()
};
exports.getPerformanceReport = function (req, res) {
	(async function () {
		try {
			let report = await dbCommonSvc.getPerformanceReporterList(req.body.date);
			return res.status(200).send(report);
		} catch (error) {
			return res.status(200).send({ error: true, message: error.message });
		}
	})()
};

/* exports.uploadFile=function(req, res) {
	  var dataFiles = req.body.dataFiles;
	  console.log(dataFiles);
}; */

exports.uploadFile = function (req, res) {
	(async function () {
		try {
			if (Object.keys(req.files).length == 0) {
				throw new Error('No files were uploaded.');
			}
			var feedbackNumber = req.query.feedbackNumber;
			var date = new Date();
			var year = date.getFullYear();
			var month = date.getMonth() + 1;
			var day = date.getDate();
			if (month >= 1 && month <= 9) {
				month = "0" + month;
			}
			if (day >= 0 && day <= 9) {
				day = "0" + day;
			}
			var fileFoldFirst = './upload/' + year + '/';
			var fileFoldSecond = './upload/' + year + '/' + month + '/';
			var fileFoldThird = './upload/' + year + '/' + month + '/' + day + '/';
			try {
				if (!fs.existsSync('./upload/${year}/')) {
					fs.mkdirSync(fileFoldFirst, function (err) {
						return res.status(400).send({ error: true, message: '文件夹创建失败！' });
					})
				}
				if (!fs.existsSync('./upload/${year}/${month}/')) {
					fs.mkdirSync(fileFoldSecond, function (err) {
						return res.status(400).send({ error: true, message: '文件夹创建失败！' });
					})
				}
				if (!fs.existsSync('./upload/${year}/${month}/${day}/')) {
					fs.mkdirSync(fileFoldThird, function (err) {
						return res.status(400).send({ error: true, message: '文件夹创建失败！' });
					})
				}
			} catch (error) {
				console.log("上传了多张图片");
			}
			var uuid1 = UUID.v1();
			uuid1 = uuid1 + '.JPEG';
			await req.files.file.mv(fileFoldThird + uuid1);
			return res.status(200).send({ confirm: "successful" });
		} catch (error) {
			return res.status(400).send({ error: true, message: error.message });
		}
	})()
};

exports.getNavigationMenu = function (req, res) {
	(async function () {
		try {
			let report = await dbCommonSvc.getNavigationMenuList();
			return res.status(200).send(report);
		} catch (error) {
			return res.status(200).send({ error: true, message: error.message });
		}
	})()
};
exports.viewLog = function (req, res) {
	var lineReader = require('reverse-line-reader');
	var maxLine = 300;
	var i = 0, logs = [];
	let file = 'logs/filelog-error.log';
	if (req.body.type === 'info-log') {
		file = 'logs/filelog-info.log'
	}
	var promise = new Promise(function (resolve, reject) {
		try {
			lineReader.eachLine(file, function (line, last) {
				console.log(line);
				console.log(last);
				try {
					logs.push(JSON.parse(line));
				} catch (error) {
					console.log("JSON.parse error:" + error + ", Skipped the log in line " + (i + 1) + ":" + line);
				}
				i++;
				if (i === maxLine || last) {
					resolve(logs);
					return false; // stop reading
				}
			});
		} catch (error) {
			reject(error);
		}
	});
	promise.then(function (logs) {
		return res.status(200).send(logs);
	}, function (err) {
		return res.status(400).send({ error: true, message: err });
	})
};

exports.selectPerByPerName = function (req, res) {
	(async function () {
		try {
			var list = await dbCommonSvc.selectPerByPerName(req.body.personSle);
			return res.status(200).send(list.recordset);
		} catch (error) {
			return res.status(200).send({ error: true, message: error.message });
		}
	})()
};

exports.selectProjectNum = function (req, res) {
	(async function () {
		try {
			var list = await dbCommonSvc.selectProjectNum(req.body.proNum);
			return res.status(200).send(list.recordset);
		} catch (error) {
			return res.status(200).send({ error: true, message: error.message });
		}
	})()
};

exports.selectDepartment = function (req, res) {
	(async function () {
		try {
			var list = await dbCommonSvc.selectDepartment();
			return res.status(200).send(list.recordset);
		} catch (error) {
			return res.status(200).send({ error: true, message: error.message });
		}
	})()
};

exports.selectCostCenter = function (req, res) {
	(async function () {
		try {
			var list = await dbCommonSvc.selectCostCenter(req.body.costCenterNum);
			return res.status(200).send(list.recordset);
		} catch (error) {
			return res.status(200).send({ error: true, message: error.message });
		}
	})()
};

// 获取差旅申请申请号
exports.GetNewRequestNo = function (req, res) {
	(async function () {
		try {
			var list = await dbCommonSvc.GetNewRequestNo(req.body.processTypeCode);
			return res.status(200).send(list.recordset);
		} catch (error) {
			return res.status(200).send({ error: true, message: error.message });
		}
	})()
};

//附件上传
exports.saveFileTravelRequest = function (req, res) {
	(async function () {
		try {
			var list = '';
			var uuid1 = UUID.v1();
			var dataBuffer = Buffer.from(req.body.base64Str, 'base64');
			var fileName = req.body.fileName;
			var description = req.body.description;
			var id = req.body.id;
			var processID = req.body.processID;
			if (req.body.base64Str == '' || req.body.base64Str == undefined) {//The step is update file
				var fileurl = req.body.fileurl;
				list = await dbCommonSvc.saveTravelRequestFile(fileurl, processID, fileName, description, req.body.updateProcessID, id);
			} else {//The step is create file
				fs.writeFile("./upload/" + uuid1 + fileName, dataBuffer, function (err) {
					if (err) {
						res.send(err);
					} else {
						res.send("保存成功!");
					}
				});
				list = await dbCommonSvc.saveTravelRequestFile(uuid1 + fileName, processID, fileName, description, req.body.updateProcessID, id);
			}
			return res.status(200).send(list.recordset);
		} catch (error) {
			return res.status(200).send({ error: true, message: error.message });
		}
	})()
};


//附件下载
exports.downLoadFile = function (req, res) {
	(async function () {
		try {
			res.setHeader('Content-type', 'application/octet-stream');
			res.setHeader('Content-Disposition', 'attachment;filename=' + req.query.fileName);
			var fileStream = fs.createReadStream('./upload/' + req.query.fileurl);
			fileStream.on('data', function (data) {
				res.write(data, 'binary');
			});
			fileStream.on('end', function () { res.end(); });


		} catch (error) {
			return res.status(200).send({ error: true, message: error.message });
		}
	})()
};

//申请保存
exports.saveAllTravelRequest = function (req, res) {
	(async function () {
		try {

			// save cn_process
			var list = await dbCommonSvc.saveAllTravelRequestCnProcess(req.body.cnProcess, req.body.updateProcessID);
			if (list.recordset[0].processID != null && list.recordset[0].processID != '') {
				await dbCommonSvc.saveAllTravelRequestCNTravelRequestHeader(req.body.CN_TravelRequestHeader, list.recordset[0].processID, req.body.updateProcessID);
				for (var i = 0; i < req.body.CN_TravelRequestDetailLength; i++) {
					await dbCommonSvc.saveAllTravelRequestCNTravelRequestDetail(req.body.CN_TravelRequestDetail[i], list.recordset[0].processID, req.body.updateProcessID);
				}
			}
			return res.status(200).send(list.recordset);
		} catch (error) {
			return res.status(200).send({ error: true, message: error.message });
		}
	})()
};

//我的申请
exports.getMyApplyList = function (req, res) {
	(async function () {
		try {
			var list = await dbCommonSvc.getMyApplyList(req.body.selectCond, req.body.selectInput);
			return res.status(200).send(list.recordset);
		} catch (error) {
			return res.status(200).send({ error: true, message: error.message });
		}
	})()
};


// 获取差旅申请号
exports.getTraReqNoList = function (req, res) {
	(async function () {
		try {
			var list = await dbCommonSvc.getTraReqNoList(req.body.selectCond, req.body.selectInput);
			return res.status(200).send(list.recordset);
		} catch (error) {
			return res.status(200).send({ error: true, message: error.message });
		}
	})()
};

// 币种
exports.getCurrencyList = function (req, res) {
	(async function () {
		try {
			var list = await dbCommonSvc.getCurrencyList(req.body.bibie);
			return res.status(200).send(list.recordset);
		} catch (error) {
			return res.status(200).send({ error: true, message: error.message });
		}
	})()
};


// 根据地址栏processID获取差旅申请头部信息
exports.selectHeaderInfoByProcessID = function (req, res) {
	(async function () {
		try {
			var list = await dbCommonSvc.selectHeaderInfoByProcessID(req.body.processID);
			return res.status(200).send(list.recordset);
		} catch (error) {
			return res.status(200).send({ error: true, message: error.message });
		}
	})()
};


// 根据地址栏processID获取差旅申请明细信息
exports.selectDetailInfoByProcessID = function (req, res) {
	(async function () {
		try {
			var list = await dbCommonSvc.selectDetailInfoByProcessID(req.body.processID);
			return res.status(200).send(list.recordset);
		} catch (error) {
			return res.status(200).send({ error: true, message: error.message });
		}
	})()
};

// 根据地址栏processID获取差旅附件信息
exports.selectFileInfoByProcessID = function (req, res) {
	(async function () {
		try {
			var list = await dbCommonSvc.selectFileInfoByProcessID(req.body.processID);
			return res.status(200).send(list.recordset);
		} catch (error) {
			return res.status(200).send({ error: true, message: error.message });
		}
	})()
};

// 删除差旅申请数据
exports.deleteTravelRequestData = function (req, res) {
	(async function () {
		try {
			if (req.body.processtypecode == 'TRE') {
				await dbCommonSvc.deleteTravelRequestDataCN_Process(req.body.id);//delete CN_Process
				await dbCommonSvc.deleteTravelRequestDataCN_TravelRequestHeader(req.body.id);//delete CN_TravelRequestHeader
				await dbCommonSvc.deleteTravelRequestDataCN_TravelRequestDetail(req.body.id);//delete CN_TravelRequestDetail
				await dbCommonSvc.deleteTravelRequestDataCN_Attachment(req.body.id);//delete CN_Attachment    But this is a question is that survice data have no delete
			}else if (req.body.processtypecode == 'TEX'){
				await dbCommonSvc.deleteTravelRequestDataCN_Process(req.body.id);//delete CN_Process
				await dbCommonSvc.deleteTravelRequestDataCN_ClaimHeader(req.body.id);//delete CN_ClaimHeader
				await dbCommonSvc.deleteTravelRequestDataCN_ClaimDetail(req.body.id);//delete CN_ClaimDetail
				await dbCommonSvc.deleteTravelRequestDataCN_Attachment(req.body.id);//delete CN_Attachment    But this is a question is that survice data have no delete
			}
			var list = await dbCommonSvc.selectFileInfoByProcessID(req.body.id);//no use
			return res.status(200).send(list.recordset);
		} catch (error) {
			return res.status(200).send({ error: true, message: error.message });
		}
	})()
};


// 费用类型
exports.selectExpenseTypeList = function (req, res) {
	(async function () {
		try {
			var list = await dbCommonSvc.selectExpenseTypeList(req.body.expenseType);//no use
			return res.status(200).send(list.recordset);
		} catch (error) {
			return res.status(200).send({ error: true, message: error.message });
		}
	})()
};

// 税率
exports.selectCnTaxTypeList = function (req, res) {
	(async function () {
		try {
			var list = await dbCommonSvc.selectCnTaxTypeList(req.body.expenseTypeDataInput);//no use
			return res.status(200).send(list.recordset);
		} catch (error) {
			return res.status(200).send({ error: true, message: error.message });
		}
	})()
};


//报销保存
exports.saveAllTravelExpense = function (req, res) {
	(async function () {
		try {

			// save cn_process
			var list = await dbCommonSvc.saveAllTravelRequestCnProcess(req.body.cnProcess, req.body.updateProcessID);
			if (list.recordset[0].processID != null && list.recordset[0].processID != '') {
				// save CN_ClaimHeader
				await dbCommonSvc.saveAllTravelExpenseCNClaimHeader(req.body.CN_ClaimHeader, list.recordset[0].processID, req.body.updateProcessID);
				for (var i = 0; i < req.body.CN_ClaimDetailLength; i++) {
					// save CN_ClaimDetail
					await dbCommonSvc.saveAllTravelExpenseCNClaimDetail(req.body.CN_ClaimDetail[i], list.recordset[0].processID, req.body.updateProcessID);
				}
			}
			return res.status(200).send(list.recordset);
		} catch (error) {
			return res.status(200).send({ error: true, message: error.message });
		}
	})()
};

// 根据地址栏processID获取差旅报销头部信息
exports.selectTEXHeaderInfoByProcessID = function (req, res) {
	(async function () {
		try {
			var list = await dbCommonSvc.selectTEXHeaderInfoByProcessID(req.body.processID);
			return res.status(200).send(list.recordset);
		} catch (error) {
			return res.status(200).send({ error: true, message: error.message });
		}
	})()
};


// 根据地址栏processID获取差旅报销Detail信息
exports.selectDetailTEXInfoByProcessID = function (req, res) {
	(async function () {
		try {
			var list = await dbCommonSvc.selectDetailTEXInfoByProcessID(req.body.processID);
			return res.status(200).send(list.recordset);
		} catch (error) {
			return res.status(200).send({ error: true, message: error.message });
		}
	})()
};
