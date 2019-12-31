'use strict';

const sqlSvc = require("./sqlService");
//get user List
exports.getUserList = function (domain) {
  var stmt = "select * from dbo.UserDMSProfile";
  // var stmt = "select * from dbo.UserProfile where DOMAIN=@DOMAIN";
  let paramTypes = { DOMAIN: 'sql.VarChar(20)' };
  let paramValues = { DOMAIN: domain };
  return sqlSvc.sqlQuery(stmt, paramTypes, paramValues);
}

//user profile 
exports.getUserProfile = function (userName) {
  var stmt = "select * from dbo.UserDMSProfile where userName=@userName and isActive='1'";
  let paramTypes = { userName: 'sql.NVarChar(20)' };
  let paramValues = { userName: userName };
  return sqlSvc.sqlQuery(stmt, paramTypes, paramValues)
}


exports.getK3UserProfile = function (userName) {
  let stmt = ["exec JM_getK3UserProfile"];
  stmt.push(`'${userName}'`)
  return sqlSvc.sqlK3Query(stmt.join(" "))
}

exports.addUser = function (user) {
  //stmt will be something like: "exec JM_InsertOrUpdateUserProfile 'yd.zhu','朱亚东','BITSG','admin','1'"
  if (user.UserID == undefined || user.UserID == "undefined" || user.UserID == "") {
    user.UserID = 0;
  }
  let stmt = ["exec JM_InsertOrUpdateUserDMSProfile"];
  stmt.push(`${user.UserID},`),
    stmt.push(`'${user.userName}',`),
    stmt.push(`'${user.UserRole}',`),
    stmt.push(`'${user.isActive}'`)
  return sqlSvc.sqlQuery(stmt.join(" "))
}

exports.insertOrUpdateUserProfile = function (user) {
  var params = {
    UserID: { type: 'sql.VarChar(20)', value: user.UserID },
    userName: { type: 'sql.VarChar(3)', value: user.userName },
    Domain: { type: 'sql.VarChar(20)', value: user.Domain },
    UserRole: { type: 'sql.VarChar(20)', value: user.UserRole },
    isActive: { type: 'sql.Char(1)', value: user.isActive }
  }
  return sqlSvc.callStoredProcedure("dbo.JM_InsertOrUpdateUserDMSProfile", params);
}
exports.deleteUserProfile = function (userId) {
  var stmt = "delete from dbo.UserDMSProfile where UserID=@UserID";
  let paramTypes = { UserID: 'sql.VarChar(20)' };
  let paramValues = { UserID: userId };
  return sqlSvc.sqlQuery(stmt, paramTypes, paramValues)
}
exports.getPerformanceReporterList = function (param) {
  //dummy code
  let SFE_ImplantData = require("./../config/SFE_ImplantData.json");
  let salesPromotionData = require("./../config/salesPromotionData.json");
  let businessPrice = require("./../config/businessPrice.json");
  return { SFE_ImplantData: SFE_ImplantData, salesPromotionData: salesPromotionData, businessPrice: businessPrice, }
}

exports.getNavigationMenuList = function () {
  //dummy code
  let navigationMenu = require("./../config/navigationMenu.json");
  return { navigationMenu: navigationMenu }
}

exports.checkK3Login = function (username, password) {
  let stmt = ["exec Proc_k3UserLogin"];
  stmt.push(`'${username}',`),
    stmt.push(`'${password}'`)
  return sqlSvc.sqlK3Query(stmt.join(" "))
}

exports.getDoctorList = function (p_UserID) {
  /* var stmt = "SELECT a.FItemID AS FItemID, a.FNumber AS doctorNumber, a.FName AS doctorName, a.F_101 AS doctorBirthday, a.F_111 AS doctorSex";
  stmt += ", a.F_103 AS doctorPassport, a.F_104 AS doctorCard, a.F_105 AS workYear, a.F_107 AS phone, a.F_108 AS telephone";
  stmt += ", a.F_109 AS vipLebel, a.F_110 AS position, b.Fname AS affiliatedHospital"; */
  var stmt = "SELECT a.FName AS surgeon";
  stmt += " FROM t_Item_3002 a INNER JOIN t_Organization b ON a.F_112 = b.FItemID";
  stmt += " WHERE b.FItemID IN (SELECT FItemID FROM view_Cust WHERE FUserID = @p_UserID)";
  let paramTypes = {};
  let paramValues = {};
  if (p_UserID != undefined && p_UserID != "undefined" && p_UserID != "") {
    paramTypes["p_UserID"] = 'sql.Int';
    paramValues["p_UserID"] = p_UserID;
  }
  return sqlSvc.sqlK3Query(stmt, paramTypes, paramValues);
}

exports.getElectronicCertificate = function (p_UserID) {
  var stmt = "select fbillno +'|'+ fnote as electronicCertificate from t_BOSWqianzhang where  Fzt = 0 and  FBiller = @p_UserID";
  let paramTypes = {};
  let paramValues = {};
  if (p_UserID != undefined && p_UserID != "undefined" && p_UserID != "") {
    paramTypes["p_UserID"] = 'sql.Int';
    paramValues["p_UserID"] = p_UserID;
  }
  return sqlSvc.sqlK3Query(stmt, paramTypes, paramValues);
}

exports.getHospitalList = function (p_UserID) {
  var stmt = "SELECT t1.FName from (";
  stmt += "SELECT DISTINCT f.FitemID AS FCustID, d.FCustID AS FFxsID, e.FNumber AS FFxsNumber, ISNULL(tc.FName, e.FName) AS FFxsName, f.FNumber, f.FName, s.FName AS FYyDj, g.FUserID";
  stmt += " FROM dbo.a_FxsQxEntry c INNER JOIN dbo.a_FxsQx d ON c.FID = d.FID LEFT JOIN dbo.t_Organization e ON d.FCustID = e.FItemID INNER JOIN dbo.t_Organization f ON c.FCustID1 = f.FItemID";
  stmt += " LEFT JOIN dbo.t_SubMessage s ON f.F_113 = s.FInterID INNER JOIN t_User g ON g.FDescription = e.FNumber LEFT JOIN a_Cust tc ON d.FCustID = tc.FCustID AND tc.FDef = 1";
  stmt += " WHERE g.FUserID = @p_UserID AND c.FStop = 0 AND f.FitemID <> d.FCustID) t1 WHERE 1 = 1";
  let paramTypes = {};
  let paramValues = {};
  if (p_UserID != undefined && p_UserID != "undefined" && p_UserID != "") {
    paramTypes["p_UserID"] = 'sql.Int';
    paramValues["p_UserID"] = p_UserID;
  }
  return sqlSvc.sqlK3Query(stmt, paramTypes, paramValues);
}

exports.getProductTypeList = function (domain) {
  var stmt = "select FName from t_SubMessage where FTypeID = 10008 and left(FID,2)='11'";
  let paramTypes = {};
  let paramValues = {};
  return sqlSvc.sqlK3Query(stmt, paramTypes, paramValues);
}

exports.getListByCategories = function (FUserID, categories) {
  var categoriesString = categories.join(',');
  let stmt = ["exec JM_getCategoriesListProfile"];
  stmt.push(`'${categoriesString}',`),
    stmt.push(`${FUserID}`)
  return sqlSvc.sqlK3Query(stmt.join(" "))
}

//↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓
exports.selectPerByPerName = function (personSle) {
  let paramTypes = {};
  let paramValues = {};
  let stmt = "select domain+'\\'+logid+' - '+displayName as name,Domain,LoginID,DisplayName  from CN_Employees where 1=1"
  if (personSle != undefined && personSle != "undefined" && personSle != "") {
    stmt += " and (logid like '%'+@personSle+'%' or displayName like '%'+@personSle+'%')";
    paramTypes["personSle"] = 'sql.NVarChar(10)';
    paramValues["personSle"] = personSle;
  }
  return sqlSvc.sqlK3Query(stmt, paramTypes, paramValues);
}

exports.selectProjectNum = function (proNum) {
  let paramTypes = {};
  let paramValues = {};
  let stmt = "select OrderNo+' - '+OrderDesc as projectNum from CN_ProjectOrders where 1=1"
  if (proNum != undefined && proNum != "undefined" && proNum != "") {
    stmt += " and (OrderNo like '%'+@proNum+'%' or OrderDesc like '%'+@proNum+'%')";
    paramTypes["proNum"] = 'sql.NVarChar(10)';
    paramValues["proNum"] = proNum;
  }
  return sqlSvc.sqlK3Query(stmt, paramTypes, paramValues);
}


exports.selectDepartment = function () {
  let paramTypes = {};
  let paramValues = {};
  let stmt = "select CompanyCode+' - '+DepartmentName as department,CompanyCode,DepartmentCode,DepartmentName from SAP_Department where CompanyCode = 6200"
  return sqlSvc.sqlK3Query(stmt, paramTypes, paramValues);
}


exports.selectCostCenter = function (costCenterNum) {
  let paramTypes = {};
  let paramValues = {};
  let stmt = "select CostCenter+' - '+CostCenterDesc as costcenter from CN_CostCenter where CompanyCode = 6200"
  if (costCenterNum != undefined && costCenterNum != "undefined" && costCenterNum != "") {
    stmt += " and (CostCenter like '%'+@costCenterNum+'%' or CostCenterDesc like '%'+@costCenterNum+'%')";
    paramTypes["costCenterNum"] = 'sql.NVarChar(10)';
    paramValues["costCenterNum"] = costCenterNum;
  }
  return sqlSvc.sqlK3Query(stmt, paramTypes, paramValues);
}

exports.GetNewRequestNo = function (processTypeCode) {
  let stmt = ["exec GetNewRequestNo"];
  stmt.push(`6200,`)
  stmt.push(`'${processTypeCode}'`)
  return sqlSvc.sqlK3Query(stmt.join(" "))
}


exports.saveAllTravelRequestCnProcess = function (cn_process, updateProcessID) {
  let stmt = ["exec CN_ProcessAdd"];
  stmt.push(`'${cn_process.procesCode}',`)
  stmt.push(`'${cn_process.description}',`)
  stmt.push(`'${cn_process.requestNum}',`)
  stmt.push(`'${cn_process.creator}',`)
  stmt.push(`${cn_process.statusID},`)
  stmt.push(`'${cn_process.processTypeCode}',`)
  stmt.push(`${updateProcessID}`)
  return sqlSvc.sqlK3Query(stmt.join(" "))
}

exports.saveAllTravelRequestCNTravelRequestHeader = function (CN_TravelRequestHeader, processID, updateProcessID) {
  let stmt = ["exec CN_TravelRequestHeaderAdd"];
  stmt.push(`'${CN_TravelRequestHeader.costCenter}',`)
  stmt.push(`'${CN_TravelRequestHeader.companyCode}',`)
  stmt.push(`'${CN_TravelRequestHeader.currencyCode}',`)
  stmt.push(`'${CN_TravelRequestHeader.projectCode}',`)
  stmt.push(`'${CN_TravelRequestHeader.requestDate}',`)
  stmt.push(`'${CN_TravelRequestHeader.submitedBy}',`)
  stmt.push(`'${CN_TravelRequestHeader.requestedBy}',`)
  stmt.push(`'${CN_TravelRequestHeader.travelStartDate}',`)
  stmt.push(`'${CN_TravelRequestHeader.travelEndDate}',`)
  stmt.push(`'${CN_TravelRequestHeader.internalRemarks}',`)
  stmt.push(`${processID},`)
  stmt.push(`'${CN_TravelRequestHeader.totalAmount}',`)
  stmt.push(`'${CN_TravelRequestHeader.requestName}',`)
  stmt.push(`'${CN_TravelRequestHeader.travelPurpose}',`)
  stmt.push(`${CN_TravelRequestHeader.status},`)
  stmt.push(`'${CN_TravelRequestHeader.submitName}',`)
  stmt.push(`'${CN_TravelRequestHeader.requestNo}',`)
  stmt.push(`${CN_TravelRequestHeader.versionNo},`)
  stmt.push(`'${CN_TravelRequestHeader.totalAmountUSD}',`)
  stmt.push(`'${CN_TravelRequestHeader.departmentCode}',`)
  stmt.push(`'${CN_TravelRequestHeader.jobTitle}',`)
  stmt.push(`'${CN_TravelRequestHeader.processTypeCode}',`)
  stmt.push(`${updateProcessID}`)
  return sqlSvc.sqlK3Query(stmt.join(" "))
}

exports.saveAllTravelRequestCNTravelRequestDetail = function (CN_TravelRequestDetail, processID, updateProcessID) {
  let stmt = ["exec CN_TravelRequestDetailAdd"];
  stmt.push(`'${CN_TravelRequestDetail.beginDateDetail}',`)
  stmt.push(`'${CN_TravelRequestDetail.endDateDetail}',`)
  stmt.push(`${CN_TravelRequestDetail.fjp},`)
  stmt.push(`${CN_TravelRequestDetail.zs},`)
  stmt.push(`${CN_TravelRequestDetail.cccb},`)
  stmt.push(`${CN_TravelRequestDetail.qt},`)
  stmt.push(`'${CN_TravelRequestDetail.bz}',`)
  stmt.push(`${processID},`)
  stmt.push(`'${CN_TravelRequestDetail.cfd}',`)
  stmt.push(`'${CN_TravelRequestDetail.mdd}',`)
  stmt.push(`${CN_TravelRequestDetail.hcqclc},`)
  stmt.push(`${CN_TravelRequestDetail.jcwf},`)
  stmt.push(`${CN_TravelRequestDetail.ccdsnjt},`)
  stmt.push(`${CN_TravelRequestDetail.fyxj},`)
  stmt.push(`${CN_TravelRequestDetail.id}`)
  return sqlSvc.sqlK3Query(stmt.join(" "))
}

exports.saveTravelRequestFile = function (uuidFileName, processID, fileName, description, updateProcessID, id) {
  let stmt = ["exec CN_AttachmentAdd"];
  stmt.push(`'${uuidFileName}',`)
  stmt.push(`'${description}',`)
  stmt.push(`${processID},`)
  stmt.push(`'${fileName}',`)
  stmt.push(`${id}`)
  return sqlSvc.sqlK3Query(stmt.join(" "))
}

exports.getMyApplyList = function (selectCond, selectInput) {
  let paramTypes = {};
  let paramValues = {};
  let stmt = "select * from (";
  stmt += "select cnProcess.id as processID,cnProcess.folio as folio,cnProcess.description as description,cnProcess.creator as creator,cnTravelRequestHeader.requestdate as requestdate,";
  stmt += " cnProcess.processtypecode as processtypecode from CN_Process cnProcess";
  stmt += " left join CN_TravelRequestHeader cnTravelRequestHeader on cnTravelRequestHeader.ProcessID = cnProcess.id where 1=1 and cnProcess.processtypecode = 'TRE'";
  stmt += " union";
  stmt += " select cnProcess.id as processID,cnProcess.folio as folio,cnProcess.description as description,";
  stmt += " cnProcess.creator as creator,cN_ClaimHeader.submitDate as requestdate, ";
  stmt += " cnProcess.processtypecode as processtypecode ";
  stmt += " from CN_Process cnProcess ";
  stmt += " left join CN_ClaimHeader cN_ClaimHeader on cN_ClaimHeader.ProcessID = cnProcess.id ";
  stmt += " where 1=1 and cnProcess.processtypecode = 'TEX'";
  stmt += " ) myapply where 1=1";
  if (selectInput != undefined && selectInput != "undefined" && selectInput != "" && selectCond == 'all') {//全部和状态
    stmt += " and (folio like '%" + selectInput + "%' or description like '%" + selectInput + "%' or creator like '%" + selectInput + "%'  or processtypecode like '%" + selectInput + "%' )";
  } else if (selectInput != undefined && selectInput != "undefined" && selectInput != "" && selectCond == 'folio') {//申请号
    stmt += " and folio like '%" + selectInput + "%'";
  } else if (selectInput != undefined && selectInput != "undefined" && selectInput != "" && selectCond == 'description') {//备注
    stmt += " and description like '%" + selectInput + "%'";
  } else if (selectInput != undefined && selectInput != "undefined" && selectInput != "" && selectCond == 'creator') {//申请人
    stmt += " and creator like '%" + selectInput + "%'";
  } else if (selectInput != undefined && selectInput != "undefined" && selectInput != "" && selectCond == 'processtypecode') {//类型
    stmt += " and processtypecode like '%" + selectInput + "%'";
  }
  return sqlSvc.sqlK3Query(stmt, paramTypes, paramValues);
}

exports.getTraReqNoList = function (selectCond, selectInput) {
  let paramTypes = {};
  let paramValues = {};
  let stmt = "select cnProcess.ID,cnProcess.folio as folio,cnProcess.creator as creator,cnTravelRequestHeader.travelstartdate as travelstartdate,cnTravelRequestHeader.travelenddate as travelenddate,";
  stmt += " cnTravelRequestHeader.travelpurpose as travelpurpose,cnTravelRequestHeader.internalremarks as internalremarks, ";
  stmt += " cnTravelRequestHeader.requestdate as requestdate,cnTravelRequestHeader.departmentcode as departmentcode,cnTravelRequestHeader.projectcode as projectcode, ";
  stmt += " cnTravelRequestHeader.costcenter as costcenter,SUM(cnTravelRequestDetail.estcosttotal) as estcosttotal ";
  stmt += " from CN_Process cnProcess";
  stmt += " left join CN_TravelRequestHeader cnTravelRequestHeader on cnTravelRequestHeader.ProcessID = cnProcess.id ";
  stmt += " left join CN_TravelRequestDetail cnTravelRequestDetail on cnTravelRequestDetail.ProcessID = cnProcess.id ";
  stmt += " where 1=1 and cnProcess.processcode = 'TRE' ";
  if (selectInput != undefined && selectInput != "undefined" && selectInput != "" && selectCond == 'all') {//全部
    stmt += " and (cnProcess.folio like '%" + selectInput + "%' or cnProcess.description like '%" + selectInput + "%' or cnProcess.creator like '%" + selectInput + "%'  or cnProcess.processtypecode like '%" + selectInput + "%' )";
  } else if (selectInput != undefined && selectInput != "undefined" && selectInput != "" && selectCond == 'folio') {//申请号
    stmt += " and cnProcess.folio like '%" + selectInput + "%'";
  } else if (selectInput != undefined && selectInput != "undefined" && selectInput != "" && selectCond == 'creator') {//申请人
    stmt += " and cnProcess.creator like '%" + selectInput + "%'";
  } else if (selectInput != undefined && selectInput != "undefined" && selectInput != "" && selectCond == 'processtypecode') {//开始时间
    stmt += " and cnTravelRequestHeader.travelstartdate like '%" + selectInput + "%'";
  } else if (selectInput != undefined && selectInput != "undefined" && selectInput != "" && selectCond == 'processtypecode') {//结束时间
    stmt += " and cnTravelRequestHeader.travelenddate like '%" + selectInput + "%'";
  } else if (selectInput != undefined && selectInput != "undefined" && selectInput != "" && selectCond == 'processtypecode') {//目的
    stmt += " and cnTravelRequestHeader.travelpurpose like '%" + selectInput + "%'";
  } else if (selectInput != undefined && selectInput != "undefined" && selectInput != "" && selectCond == 'processtypecode') {//备注
    stmt += " and cnTravelRequestHeader.internalremarks like '%" + selectInput + "%'";
  }
  stmt += " group by cnProcess.ID,cnProcess.folio,cnProcess.creator,cnTravelRequestHeader.travelstartdate,";
  stmt += " cnTravelRequestHeader.travelenddate,cnTravelRequestHeader.travelpurpose,";
  stmt += " cnTravelRequestHeader.internalremarks,cnTravelRequestHeader.requestdate,";
  stmt += " cnTravelRequestHeader.departmentcode,cnTravelRequestHeader.projectcode,";
  stmt += " cnTravelRequestHeader.costcenter";
  return sqlSvc.sqlK3Query(stmt, paramTypes, paramValues);
}

// 币种
exports.getCurrencyList = function (bibie) {
  let paramTypes = {};
  let paramValues = {};
  let stmt = "select cc.currencycode+'-'+cc.currencyName as currency from CN_Currency cc where 1=1"
  if (bibie != undefined && bibie != "undefined" && bibie != "") {
    stmt += " and (cc.currencycode like '%" + bibie + "%' or cc.currencyName like '%" + bibie + "%')";
  }
  return sqlSvc.sqlK3Query(stmt, paramTypes, paramValues);
}

// 根据地址栏processID获取差旅申请头部信息
exports.selectHeaderInfoByProcessID = function (processID) {
  let paramTypes = {};
  let paramValues = {};
  let stmt = "select cN_Process.*,cN_TravelRequestHeader.* from CN_Process cN_Process";
  stmt += " left join CN_TravelRequestHeader cN_TravelRequestHeader on cN_TravelRequestHeader.processID = cN_Process.id";
  stmt += " where 1=1 and cN_Process.processcode = 'TRE'";
  if (processID != undefined && processID != "undefined" && processID != "") {//全部
    stmt += " and processID=@processID";
    paramTypes["processID"] = 'sql.Int';
    paramValues["processID"] = processID;
  }
  return sqlSvc.sqlK3Query(stmt, paramTypes, paramValues);
}


exports.selectDetailInfoByProcessID = function (processID) {
  let paramTypes = {};
  let paramValues = {};
  let stmt = "select * from CN_TravelRequestDetail ";
  stmt += " where 1=1";
  if (processID != undefined && processID != "undefined" && processID != "") {//全部
    stmt += " and processID=@processID";
    paramTypes["processID"] = 'sql.Int';
    paramValues["processID"] = processID;
  }
  return sqlSvc.sqlK3Query(stmt, paramTypes, paramValues);
}

exports.selectFileInfoByProcessID = function (processID) {
  let paramTypes = {};
  let paramValues = {};
  let stmt = "select * from CN_Attachment ";
  stmt += " where 1=1";
  if (processID != undefined && processID != "undefined" && processID != "") {//全部
    stmt += " and processID=@processID";
    paramTypes["processID"] = 'sql.Int';
    paramValues["processID"] = processID;
  }
  return sqlSvc.sqlK3Query(stmt, paramTypes, paramValues);
}

exports.deleteTravelRequestDataCN_Process = function (id) {
  let paramTypes = {};
  let paramValues = {};
  let stmt = "delete from CN_Process ";
  stmt += " where 1=1";
  if (id != undefined && id != "undefined" && id != "") {
    stmt += " and ID=@id";
    paramTypes["id"] = 'sql.Int';
    paramValues["id"] = id;
  }
  return sqlSvc.sqlK3Query(stmt, paramTypes, paramValues);
}

exports.deleteTravelRequestDataCN_TravelRequestHeader = function (id) {
  let paramTypes = {};
  let paramValues = {};
  let stmt = "delete from CN_TravelRequestHeader ";
  stmt += " where 1=1";
  if (id != undefined && id != "undefined" && id != "") {
    stmt += " and ProcessID=@id";
    paramTypes["id"] = 'sql.Int';
    paramValues["id"] = id;
  }
  return sqlSvc.sqlK3Query(stmt, paramTypes, paramValues);
}

exports.deleteTravelRequestDataCN_ClaimHeader = function (id) {
  let paramTypes = {};
  let paramValues = {};
  let stmt = "delete from CN_ClaimHeader ";
  stmt += " where 1=1";
  if (id != undefined && id != "undefined" && id != "") {
    stmt += " and ProcessID=@id";
    paramTypes["id"] = 'sql.Int';
    paramValues["id"] = id;
  }
  return sqlSvc.sqlK3Query(stmt, paramTypes, paramValues);
}

exports.deleteTravelRequestDataCN_TravelRequestDetail = function (id) {
  let paramTypes = {};
  let paramValues = {};
  let stmt = "delete from CN_TravelRequestDetail ";
  stmt += " where 1=1";
  if (id != undefined && id != "undefined" && id != "") {
    stmt += " and ProcessID=@id";
    paramTypes["id"] = 'sql.Int';
    paramValues["id"] = id;
  }
  return sqlSvc.sqlK3Query(stmt, paramTypes, paramValues);
}

exports.deleteTravelRequestDataCN_ClaimDetail = function (id) {
  let paramTypes = {};
  let paramValues = {};
  let stmt = "delete from CN_ClaimDetail ";
  stmt += " where 1=1";
  if (id != undefined && id != "undefined" && id != "") {
    stmt += " and ProcessID=@id";
    paramTypes["id"] = 'sql.Int';
    paramValues["id"] = id;
  }
  return sqlSvc.sqlK3Query(stmt, paramTypes, paramValues);
}


exports.deleteTravelRequestDataCN_Attachment = function (id) {
  let paramTypes = {};
  let paramValues = {};
  let stmt = "delete from CN_Attachment ";
  stmt += " where 1=1";
  if (id != undefined && id != "undefined" && id != "") {
    stmt += " and ProcessID=@id";
    paramTypes["id"] = 'sql.Int';
    paramValues["id"] = id;
  }
  return sqlSvc.sqlK3Query(stmt, paramTypes, paramValues);
}

// 费用类别
exports.selectExpenseTypeList = function (expenseType) {
  let paramTypes = {};
  let paramValues = {};
  let stmt = "select processtypecode+' - '+expensetypename as expenseType  from CN_ExpenseType where ExpenseGroupCode = 'T' and 1=1";
  if (expenseType != undefined && expenseType != "undefined" && expenseType != "") {
    stmt += " and (processtypecode like '%" + expenseType + "%' or expensetypename like '%" + expenseType + "%')";
  }
  return sqlSvc.sqlK3Query(stmt, paramTypes, paramValues);
}

// 税率
exports.selectCnTaxTypeList = function (expenseTypeDataInput) {
  let paramTypes = {};
  let paramValues = {};
  let stmt = "select taxcode+' - '+description as cnTax from CN_Tax where 1=1";
  if (expenseTypeDataInput != undefined && expenseTypeDataInput != "undefined" && expenseTypeDataInput != "") {
    stmt += " and (taxcode like '%" + expenseTypeDataInput + "%' or description like '%" + expenseTypeDataInput + "%')";
  }
  return sqlSvc.sqlK3Query(stmt, paramTypes, paramValues);
}

// save CN_ClaimHeader
exports.saveAllTravelExpenseCNClaimHeader = function (CN_ClaimHeader, processID, updateProcessID) {
  let stmt = ["exec CN_TravelExpenseHeaderAdd"];
  stmt.push(`'${CN_ClaimHeader.submitedBy}',`)
  stmt.push(`'${CN_ClaimHeader.requestBy}',`)
  stmt.push(`'${CN_ClaimHeader.submitDate}',`)
  stmt.push(`'${CN_ClaimHeader.costCenter}',`)
  stmt.push(`'${CN_ClaimHeader.companyCode}',`)

  stmt.push(`'${CN_ClaimHeader.paymentCurrency}',`)
  stmt.push(`'${CN_ClaimHeader.requestName}',`)
  stmt.push(`'${CN_ClaimHeader.processTypeCode}',`)
  stmt.push(`${CN_ClaimHeader.statusID},`)
  stmt.push(`${processID},`)

  stmt.push(`${CN_ClaimHeader.travelRequestID},`)
  stmt.push(`'${CN_ClaimHeader.remarks}',`)
  stmt.push(`'${CN_ClaimHeader.requestNo}',`)
  stmt.push(`${CN_ClaimHeader.versionNo},`)

  stmt.push(`${updateProcessID}`)
  return sqlSvc.sqlK3Query(stmt.join(" "))
}

// save CN_ClaimDetail
exports.saveAllTravelExpenseCNClaimDetail = function (CN_ClaimDetail, processID, updateProcessID) {
  let stmt = ["exec CN_TravelExpenseDetailAdd"];
  stmt.push(`'${CN_ClaimDetail.rcptRef}',`)
  stmt.push(`'${CN_ClaimDetail.travelFrom}',`)
  stmt.push(`'${CN_ClaimDetail.dateFrom}',`)
  stmt.push(`'${CN_ClaimDetail.dateTo}',`)
  stmt.push(`'${CN_ClaimDetail.expenseTypeCode}',`)

  stmt.push(`'${CN_ClaimDetail.invoiceType}',`)
  stmt.push(`'${CN_ClaimDetail.amount}',`)
  stmt.push(`'${CN_ClaimDetail.currency}',`)
  stmt.push(`'${CN_ClaimDetail.taxCode}',`)
  stmt.push(`'${CN_ClaimDetail.appliedAmt}',`)

  stmt.push(`'${CN_ClaimDetail.appliedCNY}',`)
  stmt.push(`'${CN_ClaimDetail.xRate}',`)
  stmt.push(`'${CN_ClaimDetail.amountCNY}',`)
  stmt.push(`${CN_ClaimDetail.invoiceQty},`)
  stmt.push(`${processID},`)

  stmt.push(`'${CN_ClaimDetail.IsElectroniclInovice}',`)
  stmt.push(`'${CN_ClaimDetail.ElectronicInvoice}',`)
  stmt.push(`'${CN_ClaimDetail.projectCode}',`)
  stmt.push(`'${CN_ClaimDetail.remarks}',`)
  stmt.push(`'${CN_ClaimDetail.amountBalance}',`)

  stmt.push(`${CN_ClaimDetail.id}`)
  return sqlSvc.sqlK3Query(stmt.join(" "))
}

// 根据地址栏processID获取差旅报销头部信息
exports.selectTEXHeaderInfoByProcessID = function (processID) {
  let paramTypes = {};
  let paramValues = {};
  let stmt = "select cN_ClaimHeader.TravelRequestID as headID,cN_TravelRequestHeader.*,cN_ClaimHeader.paymentCurrency,cN_ClaimHeader.remarks,cN_ClaimHeader.requestNo as requestNoTEX from CN_Process cN_Process";
  stmt += " left join CN_ClaimHeader cN_ClaimHeader on cN_ClaimHeader.processID = cN_Process.id ";
  stmt += " left join CN_TravelRequestHeader cN_TravelRequestHeader on cN_TravelRequestHeader.processid = cN_ClaimHeader.TravelRequestID ";
  stmt += " where 1=1 and cN_Process.processcode = 'TEX' ";
  if (processID != undefined && processID != "undefined" && processID != "") {//全部
    stmt += " and cN_Process.id=@processID";
    paramTypes["processID"] = 'sql.Int';
    paramValues["processID"] = processID;
  }
  console.log(stmt);
  return sqlSvc.sqlK3Query(stmt, paramTypes, paramValues);
}

exports.selectDetailTEXInfoByProcessID = function (processID) {
  let paramTypes = {};
  let paramValues = {};
  let stmt = "select * from CN_ClaimDetail ";
  stmt += " where 1=1";
  if (processID != undefined && processID != "undefined" && processID != "") {//全部
    stmt += " and processID=@processID";
    paramTypes["processID"] = 'sql.Int';
    paramValues["processID"] = processID;
  }
  return sqlSvc.sqlK3Query(stmt, paramTypes, paramValues);
}