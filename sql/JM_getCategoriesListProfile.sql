
USE [JWMS_TEST]
GO
-- ================================================================  
-- Author:Frank
-- Create date:07/10/2019  
-- Description:获取常量分类信息
-- exec JM_getCategoriesListProfile 'doctor,hospital,electronicCertificate',16641
-- ================================================================  
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
alter PROCEDURE [dbo].[JM_getCategoriesListProfile] 
(	
	@categoriesString nvarchar(200),
	@FUserID int
)
as
begin
	set nocount on 
	declare @categories nvarchar(200)
	declare @FEmpID int
	
	declare CUR_CATEGORIES CURSOR
	FOR
	select FValue from fn_SplitStringToTable(@categoriesString,',')
	OPEN CUR_CATEGORIES
	fetch next from CUR_CATEGORIES into @categories
		while @@FETCH_STATUS = 0
			begin
				IF(@categories = 'doctor')
				BEGIN
					SELECT a.FName AS surgeon FROM t_Item_3002 a INNER JOIN t_Organization b ON a.F_112 = b.FItemID WHERE b.FItemID IN (SELECT FItemID FROM view_Cust WHERE FUserID = @FUserID)
				END
				
				IF(@categories = 'hospital')
				BEGIN
					--SELECT t1.FName from (SELECT DISTINCT f.FitemID AS FCustID, d.FCustID AS FFxsID, e.FNumber AS FFxsNumber, ISNULL(tc.FName, e.FName) AS FFxsName, f.FNumber, f.FName, s.FName AS FYyDj, g.FUserID FROM dbo.a_FxsQxEntry c INNER JOIN dbo.a_FxsQx d ON c.FID = d.FID LEFT JOIN dbo.t_Organization e ON d.FCustID = e.FItemID INNER JOIN dbo.t_Organization f ON c.FCustID1 = f.FItemID
					--LEFT JOIN dbo.t_SubMessage s ON f.F_113 = s.FInterID INNER JOIN t_User g ON g.FDescription = e.FNumber LEFT JOIN a_Cust tc ON d.FCustID = tc.FCustID AND tc.FDef = 1
					--WHERE g.FUserID = @FUserID AND c.FStop = 0 AND f.FitemID <> d.FCustID) t1 WHERE 1 = 1
					
					--SELECT t1.FInterId,t1.FName from (Select ve.FCustID,ve.FNumber,ve.FItemID as FInterId,ve.FName,ve.FYydj,ve.FFxsID,ve.FFxsName,toz.FItemID From  
					--view_EmpCust ve left join t_BOSPTEntry2 tbp ON tbp.FJXSID = ve.FCustID and Getdate() between tbp.FbeginDate and tbp.FendDate 
					--left join t_BOSPT tb on tb.FID = tbp.FID LEFT JOIN t_Organization toz on toz.FItemID = tb.Fcustid  Where ve.FEmpID = (SELECT FEmpID FROM t_User WHERE FUserID = @FUserID)) t1 WHERE 1 = 1
					SELECT @FEmpID = FEmpID FROM t_User WHERE FUserID = @FUserID
					
					Select ve.FItemID as FInterId,ve.FName From  
					view_EmpCust ve left join t_BOSPTEntry2 tbp ON tbp.FJXSID = ve.FCustID and Getdate() between tbp.FbeginDate and tbp.FendDate 
					left join t_BOSPT tb on tb.FID = tbp.FID LEFT JOIN t_Organization toz on toz.FItemID = tb.Fcustid  Where ve.FEmpID = @FEmpID
				END
				
				IF(@categories = 'electronicCertificate')
				BEGIN
					select fbillno +'|'+ fnote as electronicCertificate from t_BOSWqianzhang where  Fzt = 0 and  FBiller = @FUserID
				END

				IF(@categories = 'productType')
				BEGIN
					select FName from t_SubMessage where FTypeID = 10008
				END

				IF(@categories = 'productTypeSerial')
				BEGIN
					select FInterID,FName from t_SubMessage where FTypeID = 10008 and left(FID,2)='11'
				END
				fetch next from CUR_CATEGORIES into @categories
			end
	CLOSE CUR_CATEGORIES
	
	DEALLOCATE CUR_CATEGORIES
end