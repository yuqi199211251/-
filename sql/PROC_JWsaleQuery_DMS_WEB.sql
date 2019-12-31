USE [JWMS_TEST]
GO
/****** Object:  StoredProcedure [dbo].[PROC_JWsaleQuery]    Script Date: 08/30/2019 09:49:44 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
                          
/*                                
Desc：查询初稿、核对版、终稿                                
Auth:Colin Song                                
DAte:2013-01-10                                
EXEC PROC_JWsaleQuery 2016,5,'初稿','支架系统','不受限用户',9214                         
                        
2013-01-30:增加了根据区域筛选数据功能                        
2013-02-18:更换为使用区域查询区域经理的方法，取消以前的根据职员查询经理的方法。                    
2013-03-14 wise版本，t_Organization增加了FProviceID,FCity                  
2013-11-05 增加产品类别条件                   
2015-08-15 add hosp Level Name        
2016-06-23 增加大区经理和大区、总监信息，修改助理权限逻辑      
2016-07-21 增加字段 商务负责人               
@UserType :不受限用户/销售经理/销售代表/销售助理/商务代表  

2019-08-30 增加一些判断  不同用户的查看权限不一样（适应网页端的项目） Auth:Frank    DAte:2019-08-30          
*/                                
ALTER  PROC [dbo].[PROC_JWsaleQuery_DMS_WEB](@FYEAR INT ,@FMONTH INT,@VERSION NVARCHAR(20),@LB AS VARCHAR(20),@UserType as Varchar(50)='',@sDeptName as Varchar(50)='',@EmpID int              
)                                
AS                                 
SET NOCOUNT ON                                
DECLARE @DATE1 DATETIME                                
DECLARE @DATE2 DATETIME       
DECLARE @ISQUERY INT
DECLARE @FSaleCheckerName nvarchar(200)       
DECLARE @LB_NUM INT --1 支架系统 ； 2 Powline球囊扩张导管                              
--DECLARE @FYEAR INT                                 
--DECLARE @FMONTH INT                                
--SET @FYEAR=2012                                
--SET @FMONTH=8

IF @sDeptName = '客服部' OR @sDeptName = '销售副总'
	BEGIN
		set @ISQUERY = 1
	END
ELSE
	BEGIN
		SELECT @FSaleCheckerName = t3.Fname FROM t_Jwsale t1 LEFT JOIN t_User t2 ON t1.FChecker1 = t2.FUserID AND t2.FUserID <> 0 LEFT JOIN t_user t3 ON t1.Fchecker2 = t3.Fuserid AND t3.FuserID <> 0 LEFT JOIN t_subMessage t4 ON t4.FParentID = 10008 AND t4.FinterID = t1.FLB WHERE Fyear * 12 + Fmonth = @FYEAR * 12 + @FMONTH AND FVersion <> '核对版' AND FVersion <> '初稿' ORDER BY FYear DESC, Fmonth DESC, t1.FVersion DESC
		IF @FSaleCheckerName = '' OR @FSaleCheckerName IS NULL
			BEGIN
				set @ISQUERY = 0
			END
		ELSE
			BEGIN
				set @ISQUERY = 1
			END
	END
        
IF @ISQUERY = 1 
	BEGIN
		SELECT @DATE1=CAST((''+CAST(@FYEAR AS CHAR(4)) +'-'+CAST(@FMONTH AS CHAR(2))+'-01') AS DATETIME)                                
		SELECT @DATE2=CAST((''+CAST(@FYEAR AS CHAR(4)) +'-'+CAST(@FMONTH AS CHAR(2))+'-01') AS DATETIME)                                
		SELECT @DATE2=DATEADD(d,-1,DATEADD(m,1,@DATE2))                                
		SELECT @LB_NUM= (SELECT CASE WHEN @LB='支架系统' THEN 1  WHEN @LB='Powline球囊扩张导管' THEN 2  ELSE 0 END)                                
		----CREATE TABLE #SALE_TABLE(                            
		----   FID int,                            
		----   FEntryID int,                               
		----      FMgrID int,                                    
		----      )                                
		------填充临时表                            
		----INSERT  INTO #SALE_TABLE(FID,FEntryID,FMgrID)                            
		---- SELECT FID,FEntryID,0 from t_JWsaleEntry                             
		---- Where FID in(select Top 1 FID from t_JWsale Where FYear=@FYEAR And FMonth=@FMONTH And FVersion=@VERSION)                            
		                                  
		------获取职员对应月份的区域和经理                             
		----UPDATE t1 SET t1.FMgrID=Mgr.FEmp2                            
		----From #SALE_TABLE t1                             
		----Inner Join t_JWsaleEntry t2 ON t1.FID=t2.FID and t1.FEntryID=t2.FEntryID                            
		----Inner Join a_qyglEntryDB Saler On t2.FEmpID=Saler.FEmp                            
		----Inner Join  a_qyglEntryJL Mgr On Mgr.FID=Saler.FID And Mgr.FOnDuty=1                            
		----Where @FYEAR*12+@FMONTH Between Saler.FYear1*12+Saler.FMonth1 And Saler.FYear2*12 + Saler.FMonth2                                
		                                     
		                                   
		--取出查询结果                            
		SELECT t1.FID,t1.FEntryID,t1.FIndex,t1.price,                           
		t1.FEmpID As FSalerID ,T2.FName AS FSalerName,                            
		Mgr.FItemID As FMgrID,mgr.FName AS FMgrName,          
		BAreaMgr.FItemID As FBigAreaMgrID,BAreaMgr.FName AS FBigAreaMgrName,       
		Dir.FItemID As FDirectorID,Dir.FName AS FDirectorName,       
		                       
		--医院 Info                            
		t1.FHospID,                            
		T4.FNumber AS FHospNum,                            
		 CAse when LEN(T4.FNumber)=10 then LEFT(T4.FNumber,9) Else T4.FNumber End FHospNumOk,                                
		 CAse when charindex('-',T4.FName)<>0  then LEFT(T4.FName,charindex('-',T4.FName)-1) Else T4.FName End FHospNameOk ,                               
		ISNULL(Prov.FName,ISNULL(t4.FProvince,'')) AS FProvince,                      
		ISNULL(City.FName,isnull(t4.FCity ,''))AS FCity,                
		ISNULL(HospLev.FName,isnull(t4.F_113 ,''))AS FHospLevelName,              
		                          
		--客户 Info                            
		 t1.FCustID ,           
		 T3.FNumber AS FCustNum,                             
		 ISNULL(t5.FName,t3.FName) AS FCustNameOk,                              
		 Left(ISNULL(t5.FName,t3.FName),6)  AS FCustNameShort ,                            
		--数量                            
		 t1.FQty,T1.FNote   ,                            
		 t1.FAreaID,Area.FName AS FAreaName ,      
		 t1.FBigAreaID,BigArea.FName AS FBigAreaName    ,
		 --商务负责人
		 T1.fswEmpID,swEmp.FName AS FswEmpName                                             
		                             
		FROM                             
		t_JWsaleEntry T1                            
		----INNER Join #SALE_TABLE Mgr1 On Mgr1.FEntryID=T1.FEntryID                             
		Left JOIN t_Emp T2 ON T1.FEmpID=T2.FItemID                            
		Left JOIN t_Organization T3 ON T3.FItemID=T1.FCustID                            
		Left JOIN t_Organization T4 ON T1.FHospID=T4.FItemID                        
		Left Join a_Cust t5 On t1.FCustID=t5.FCustID And t5.FDef=1                            
		Left Join t_SubMessage Area On T1.FAreaID=Area.FInterID                   
		Left Join t_SubMessage BigArea On T1.FBigAreaID=BigArea.FInterID          
		Left Join                           
		( --各个区域、在职区域经理表（不包括南北中国区）                    
		 Select  t1.Fgw FAreaID,MAX(t2.FEmp2) As FMgrID                    
		 From a_qygl t1                    
		 Left Join a_qyglEntryJL t2 On t1.FID=t2.FID And t2.FOnDuty=1                     
		 Group By t1.Fgw                    
		) AreaMgr On AreaMgr.FAreaID=t1.FAreaID          
		Left Join                           
		( --南北中国区经理      
		 Select  t1.Fnbqgw FBigAreaID,MAX(t2.FEmp2) As FBigAreaMgrID       
		 From t_Nbqgl t1         
		 inner Join t_NbqglEntryNB t2 On t2.FID=t1.FID  And t2.FOnDuty=1 And t1.FgwType='2' --大区经理      
		 Group by t1.Fnbqgw                 
		) BigAreaMgr On BigAreaMgr.FBigAreaID=t1.FBigAreaID        
		Left Join      
		( --总监      
		 Select  t3.Fqygw FBigAreaID,MAX(t2.FEmp2) As FDirectorID       
		 From t_Nbqgl t1         
		 Inner Join t_NbqglEntryNB t2 On t2.FID=t1.FID  And t2.FOnDuty=1 And t1.FgwType='3' --总监      
		 INNER Join t_NbqglEntryQY t3 On t3.FID=t2.FID       
		 Group by t3.Fqygw                 
		) Director On Director.FBigAreaID=t1.FAreaID               
		Left Join t_Emp Mgr on Mgr.FItemID =AreaMgr.FMgrID                      
		Left Join t_Emp BAreaMgr on BAreaMgr.FItemID =BigAreaMgr.FBigAreaMgrID        
		Left Join t_Emp Dir on Dir.FItemID =Director.FDirectorID        
		Left join CN_ProvinceCity prov On t4.FProvinceID= Prov.FID                
		Left Join CN_ProvinceCity City On t4.FCityID=City.FID                   
		Left Join t_submessage HospLev on t4.F_113=HospLev.FInterID and HospLev.FParentID=10003        
		--商务负责人
		Left Join t_Emp swEmp on swEmp.FItemID= T1.fswEmpID                  
		Where t1.FID in(select Top 1 FID from t_JWsale Where FYear=@FYEAR And FMonth=@FMONTH And FVersion=@VERSION AND FLB=(SELECT FInterID FROM t_SubMessage WHERE FParentID=10008 AND FName=@LB))                      
		And                        
		(              
		 --客服部、副总、商务部              
		  @UserType='不受限用户'               
		  --南北区经理、区域经理 、总监             
		  or (@UserType='销售经理'               
		   And T1.FAreaID IN               
		   (                  
			--南北中国区经理找出对于大区                    
			 Select t1.Fqygw as FAreaID From t_NbqglEntryQY                        
			 t1 Where t1.FID in              
			 (              
			  Select FID from t_NbqglEntryNB where FEmp2=@EmpID              
			 )                        
			 Union                   
			 --区域经理对应的几个区域                    
			 Select Fgw from a_qygl Where Fid in(Select FId From a_qyglEntryJL Where FEmp2 =@empID And FOnDuty=1)                         
			)                   
		  )              
		  --销售助理              
		   or (@UserType='销售助理'               
		   And T1.FAreaID IN               
		   (                  
			--南北中国区经理找出对于大区                    
			 Select t1.Fqygw as FAreaID From t_NbqglEntryQY                        
			 t1 Where t1.FID in              
			 (              
			  Select FID from t_NbqglEntryNB where FEmp2=@EmpID And FOnDuty=1              
			 )                            
			  --And t1.FID In(Select FID from t_Nbqgl Where Fnbqgw=(Select FInterID from t_SubMessage where FParentID=10008 And FName='销售助理'))                 
			  And t1.FID In(Select FID from t_Nbqgl Where FgwType='1' ) --销售助理                
			)                  
		  )               
		  --销售代表                
		  Or  (@UserType='销售代表' And T1.FEmpID=@EmpID)    
		   --商务代表                  
		  Or  (@UserType='商务代表' And T1.FswEmpID=@EmpID)             
		)                        
			END                        
                              
                               
SET NOCOUNT OFF 