'use strict';

const sqlSvc=require("./sqlService");

  exports.getComplaintRequestList=function(p_UserID,startDate,endDate){
    var stmt = "SELECT a.fdzzs,a.FBiller, a.FDate, a.FBillNO, a.FID, i0.FName AS FUserName, F6_5 AS FSerialNum, ISNULL(b.Fname, a.F2_1) AS FName, F6_2"
    stmt += ", i1.FName AS FCheckName1, i.FCheckDate1, i2.FName AS FCheckName2, i.FCheckDate2, s.Fname AS FHhzt_CurrName, w.fname AS lieBie"
    stmt += ", CASE WHEN a.ffj = '1' THEN '有图片' ELSE '' END AS picture, a.FMailDate, a.FMailNumber"
    stmt += ", (SELECT MAX(FCheckDate) AS FCurCheckDate FROM ICClassCheckRecords200000013 WHERE ICClassCheckRecords200000013.FBillID = a.FID) AS FCurCheckDate"
    stmt += " FROM a_Fkbg a LEFT JOIN t_Organization b ON a.FYY = b.FItemID LEFT JOIN t_Organization c ON a.FFXS = c.FItemID LEFT JOIN ICClassCheckStatus200000013 i ON a.FID = i.FBillID"
    stmt += " LEFT JOIN t_User i0 ON a.FBiller = i0.FUserID LEFT JOIN t_User i1 ON i.FCheckMan1 = i1.FUserID LEFT JOIN t_User i2 ON i.FCheckMan2 = i2.FUserID AND i2.FUserID <> 0"
    stmt += " LEFT JOIN t_SubMessage w ON a.t_DJLB = w.FInterID AND w.FInterID <> 0 LEFT JOIN t_SubMessage s ON a.Fhhzt = s.FInterID "
    stmt += " WHERE (b.FitemID IN (SELECT FitemID FROM view_Cust WHERE FuserID = @p_UserID) OR a.FBiller = @p_UserID) "
    //sstmt += "WHERE (b.FitemID IN (SELECT FitemID FROM view_Cust WHERE FuserID = " +p_UserID+ ") OR a.FBiller = " +p_UserID+ ") AND a.FDate BETWEEN '2019/5/1' AND '2019/5/31'"
    
    let paramTypes={};
    let paramValues={};
    if(p_UserID != undefined && p_UserID != "undefined" && p_UserID != ""){
      paramTypes["p_UserID"] = 'sql.Int';
      paramValues["p_UserID"] = p_UserID;
    }
    if(startDate != undefined && startDate != "undefined" && startDate != "" && endDate != undefined && endDate != "undefined" && endDate != ""){
      stmt += " AND a.FDate BETWEEN @startDate AND @endDate";
      paramTypes["startDate"] = 'sql.VarChar(100)';
      paramValues["startDate"] = startDate.substring(0,10);
      paramTypes["endDate"] = 'sql.VarChar(100)';
      paramValues["endDate"] = endDate.substring(0,10);
    } else {
      if(startDate != undefined && startDate != "undefined" && startDate != ""){
        stmt += " AND a.FDate >= @startDate";
        paramTypes["startDate"] = 'sql.VarChar(100)';
        paramValues["startDate"] = startDate.substring(0,10);
      } else if (endDate != undefined && endDate != "undefined" && endDate != ""){
        stmt += " AND a.FDate <= @endDate";
        paramTypes["endDate"] = 'sql.VarChar(100)';
        paramValues["endDate"] = endDate.substring(0,10);
      }
    }
    stmt += " order by a.FID desc";
    return sqlSvc.sqlK3Query(stmt,paramTypes,paramValues);
  } 

  exports.getFeedbackDetailList=function(FUserID){
    let stmt=["exec JM_getFeedbackNumberListProfile"];
    stmt.push(`${FUserID}`)
    return sqlSvc.sqlK3Query(stmt.join(" "))
  } 

  exports.getComplaintRequest=function(FID){
    /* var stmt = "Select a.FDate as documentDate,a.fid,a.FBillNo as feedbackNumber,a.Fhhzt,a.F1_1 as embeddedSecurity,a.F1_2 as stentsFallOff,a.F1_3 as cardGodet,a.F1_4 as unpackFindProblem,a.F1_5 as otherQuality,a.F1_6 as otherQualityProblems,"
    stmt += " a.F2_1 as hospitalName,a.F2_2 as hospitalLevel,a.F2_3 as surgeon,a.F2_4 as workingExperience,a.F2_5 as doctorPhone,a.F2_6 as surgeryDate,"
    stmt += " a.F3_1 as distributorName,a.F3_2 as distributorPhone,a.F3_3 as salesman,a.F4_1 as PatientSex,a.F4_2 as PatientAge,a.F4_3 as diagnosis,a.F4_4 as diseasedRegion,"
    stmt += " a.F5_1 as isIntoBody,a.F5_2 as problemTime,a.F5_3 as isPressure,a.F5_4 as diseasedRegionDetails,a.F5_5 as isPreExpansion,a.F5_6 as isRatedPressure,"
    stmt += " a.F5_7 as isCalcification,a.F5_8 as isCurved,a.F5_9 as isToDisinfect,a.F5_10 as gtbasotc,a.F5_11 as basogw,a.F5_12 as brandSpecificationBalloonCatheter,a.F5_13 as dealAbsentLesion,"
    stmt += " a.F6_1 as productName,a.F6_2 as productModel,a.F6_3 as batchNumber,a.F6_4 as expiryDate,a.F6_5 as productNumber,a.F6_6 as isTechnologyAssessment,a.F6_7 as packaging,"
    stmt += " a.F6_8 as balloonCatheter,a.F6_9 as SupportHead,a.F6_10 as leadWire,a.F6_11 as OtherEvaluationContentsDetails,a.F6_12 as isCd,a.F6_13 as doctorSuggests,a.F6_14 as otherNote,"
    stmt += " a.F7_1 as clinicalOutcome,a.F7_2 as patientInjury,a.F7_3 as patientComplication,a.F7_4 as complicationDetail,a.F7_5 as selectedSite,a.F7_6 as isSurgery,a.F7_7 as incidentDescription,"
    stmt += " a.FYY as hospitalId,a.FFXS as distributorId,w.fname as ProductTypeName,a.fdzzs as electronicCertificate,a.F3_4 as email,ac.FShdd,ac.FYb,ac.FShr,ac.FTel,ac.FPhone From a_Fkbg a left join t_SubMessage w on a.t_DJLB = w.FInterID AND w.FInterID <>0 left join a_Cust ac on ac.FCustID = a.FFXS  WHERE a.FID = @FID " */
    
    var stmt = "Select a.FDate as documentDate,a.fid,a.FBillNo as feedbackNumber,a.Fhhzt,a.F1_1 as embeddedSecurity,a.F1_2 as stentsFallOff,a.F1_3 as cardGodet,a.F1_4 as unpackFindProblem,a.F1_5 as otherQuality,a.F1_6 as otherQualityProblems,"
    stmt += " a.F2_1 as hospitalName,a.F2_2 as hospitalLevel,a.F2_3 as surgeon,a.F2_4 as workingExperience,a.F2_5 as doctorPhone,a.F2_6 as surgeryDate,"
    stmt += " a.F3_1 as distributorName,a.F3_2 as distributorPhone,a.F3_3 as salesman,a.F4_1 as PatientSex,a.F4_2 as PatientAge,a.F4_3 as diagnosis,a.F4_4 as diseasedRegion,"
    stmt += " a.F5_1 as isIntoBody,a.F5_2 as problemTime,a.F5_3 as isPressure,a.F5_4 as diseasedRegionDetails,a.F5_5 as isPreExpansion,a.F5_6 as isRatedPressure,"
    stmt += " a.F5_7 as isCalcification,a.F5_8 as isCurved,a.F5_9 as isToDisinfect,a.F5_10 as gtbasotc,a.F5_11 as basogw,a.F5_12 as brandSpecificationBalloonCatheter,a.F5_13 as dealAbsentLesion,"
    stmt += " a.F6_1 as productName,a.F6_2 as productModel,a.F6_3 as batchNumber,a.F6_4 as expiryDate,a.F6_5 as productNumber,a.F6_6 as isTechnologyAssessment,a.F6_7 as packaging,"
    stmt += " a.F6_8 as balloonCatheter,a.F6_9 as SupportHead,a.F6_10 as leadWire,a.F6_11 as OtherEvaluationContentsDetails,a.F6_12 as isCd,a.F6_13 as doctorSuggests,a.F6_14 as otherNote,"
    stmt += " a.F7_1 as clinicalOutcome,a.F7_2 as patientInjury,a.F7_3 as patientComplication,a.F7_4 as complicationDetail,a.F7_5 as selectedSite,a.F7_6 as isSurgery,a.F7_7 as incidentDescription,"
    stmt += " a.FYY as hospitalId,a.FFXS as distributorId,a.fdzzs as electronicCertificate,a.F3_4 as email,ac.FShdd,ac.FYb,ac.FShr,ac.FTel,ac.FPhone,a.t_DJLB as ProductTypeId,wdh.FData as fdzzsUrl,FFXSPla as FFXSPlaId,FFXSPlaName as FFXSPlaName From a_Fkbg a left join a_Cust ac on ac.FCustID = a.FFXS left join t_Accessory wdh on wdh.fid = a.digitalSealID WHERE a.FID = @FID "
    let paramTypes={};
    let paramValues={};
    if(FID != undefined && FID != "undefined" && FID != ""){
      paramTypes["FID"] = 'sql.Int';
      paramValues["FID"] = FID;
    }
    console.log(FID);
    console.log(stmt);
    return sqlSvc.sqlK3Query(stmt,paramTypes,paramValues);
  }

  exports.getDealerSalesData=function(FID){
    /* var stmt = "select * from dbo.t_BOS_DealerSalesData where fid=@fid"; */
    var stmt = "select aa.*,case aa.status when 0 then '已保存' when 1 then '已提交' else '异常数据' end as statusZN,bb.FName as ProductTypeName from dbo.t_BOS_DealerSalesData aa left join t_SubMessage bb on aa.productTypeId = bb.FInterID and bb.FTypeID = 10008 where aa.fid=@fid ";
    let paramTypes={fid:'sql.Int'};
    let paramValues={fid:FID};
    return sqlSvc.sqlK3Query(stmt,paramTypes,paramValues);
  }
  
  /* exports.getHospitalMessage=function(p_UserID,hospitalName){
    var stmt = "SELECT DISTINCT f.FitemID AS FCustID, d.FCustID AS FFxsID, e.FNumber AS FFxsNumber, ISNULL(tc.FName, e.FName) AS FFxsName, f.FNumber, f.FName, s.FName AS FYyDj, g.FUserID";
    stmt += " FROM dbo.a_FxsQxEntry c INNER JOIN dbo.a_FxsQx d ON c.FID = d.FID LEFT JOIN dbo.t_Organization e ON d.FCustID = e.FItemID";
    stmt += " INNER JOIN dbo.t_Organization f ON c.FCustID1 = f.FItemID LEFT JOIN dbo.t_SubMessage s ON f.F_113 = s.FInterID ";
    stmt += " INNER JOIN t_User g ON g.FDescription = e.FNumber LEFT JOIN a_Cust tc ON d.FCustID = tc.FCustID AND tc.FDef = 1 ";
    stmt += " WHERE g.FUserID = @p_UserID AND c.FStop = 0 AND f.FitemID <> d.FCustID and f.FName = @hospitalName ";
    let paramTypes={fid:'sql.Int'};
    let paramValues={fid:FID};
    return sqlSvc.sqlK3Query(stmt,paramTypes,paramValues);
  } */
  exports.getDealerSalesDataEntryList=function(FID){
    var stmt = "select * from dbo.t_BOS_DealerSalesDataEntry2 where fid=@fid";
    let paramTypes={fid:'sql.Int'};
    let paramValues={fid:FID};
    return sqlSvc.sqlK3Query(stmt,paramTypes,paramValues);
  }

  exports.getFeedbackPhotosList=function(FID){
    var stmt = "select * from dbo.t_BOSFeedback_Photos where FkbgID=@FID";
    let paramTypes={FID:'sql.Int'};
    let paramValues={FID:FID};
    return sqlSvc.sqlK3Query(stmt,paramTypes,paramValues);
  }


  exports.deleteDealerSaleData=function(FID){
    var stmt = "delete from dbo.t_BOS_DealerSalesData where fid=@fid";
    let paramTypes={fid:'sql.Int'};
    let paramValues={fid:FID};
    return sqlSvc.sqlK3Query(stmt,paramTypes,paramValues);
  }

  exports.deleteDealerSaleDataEntry=function(FID){
    var stmt = "delete from dbo.t_BOS_DealerSalesDataEntry2 where fid=@fid";
    let paramTypes={fid:'sql.Int'};
    let paramValues={fid:FID};
    return sqlSvc.sqlK3Query(stmt,paramTypes,paramValues);
  }

  exports.addEditComplaintRequest=function(dealerSalesData){
    let stmt=["exec JM_InsertDealerSalesDataProfile"];
   
    stmt.push(`'${dealerSalesData.FBillNo}',`),
    stmt.push(`'${dealerSalesData.ProductTypeName}',`),
    stmt.push(`'${dealerSalesData.userName}',`),
    stmt.push(`'${dealerSalesData.single}',`),
    stmt.push(`'${dealerSalesData.note}'`)
    return sqlSvc.sqlK3Query(stmt.join(" "))
  }


  exports.copyBusinessPrice=function(businessPrice){
    let stmt=["exec JM_CopyBusinessPriceProfile"];
    stmt.push(`'${businessPrice.ProductTypeName}',`),
    stmt.push(`${businessPrice.year},`),
    stmt.push(`${businessPrice.month},`),
    stmt.push(`${businessPrice.yearTarget},`),
    stmt.push(`${businessPrice.monthTarget},`),
    stmt.push(`'${businessPrice.maintainerName}'`)
    return sqlSvc.sqlK3Query(stmt.join(" "))
  }

  exports.saveDealerSalesData=function(dealerSalesData,dealerSalesDataEntryList){

    for(var i=0;i<dealerSalesDataEntryList.length;i++){
      let stmtEntry=["exec JM_UpdateDealerSalesDataEntryProfile"];
      if(dealerSalesDataEntryList[i].FDateEnd==null||dealerSalesDataEntryList[i].FDateEnd=='null'||dealerSalesDataEntryList[i].FDateEnd=='undefined'){
        dealerSalesDataEntryList[i].FDateEnd='';
      }
      stmtEntry.push(`${dealerSalesDataEntryList[i].FEntryID},`),
      stmtEntry.push(`'${dealerSalesDataEntryList[i].FDateEnd}',`),
      stmtEntry.push(`${dealerSalesDataEntryList[i].salesVolume},`),
      stmtEntry.push(`${dealerSalesDataEntryList[i].saleroom},`),
      stmtEntry.push(`'${dealerSalesDataEntryList[i].remark}'`)
      sqlSvc.sqlK3Query(stmtEntry.join(" "))
    }

    let stmt=["exec JM_UpdateDealerSalesDataProfile"];
    stmt.push(`${dealerSalesData.FID},`),
    stmt.push(`'${dealerSalesData.FBillNo}',`),
    stmt.push(`'${dealerSalesData.ProductTypeName}',`),
    stmt.push(`'${dealerSalesData.note}'`)
    return sqlSvc.sqlK3Query(stmt.join(" "))
  }

  exports.commitDealerSalesData=function(dealerSalesData){

    var stmt = "update dbo.t_BOS_DealerSalesData set status=1  where fid=@fid";
    let paramTypes={fid:'sql.Int'};
    let paramValues={fid:dealerSalesData.FID};
    return sqlSvc.sqlK3Query(stmt,paramTypes,paramValues);
  }

  exports.addComplaintRequest=function(complaintRequest){
    let stmt=["exec JM_InsertComplaintRequestProfile"];
    if(complaintRequest.fid==""){
      complaintRequest.fid = -1;
    }
    stmt.push(`${complaintRequest.fid},`),
    stmt.push(`${complaintRequest.hospitalId},`),
    stmt.push(`${complaintRequest.distributorId},`),
    stmt.push(`${complaintRequest.FUserID},`),
    stmt.push(`'${complaintRequest.dealAbsentLesion}',`),
    stmt.push(`'${complaintRequest.ProductTypeId}',`),
    stmt.push(`'${complaintRequest.embeddedSecurity}',`),
    stmt.push(`'${complaintRequest.documentDate}',`),
    stmt.push(`'${complaintRequest.stentsFallOff}',`),
    stmt.push(`'${complaintRequest.cardGodet}',`),
    stmt.push(`'${complaintRequest.unpackFindProblem}',`),
    stmt.push(`'${complaintRequest.otherQuality}',`),
    stmt.push(`'${complaintRequest.otherQualityProblems}',`),
    stmt.push(`'${complaintRequest.electronicCertificate}',`),
    stmt.push(`'${complaintRequest.distributorName}',`),
    stmt.push(`'${complaintRequest.hospitalName}',`),
    stmt.push(`'${complaintRequest.hospitalLevel}',`),
    stmt.push(`'${complaintRequest.distributorPhone}',`),
    stmt.push(`'${complaintRequest.surgeon}',`),
    stmt.push(`'${complaintRequest.workingExperience}',`),
    stmt.push(`'${complaintRequest.salesman}',`),
    stmt.push(`'${complaintRequest.doctorPhone}',`),
    stmt.push(`'${complaintRequest.surgeryDate}',`),
    stmt.push(`'${complaintRequest.PatientSex}',`),
    stmt.push(`'${complaintRequest.PatientAge}',`),
    stmt.push(`'${complaintRequest.isIntoBody}',`),
    stmt.push(`'${complaintRequest.problemTime}',`),
    stmt.push(`'${complaintRequest.diagnosis}',`),
    stmt.push(`'${complaintRequest.isPressure}',`),
    stmt.push(`'${complaintRequest.diseasedRegion}',`),
    stmt.push(`'${complaintRequest.diseasedRegionDetails}',`),
    stmt.push(`'${complaintRequest.isPreExpansion}',`),
    stmt.push(`'${complaintRequest.isRatedPressure}',`),
    stmt.push(`'${complaintRequest.productNumber}',`),
    stmt.push(`'${complaintRequest.productName}',`),
    stmt.push(`'${complaintRequest.isCalcification}',`),
    stmt.push(`'${complaintRequest.isCurved}',`),
    stmt.push(`'${complaintRequest.productModel}',`),
    stmt.push(`'${complaintRequest.batchNumber}',`),
    stmt.push(`'${complaintRequest.expiryDate}',`),
    stmt.push(`'${complaintRequest.isToDisinfect}',`),
    stmt.push(`'${complaintRequest.isTechnologyAssessment}',`),
    stmt.push(`'${complaintRequest.gtbasotc}',`),
    stmt.push(`'${complaintRequest.packaging}',`),
    stmt.push(`'${complaintRequest.balloonCatheter}',`),
    stmt.push(`'${complaintRequest.SupportHead}',`),
    stmt.push(`'${complaintRequest.leadWire}',`),
    stmt.push(`'${complaintRequest.OtherEvaluationContents}',`),
    stmt.push(`'${complaintRequest.OtherEvaluationContentsDetails}',`),
    stmt.push(`'${complaintRequest.basogw}',`),
    stmt.push(`'${complaintRequest.isCd}',`),
    stmt.push(`'${complaintRequest.brandSpecificationBalloonCatheter}',`),
    stmt.push(`'${complaintRequest.otherNote}',`),
    stmt.push(`'${complaintRequest.clinicalOutcome}',`),
    stmt.push(`'${complaintRequest.patientInjury}',`),
    stmt.push(`'${complaintRequest.patientComplication}',`),
    stmt.push(`'${complaintRequest.complicationDetail}',`),
    stmt.push(`'${complaintRequest.selectedSite}',`),
    stmt.push(`'${complaintRequest.isSurgery}',`),
    stmt.push(`'${complaintRequest.doctorSuggests}',`),
    stmt.push(`'${complaintRequest.incidentDescription}',`),
    stmt.push(`'${complaintRequest.email}',`),
    stmt.push(`${complaintRequest.FFXSPlaId},`),
    stmt.push(`'${complaintRequest.FFXSPlaName}'`)
    return sqlSvc.sqlK3Query(stmt.join(" "))
  }

  exports.commitComplaintRequest=function(complaintRequest){
    let stmt=["exec JM_CommitComplaintRequestProfile"];
    stmt.push(`${complaintRequest.fid},`),
    stmt.push(`${complaintRequest.hospitalId},`),
    stmt.push(`${complaintRequest.distributorId},`),
    stmt.push(`${complaintRequest.FUserID},`),
    stmt.push(`'${complaintRequest.dealAbsentLesion}',`),
    stmt.push(`'${complaintRequest.ProductTypeId}',`),
    stmt.push(`'${complaintRequest.embeddedSecurity}',`),
    stmt.push(`'${complaintRequest.documentDate}',`),
    stmt.push(`'${complaintRequest.stentsFallOff}',`),
    stmt.push(`'${complaintRequest.cardGodet}',`),
    stmt.push(`'${complaintRequest.unpackFindProblem}',`),
    stmt.push(`'${complaintRequest.otherQuality}',`),
    stmt.push(`'${complaintRequest.otherQualityProblems}',`),
    stmt.push(`'${complaintRequest.electronicCertificate}',`),
    stmt.push(`'${complaintRequest.distributorName}',`),
    stmt.push(`'${complaintRequest.hospitalName}',`),
    stmt.push(`'${complaintRequest.hospitalLevel}',`),
    stmt.push(`'${complaintRequest.distributorPhone}',`),
    stmt.push(`'${complaintRequest.surgeon}',`),
    stmt.push(`'${complaintRequest.workingExperience}',`),
    stmt.push(`'${complaintRequest.salesman}',`),
    stmt.push(`'${complaintRequest.doctorPhone}',`),
    stmt.push(`'${complaintRequest.surgeryDate}',`),
    stmt.push(`'${complaintRequest.PatientSex}',`),
    stmt.push(`'${complaintRequest.PatientAge}',`),
    stmt.push(`'${complaintRequest.isIntoBody}',`),
    stmt.push(`'${complaintRequest.problemTime}',`),
    stmt.push(`'${complaintRequest.diagnosis}',`),
    stmt.push(`'${complaintRequest.isPressure}',`),
    stmt.push(`'${complaintRequest.diseasedRegion}',`),
    stmt.push(`'${complaintRequest.diseasedRegionDetails}',`),
    stmt.push(`'${complaintRequest.isPreExpansion}',`),
    stmt.push(`'${complaintRequest.isRatedPressure}',`),
    stmt.push(`'${complaintRequest.productNumber}',`),
    stmt.push(`'${complaintRequest.productName}',`),
    stmt.push(`'${complaintRequest.isCalcification}',`),
    stmt.push(`'${complaintRequest.isCurved}',`),
    stmt.push(`'${complaintRequest.productModel}',`),
    stmt.push(`'${complaintRequest.batchNumber}',`),
    stmt.push(`'${complaintRequest.expiryDate}',`),
    stmt.push(`'${complaintRequest.isToDisinfect}',`),
    stmt.push(`'${complaintRequest.isTechnologyAssessment}',`),
    stmt.push(`'${complaintRequest.gtbasotc}',`),
    stmt.push(`'${complaintRequest.packaging}',`),
    stmt.push(`'${complaintRequest.balloonCatheter}',`),
    stmt.push(`'${complaintRequest.SupportHead}',`),
    stmt.push(`'${complaintRequest.leadWire}',`),
    stmt.push(`'${complaintRequest.OtherEvaluationContents}',`),
    stmt.push(`'${complaintRequest.OtherEvaluationContentsDetails}',`),
    stmt.push(`'${complaintRequest.basogw}',`),
    stmt.push(`'${complaintRequest.isCd}',`),
    stmt.push(`'${complaintRequest.brandSpecificationBalloonCatheter}',`),
    stmt.push(`'${complaintRequest.otherNote}',`),
    stmt.push(`'${complaintRequest.clinicalOutcome}',`),
    stmt.push(`'${complaintRequest.patientInjury}',`),
    stmt.push(`'${complaintRequest.patientComplication}',`),
    stmt.push(`'${complaintRequest.complicationDetail}',`),
    stmt.push(`'${complaintRequest.selectedSite}',`),
    stmt.push(`'${complaintRequest.isSurgery}',`),
    stmt.push(`'${complaintRequest.doctorSuggests}',`),
    stmt.push(`'${complaintRequest.incidentDescription}',`),
    stmt.push(`'${complaintRequest.email}',`),
    stmt.push(`${complaintRequest.FFXSPlaId},`),
    stmt.push(`'${complaintRequest.FFXSPlaName}'`)
    return sqlSvc.sqlK3Query(stmt.join(" "))
  } 

  /* exports.commitComplaintRequest=function(fid,FUserID,electronicCertificate){
    let stmt=["exec JM_CommitComplaintRequestProfile"];
    stmt.push(`${fid},`),
    stmt.push(`${FUserID},`),
    stmt.push(`'${electronicCertificate}'`)
    return sqlSvc.sqlK3Query(stmt.join(" "))
  } */

  exports.validationProductNumber=function(productNumber,feedbackNumber){
    var stmt = "";
    let paramTypes={};
    let paramValues={};
    if (feedbackNumber=="" || feedbackNumber == undefined) {
      stmt += "Select * From a_Fkbg Where F6_5 = @productNumber";
      paramTypes["productNumber"] = 'sql.VarChar(100)';
      paramValues["productNumber"] = productNumber;
    } else {
      stmt += "Select * From a_Fkbg Where F6_5 = @productNumber and fbillno <> @feedbackNumber";
      paramTypes["productNumber"] = 'sql.VarChar(100)';
      paramValues["productNumber"] = productNumber;
      paramTypes["feedbackNumber"] = 'sql.VarChar(100)';
      paramValues["feedbackNumber"] = feedbackNumber;
    }
    return sqlSvc.sqlK3Query(stmt,paramTypes,paramValues);
    
  }

  exports.getHospitalMessage=function(p_UserID,hospitalId){
    /* var stmt = "SELECT DISTINCT f.FitemID AS FCustID, d.FCustID AS FFxsID, e.FNumber AS FFxsNumber, ISNULL(tc.FName, e.FName) AS FFxsName, f.FNumber, f.FName, s.FName AS FYyDj, g.FUserID";
    stmt += " FROM dbo.a_FxsQxEntry c INNER JOIN dbo.a_FxsQx d ON c.FID = d.FID LEFT JOIN dbo.t_Organization e ON d.FCustID = e.FItemID";
    stmt += " INNER JOIN dbo.t_Organization f ON c.FCustID1 = f.FItemID LEFT JOIN dbo.t_SubMessage s ON f.F_113 = s.FInterID ";
    stmt += " INNER JOIN t_User g ON g.FDescription = e.FNumber LEFT JOIN a_Cust tc ON d.FCustID = tc.FCustID AND tc.FDef = 1 ";
    stmt += " WHERE g.FUserID = @p_UserID AND c.FStop = 0 AND f.FitemID <> d.FCustID and f.FName = @hospitalName "; */
    /* var stmt = "SELECT DISTINCT f.FitemID AS FCustID, d.FCustID AS FFxsID, e.FNumber AS FFxsNumber, ISNULL(tc.FName, e.FName) AS FFxsName, f.FNumber, f.FName, s.FName AS FYyDj, g.FUserID";
    stmt += " FROM dbo.a_FxsQxEntry c INNER JOIN dbo.a_FxsQx d ON c.FID = d.FID LEFT JOIN dbo.t_Organization e ON d.FCustID = e.FItemID";
    stmt += " INNER JOIN dbo.t_Organization f ON c.FCustID1 = f.FItemID LEFT JOIN dbo.t_SubMessage s ON f.F_113 = s.FInterID ";
    stmt += " INNER JOIN t_User g ON g.FDescription = e.FNumber LEFT JOIN a_Cust tc ON d.FCustID = tc.FCustID AND tc.FDef = 1 ";
    stmt += " WHERE g.FUserID = @p_UserID AND c.FStop = 0 AND f.FitemID <> d.FCustID and f.FitemID = @hospitalId "; */

    var stmt = "Select distinct ve.FCustID,ve.FNumber,ve.FItemID as FInterId,ve.FName,ISNULL(ve.FYydj,'') as FYyDj,ve.FFxsID,ve.FFxsName,ISNULL(toz.FItemID,0) as FFXSPlaId,toz.FName as FFXSPlaName From";
    stmt += " view_EmpCust ve left join t_BOSPTEntry2 tbp ON tbp.FJXSID = ve.FFxsID and Getdate() between tbp.FbeginDate and tbp.FendDate ";
    stmt += " left join t_BOSPT tb on tb.FID = tbp.FID LEFT JOIN t_Organization toz on toz.FItemID = tb.Fcustid  Where ve.FEmpID = (SELECT FEmpID FROM t_User WHERE FUserID = @p_UserID) and ve.FItemID=@hospitalId ";
    let paramTypes={};
    let paramValues={};
    paramTypes["p_UserID"] = 'sql.Int';
    paramValues["p_UserID"] = p_UserID;
    paramTypes["hospitalId"] = 'sql.Int';
    paramValues["hospitalId"] = hospitalId;
    return sqlSvc.sqlK3Query(stmt,paramTypes,paramValues);
  }

  exports.getDoctorList=function(p_UserID,hospitalId){
    /* var stmt = "Select f.FItemID AS ,f.FName From";
    stmt += " view_EmpCust ve inner join a_FxsQx d on ve.FFxsID = d.FCustID inner join a_FxsQxEntry c on  c.FID = d.FID inner join t_Organization f on c.FCustID1 = f.FItemID  Where ve.FEmpID = (SELECT FEmpID FROM t_User WHERE FUserID = @p_UserID) and ve.FItemID=@hospitalId "; */
    var stmt = "select a.FName FROM t_Item_3002 a INNER JOIN t_Organization b ON a.F_112 = b.FItemID WHERE b.FItemID = @hospitalId";
    let paramTypes={};
    let paramValues={};
    paramTypes["hospitalId"] = 'sql.Int';
    paramValues["hospitalId"] = hospitalId;
    return sqlSvc.sqlK3Query(stmt,paramTypes,paramValues);
  }

  exports.getCertificateList=function(p_UserID,hospitalId){
    var stmt = "select FID,fbillno +'|'+ fnote as electronicCertificate from t_BOSWqianzhang tbos inner join t_user tu on tbos.FBiller = tu.FUserID inner join t_Organization too on too.FNumber = tu.FDescription";
    stmt += " inner join view_EmpCust ve on ve.FFxsID = too.FitemID  Where  tbos.Fzt = 0 and ve.FEmpID = (SELECT FEmpID FROM t_User WHERE FUserID = @p_UserID) and ve.FItemID=@hospitalId ";
    let paramTypes={};
    let paramValues={};
    paramTypes["p_UserID"] = 'sql.Int';
    paramValues["p_UserID"] = p_UserID;
    paramTypes["hospitalId"] = 'sql.Int';
    paramValues["hospitalId"] = hospitalId;
    return sqlSvc.sqlK3Query(stmt,paramTypes,paramValues);
  }


  exports.getProductByNumber=function(productNumber){
    var stmt = "Select d.FItemID,d.FNumber,d.FModel,d.Fname, b.FKFDate , Dateadd(d,b.FKFPeriod,b.FKFDate) FYxqz,b.FBatchNo ,c1.FSerialNum ";
    stmt += "from IcStockBill a with(NOLOCK) "
    stmt += "INNER JOIN IcStockBillEntry b with(NOLOCK) On a.FinterID = b.FinterID "
    stmt += "INNER JOIN IcSerialFlow c with(NOLOCK) ON b.FSnListID = c.FSnListID INNER JOIN Icserial c1 with(NOLOCK) ON c.FSerialID=c1.FSerialID "
    stmt += "INNER JOIN t_Icitem d with(NOLOCK) ON b.FItemID = d.FItemID "
    stmt += "WHERE c.FTranTypeID=2  and c1.FSerialNum = @productNumber"
    let paramTypes={productNumber:'sql.VarChar(100)'};
    let paramValues={productNumber:productNumber};
    return sqlSvc.sqlK3Query(stmt,paramTypes,paramValues);
  }


  exports.deleteComplaintRequest=function(FID){
    var stmt = "delete from dbo.a_Fkbg where fid=@fid";
    let paramTypes={fid:'sql.Int'};
    let paramValues={fid:FID};
    return sqlSvc.sqlK3Query(stmt,paramTypes,paramValues);
  }

  exports.checkComplaintRequest=function(complaintRequest){
    var stmt = "update dbo.a_Fkbg set FMailDate = @FMailDate,FMailNumber = @FMailNumber where fid=@fid";
    /* var FMailDate = new Date();
    FMailDate = FMailDate.format(complaintRequest.FMailDate); */
    let paramTypes={};
    let paramValues={};
    paramTypes["fid"] = 'sql.Int';
    paramValues["fid"] = complaintRequest.FID;
    paramTypes["FMailDate"] = 'sql.VarChar(100)';
    paramValues["FMailDate"] = complaintRequest.FMailDate;
    paramTypes["FMailNumber"] = 'sql.VarChar(100)';
    paramValues["FMailNumber"] = complaintRequest.FMailNumber;

    return sqlSvc.sqlK3Query(stmt,paramTypes,paramValues);
  }

  exports.getAuditLogList=function(FID){
    var stmt = "select t1.FBillNo,t2.FName AS FCheckerName,t1.FCheckDate,t1.FPreCheckDate,T1.FCheckIdea, t1.FDESCRIPTIONS,"
    stmt += " CASE WHEN T1.FPreCheckDate IS NULL THEN NULL ELSE  DATEDIFF(D,t1.FPreCheckDate,T1.FCheckDate) END FDaysUsed"
    stmt += " from [A_Fkbg_checkLog] t1 Inner Join t_user t2 On t1.FCheckMan=t2.FUserID"
    stmt += " Where t1.FBillID = @FID"
    let paramTypes={};
    let paramValues={};
    if(FID != undefined && FID != "undefined" && FID != ""){
      paramTypes["FID"] = 'sql.Int';
      paramValues["FID"] = FID;
    }
    return sqlSvc.sqlK3Query(stmt,paramTypes,paramValues);
  }

  exports.getFeedbackNumberList=function(FUserID){
    let stmt=["exec JM_getFeedbackNumberListProfile"];
    stmt.push(`${FUserID}`)
    return sqlSvc.sqlK3Query(stmt.join(" "))
  }

  /* exports.uploadPthotos=function(FkbgFid,feedbackNumber,year,month,day,photoUrl,FUserID){
    var createTime = new Date();
    var stmt = "insert into t_BOSFeedback_Photos(FkbgID,FkbgBillNo,Year,Month,day,picture,createUserId) values (@FkbgFid,@feedbackNumber,@year,@month,@day,@photoUrl,@FUserID)"
    let paramTypes={};
    let paramValues={};
    paramTypes["FkbgFid"] = 'sql.Int';
    paramValues["FkbgFid"] = FkbgFid;
    paramTypes["feedbackNumber"] = 'sql.VarChar(100)';
    paramValues["feedbackNumber"] = feedbackNumber;
    paramTypes["year"] = 'sql.Int';
    paramValues["year"] = year;
    paramTypes["month"] = 'sql.Int';
    paramValues["month"] = month;
    paramTypes["day"] = 'sql.Int';
    paramValues["day"] = day;
    paramTypes["photoUrl"] = 'sql.VarChar(500)';
    paramValues["photoUrl"] = photoUrl;
    paramTypes["FUserID"] = 'sql.Int';
    paramValues["FUserID"] = FUserID;

    return sqlSvc.sqlK3Query(stmt,paramTypes,paramValues);
  } */

  exports.uploadPthotos=function(FkbgFid,feedbackNumber,year,month,day,photoUrl,FUserID){
    let stmt=["exec JM_uploadPhotosProfile"];
    stmt.push(`${FkbgFid},`),
    stmt.push(`'${feedbackNumber}',`),
    stmt.push(`${year},`),
    stmt.push(`${month},`),
    stmt.push(`${day},`),
    stmt.push(`'${photoUrl}',`),
    stmt.push(`${FUserID}`)
    return sqlSvc.sqlK3Query(stmt.join(" "))
  }