'use strict';

const sqlSvc=require("./sqlService");

  exports.getCompanyInformationList=function(FCustID){
    var stmt = "SELECT * FROM a_Cust WHERE 1=1 ";
    let paramTypes={};
    let paramValues={};
    if(FCustID != undefined && FCustID != "undefined" && FCustID != "" ){
      stmt += " AND FCustID  = @FCustID";
      paramTypes["FCustID"] = 'sql.NVarChar(10)';
      paramValues["FCustID"] = FCustID;
    } 
    stmt += " Order by FID DESC";
    return sqlSvc.sqlK3Query(stmt,paramTypes,paramValues);
  } 

  exports.deleteCompanyInfo=function(FID){
    var stmt = "DELETE  FROM a_Cust WHERE 1=1 ";
    let paramTypes={};
    let paramValues={};
    if(FID != undefined && FID != "undefined" && FID != "" ){
      stmt += " AND FID  = @FID";
      paramTypes["FID"] = 'sql.INT';
      paramValues["FID"] = FID;
    } 
    return sqlSvc.sqlK3Query(stmt,paramTypes,paramValues);
  } 
  
  exports.addCompanyInformation=function(FCustID,cust){
    var paramTypes = {};
    var paramValues = {};
    var stmt = '';
    if(cust.FID!=undefined){
      stmt += " UPDATE a_Cust SET FNumber='"+cust.FNumber+"',FName='"+cust.FName+"',FSHDD='"+cust.FSHDD+"',FShr='"+cust.FShr+"',FTel='"+cust.FTel+"',FPhone='"+cust.FPhone+"',FCZ='"+cust.FCz+"',FYb='"+cust.FYb+"',FDef="+cust.FDef+" ";
      stmt += " WHERE FID = "+cust.FID+"";
    }else{   
      stmt += " INSERT INTO a_Cust (FCustID,FNumber,FName,FSHDD,FShr,FTel,FPhone,FCZ,FYb,FDef) VALUES ";
      stmt += " ("+FCustID+",'"+cust.FNumber+"','"+cust.FName+"','"+cust.FSHDD+"','"+cust.FShr+"','"+cust.FTel+"','"+cust.FPhone+"','"+cust.FCz+"','"+cust.FYb+"',"+cust.FDef+")";
    }
    return sqlSvc.sqlK3Query(stmt,paramTypes,paramValues);
  } 

  exports.getHospitalInformationList=function(FUserID,FCustID){
    var stmt = "select tor.FItemID,tor.FNumber,tor.FName,tor.FProvince,tor.FCity,tor.F_106,tor.F_107,tor.F_108,tor.F_109,tor.F_110,";
    stmt+=" tor.F_111,ts.FName as FName_ ";
    stmt+=" from t_Organization tor ";
    stmt+=" left join t_SubMessage ts on ts.FInterID = tor.F_113 and ts.FTypeID = 10003 ";
    stmt+=" where 1=1 ";
    stmt+=" and tor.FItemID <>  "+ FCustID;
    stmt+=" and FItemID IN(select FItemID from view_Cust WHERE FUserID = "+FUserID+")";
    let paramTypes={};
    let paramValues={};
    return sqlSvc.sqlK3Query(stmt,paramTypes,paramValues);
  } 

  exports.editHospitalInformationList=function(cust,submID){  
    var stmt = "update t_Item_3002 set F_101 = '"+cust.F_101+"',FName = '"+cust.FName+"',F_111 = '"+cust.F_111+"',";
    stmt+= " F_103 = '"+cust.F_103+"',F_104 = '"+cust.F_104+"',F_105 = '"+cust.F_105+"',F_107 = '"+cust.F_107+"',F_108 = '"+cust.F_108+"', ";
    stmt+= " F_109 = '"+cust.F_109+"',F_110 = '"+cust.F_110+"',F_112 = '"+submID+"' ";
    stmt+= " where FItemID = "+cust.FItemID+"";
    let paramTypes={};
    let paramValues={};
    return sqlSvc.sqlK3Query(stmt,paramTypes,paramValues);
  } 

  exports.getFItemClassID=function(){  
    var stmt = "SELECT FItemClassID from t_ItemClass WHere FName = '医生'";
    let paramTypes={};
    let paramValues={};
    return sqlSvc.sqlK3Query(stmt,paramTypes,paramValues);
  } 
  
  exports.getFNumber=function(FItemClassID){  
    var stmt = "Select RIGHT('00000'+CAST((ISNULL(Max(FNumber)+1,'00000')) as varchar(10)),5) FNumber  FROM t_Item WHERE FItemClassID = "+FItemClassID+"";
    let paramTypes={};
    let paramValues={};
    return sqlSvc.sqlK3Query(stmt,paramTypes,paramValues);
  }

  exports.addT_Item=function(FName,FItemClassID,FNumber){  
    var stmt = "INSERT INTO t_Item (FItemClassID,FParentID,FLevel,FName  ,FNumber,FShortNumber,FFullNumber,FFullName ,FDetail,FDeleted) ";
    stmt+=" VALUES  ("+FItemClassID+",0, 1, '"+FName+"', '"+FNumber+"', '"+FNumber+"',  '"+FNumber+"','"+FName+"', 1, 0) ";
    let paramTypes={};
    let paramValues={};
    return sqlSvc.sqlK3Query(stmt,paramTypes,paramValues);
  }

  
  exports.getFItemID=function(){  
    var stmt = "select MAX(FItemID) as  FItemID from t_Item where 1=1";
    let paramTypes={};
    let paramValues={};
    return sqlSvc.sqlK3Query(stmt,paramTypes,paramValues);
  }

  exports.addHospitalInformationList=function(cust,submID,FItemID,FNumber){  
    var stmt = "insert into t_Item_3002 (FItemID,F_101,FNumber,FName,F_103,F_104,F_105,F_107,F_108,F_109,F_110,F_111,F_112)";
    stmt+=" values("+FItemID+",'"+cust.F_101+"',"+FNumber+",'"+cust.FName+"','"+cust.F_103+"','"+cust.F_104+"','"+cust.F_105+"','"+cust.F_107+"'";
    stmt+=" ,'"+cust.F_108+"','"+cust.F_109+"','"+cust.F_110+"','"+cust.F_111+"','"+submID+"')";
    let paramTypes={};
    let paramValues={};
    return sqlSvc.sqlK3Query(stmt,paramTypes,paramValues);
  } 

  exports.deleteDoctorInformationRequest=function(FItemID){  
    var stmt = "delete from t_Item_3002 where FItemID = "+FItemID+"";
    let paramTypes={};
    let paramValues={};
    return sqlSvc.sqlK3Query(stmt,paramTypes,paramValues);
  } 

  exports.getElectronicSignatureRequest=function(FUserID){  
    var stmt = "select t1.FID as finterid ,t1.FBillNo as danjubianhao,t1.FDate as danjuriqi,";
    stmt+=" case when t1.Fzt = 0 then '正常' else '停用' end  as zhuangtai,t2.FNumber as fenxiaoshangbianma,";
    stmt+=" t2.FName as fenxiaoshangmingcheng,fnote as miaoshu ";
    stmt+=" from t_BOSWqianzhang t1 ";
    stmt+=" inner join t_Organization t2 on  t1.Fcustid = t2.FItemID ";
    stmt+=" inner join t_user t3 on t1.FBiller = t3.FUserID ";
    stmt+=" WHERE t1.Fzt = 0 and t1.FBiller = @FUserID";
    let paramTypes={};
    let paramValues={};
    paramTypes["FUserID"] = 'sql.INT';
    paramValues["FUserID"] = FUserID;
    return sqlSvc.sqlK3Query(stmt,paramTypes,paramValues);
  } 
  
 
  exports.getElectronicSignaturePic=function(electronicSignature,FUserID){  
    var stmt = "select ta.FData as FData from t_BOSWqianzhang tb left join t_Accessory ta on ta.FItemID  = tb.FID	where tb.FID = @FID and FBiller = @FBiller";
    let paramTypes={};  
    let paramValues={};
    paramTypes["FID"] = 'sql.NVarChar(10)';
    paramValues["FID"] = electronicSignature.finterid;
    paramTypes["FBiller"] = 'sql.INT';
    paramValues["FBiller"] = FUserID;
    return sqlSvc.sqlK3Query(stmt,paramTypes,paramValues);
  } 

  exports.getFname_=function(cust){
    var stmt = "SELECT FInterID,FName as FName_sm  FROM t_SubMessage WHERE FTypeID = 10003";
    let paramTypes={};
    let paramValues={};
    return sqlSvc.sqlK3Query(stmt,paramTypes,paramValues);
  } 

  
  exports.getCustomWareHouserInformationList=function(FUserID){
    
    var stmt = "Select * From a_Stock_Custom a INNER JOIN t_Stock b ON a.FStockID = b.FitemID WHERE a.FUserID = "+FUserID+"";
    let paramTypes={};
    let paramValues={};
    return sqlSvc.sqlK3Query(stmt,paramTypes,paramValues);
  } 

  
  //1
  exports.houseIsNotExit=function(FName){
    var stmt = "SELECT FItemID FROM t_Stock WHERE Fname = '"+FName+ "'";
    let paramTypes={};
    let paramValues={};
    return sqlSvc.sqlK3Query(stmt,paramTypes,paramValues);
  } 

  //2
  exports.fparentID=function(){
    var stmt = "select FItemID from t_item where FItemClassID = 5 AND FNumber = '99'";
    let paramTypes={};
    let paramValues={};
    return sqlSvc.sqlK3Query(stmt,paramTypes,paramValues);
  } 
  
  //3
  exports.FNumber=function(){
    var stmt = "select  max(FNumber) FNumber from t_Item WHERE LEN(FNumber)>2 AND FNumber LIKE '99.%' AND FItemClassID = 5";
    let paramTypes={};
    let paramValues={};
    return sqlSvc.sqlK3Query(stmt,paramTypes,paramValues);
  }

  //4
  exports.insertIntoItem=function(fparentID,FNumber,FName,FNumber_4){
    var stmt = "INSERT INTO t_Item (FItemClassID,FParentID,FLevel,FName ,FNumber,FShortNumber,FFullNumber ,FDetail,FDeleted) ";
    stmt+=" VALUES  (5,"+fparentID+",2, '"+FName+ "', "+FNumber+", "+FNumber_4+ ", "+FNumber+" , 1, 0) ";
    let paramTypes={};
    let paramValues={};
    return sqlSvc.sqlK3Query(stmt,paramTypes,paramValues);
  } 
  
  //5
  exports.t_ItemList=function(FNumber){
    var stmt = "Select * From t_Item where Fnumber = '"+FNumber+"' and FItemClassID = 5";
    let paramTypes={};
    let paramValues={};
    return sqlSvc.sqlK3Query(stmt,paramTypes,paramValues);
  } 

  //6
  exports.insertTstock=function(t_ItemList){
    var FNumber_4 = t_ItemList[0].FNumber.toString().split(".")[1];
    var stmt = "INSERT INTO t_Stock (FEmpID,FAddress,FPhone,FProperty,FTypeID,FMRPAvail,FIsStockMgr,FSPGroupID,FShortNumber,FNumber,FName,FParentID,FItemID)";
    stmt+=" VALUES (0, NULL, NULL, 0, 500, 1, 0, 0, '"+FNumber_4+"', '"+t_ItemList[0].FNumber+"', '"+t_ItemList[0].FName+"', "+t_ItemList[0].FParentID+", "+t_ItemList[0].FItemID+")";
    let paramTypes={};
    let paramValues={};
    return sqlSvc.sqlK3Query(stmt,paramTypes,paramValues);
  } 

  //7
  exports.insertAstockCustom=function(t_ItemList,FUserID){
    var stmt = "Insert into a_Stock_Custom (FstockID, FUserID) values (" +t_ItemList[0].FItemID+","+FUserID+")";
    let paramTypes={};
    let paramValues={};
    return sqlSvc.sqlK3Query(stmt,paramTypes,paramValues);
  } 
  
  
  exports.updateTitem=function(FName,FItemID){
    var stmt = "update t_Item set FName = '"+FName+"' where FItemID = "+FItemID+"";
    let paramTypes={};
    let paramValues={};
    return sqlSvc.sqlK3Query(stmt,paramTypes,paramValues);
  } 

  
  exports.updateTstock=function(FName,FItemID){
    var stmt = "update t_Stock set FName = '"+FName+"' where FItemID = "+FItemID+"";
    let paramTypes={};
    let paramValues={};
    return sqlSvc.sqlK3Query(stmt,paramTypes,paramValues);
  } 

  
  exports.deleteTitem=function(FItemID){
    var stmt = "delete from t_Item where FItemID = "+FItemID+"";
    let paramTypes={};
    let paramValues={};
    return sqlSvc.sqlK3Query(stmt,paramTypes,paramValues);
  } 

  
  exports.deleteTstock=function(FItemID){
    var stmt = "delete from t_Stock where FItemID = "+FItemID+"";
    let paramTypes={};
    let paramValues={};
    return sqlSvc.sqlK3Query(stmt,paramTypes,paramValues);
  } 
  
  
  exports.deleteAstockCustom=function(FStockID,FUserID){
    var stmt = "delete from a_Stock_Custom where FStockID = "+FStockID+" and  FUserID = "+FUserID+"";
    let paramTypes={};
    let paramValues={};
    return sqlSvc.sqlK3Query(stmt,paramTypes,paramValues);
  } 

  
  exports.getDoctorInformationList=function(FUserID){
    var stmt = "SELECT a.FItemID [内码],a.FNumber 医生编号, a.FName 医生姓名, b.Fname AS hospital,a.*"; 
    stmt+=" from t_Item_3002 a INNER JOIN t_Organization b ON a.F_112  = b.FItemID WHERE 1=1";
    stmt+=" AND b.FItemID IN(Select FItemID from view_Cust WHERE FUserID = "+FUserID+")";
    let paramTypes={};
    let paramValues={};
    return sqlSvc.sqlK3Query(stmt,paramTypes,paramValues);
  } 
  
  
  exports.getHospitalFname=function(FUserID,FItemID){
    var stmt = "select * from view_cust WHERE FUserID =  "+FUserID+" AND FItemID <> "+FItemID+""; 
    let paramTypes={};
    let paramValues={};
    return sqlSvc.sqlK3Query(stmt,paramTypes,paramValues);
  } 

  exports.insertTAccessory=function(Image){
    var stmt = "insert into t_Accessory (FTypeID,FItemID,FDesc,FFileName,FFile,FFileSize,FUploader,FUploadTime,FChecker,FIsPIC,FData,FVersion,FSaveMode,FPage,FEntryID) values ";
    stmt+=" (200000039,13,'testaaaqq','aaa.gif',NULL,18140,16641,'2019-08-22',0,0,'ABC',@Image,0,0,0)"; 
    let paramTypes={};
    let paramValues={};
    paramTypes["Image"] = 'sql.Image';
    paramValues["Image"] = Image;
    return sqlSvc.sqlK3Query(stmt,paramTypes,paramValues);
  } 
 
  