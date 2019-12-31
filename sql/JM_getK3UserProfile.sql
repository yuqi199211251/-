
USE [JWMS_TEST]
GO
-- ================================================================  
-- Author:Frank
-- Create date:08/05/2019  
-- Description:获取K3用户信息（用户id和用户类型）
-- exec JM_getK3UserProfile '许佳琦'
-- ================================================================  
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
alter PROCEDURE [dbo].[JM_getK3UserProfile] 
(	
	@userName nvarchar(200)
)
as
begin
	set nocount on 
	declare @iEmpId int
	declare @FUserID int
	declare @FCustID int
	declare @sUserGroup  nvarchar(200)
	declare @sAreaName  nvarchar(200)
	declare @sDeptName  nvarchar(200)
	declare @sDutyName  nvarchar(200)
	declare @positionName nvarchar(200)

	declare @sUserType nvarchar(200)
	
	set @iEmpId = 0
	set @FUserID = 0
	set @FCustID = 0
	set @sUserGroup = ''
	set @sDeptName = ''
	set @sDutyName = ''
	set @sAreaName = ''
	set @positionName = ''


    select @FUserID = FUserID FROM t_User where FName = @userName
	select @FCustID = tor.FItemID from t_User tu inner join t_Organization tor on tu.FDescription = tor.FNumber where tu.FName = @userName
	SELECT @positionName = td.FName,@sDeptName =td.FName,@sDutyName = isnull(t4.FName,'') FROM t_User tu left join t_Emp te on tu.FEmpID = te.FItemID left join t_Department td on te.FDepartmentID = td.FItemID Left Join t_SubMessage t4 ON t4.FinterID=te.FDuty WHERE tu.FName = @userName
	SELECT @iEmpId=T1.FEmpID,@sUserGroup=t3.FName FROM t_User T1 INNER JOIN t_Emp T2 ON T1.FEmpID=T2.FItemID Left Join t_userType t3 On t1.FUserTypeID=t3.FUserID where T1.FName = @userName

	IF @iEmpId!=0
		begin
		 	select @sAreaName = t3.FName from t_Nbqgl t1 Inner join t_NbqglEntryNB t2 on t1.FID=t2.FID inner join t_SubMessage t3 ON t3.FInterID=t1.Fnbqgw Where t2.FOnDuty = 1 AND  T2.FEmp2 = @iEmpId
			if @sAreaName = ''
				begin
					select @sAreaName = t3.FName from a_qygl t1 Inner Join a_qyglEntryJL t2 on t1.fid = t1.fid inner join t_SubMessage t3 on t3.FInterID=t1.Fgw where t2.FOnDuty=1 AND T2.FEmp2 = @iEmpId
				end
		end
	
	IF @sAreaName != ''
		begin
			IF @sUserGroup = '销售助理'
				begin
					set @sUserType = '销售助理'
				end
			else
				set @sUserType = '销售经理'
		end
	else
	IF @sUserGroup = '销售代表'
			begin
				set @sUserType = '销售代表'
			end
	

	IF @sDeptName = '客服部' AND  @userName = '高金秋'
	
		begin
			set @sUserType = '不受限用户'
		end

	IF @sDeptName = '商务部'
		begin
			IF @sDutyName = '商务运营专员' OR @sDutyName = '商务助理'
				begin
					set @sUserType = '不受限用户'
				end
			else
			IF @sDutyName = '商务代表'
				begin
					set @sUserType = '商务代表'
				end
		end
	
	select @FUserID as FUserID,@sUserType as sUserType,@iEmpId as iEmpId,@FCustID as FCustID,@positionName as positionName,@sDeptName as sDeptName

end