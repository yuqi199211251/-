USE [JWMS_TEST]
GO
-- ================================================================  
-- Author:Frank
-- Create date:06/13/2019  
-- Description:提交投诉反馈数据
-- exec JM_CommitComplaintRequestProfile '20190311001','支架系统' 
-- ================================================================  
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
ALTER PROCEDURE [dbo].[JM_CommitComplaintRequestProfile] 
(	
	@fid int,
	@FUserID int,
	@electronicCertificate nvarchar(50)
)
AS
BEGIN
 set nocount on 
 DECLARE @Fkbh varchar(80)
 DECLARE @lHhzt INT
 DECLARE @FStatus INT
 
 BEGIN TRANSACTION
	
	SELECT @Fkbh = FBillNo FROM a_Fkbg WHERE FID = @fid

	delete from ICClassCheckRecords200000013 Where FBillID =@fid
	delete from ICClassCheckStatus200000013 where FBillID = @fid

	Insert Into ICClassCheckStatus200000013 (FPage,FBillID,FBillEntryID,FBillEntryIndex,FCurrentLevel) Values (1,@fid,0,0,0)

	Insert Into ICClassCheckRecords200000013(FPage,FBillID,FBillEntryID,FBillNo, FBillEntryIndex,FCheckLevel,FCheckLevelTo,FMode,FCheckMan, FCheckIdea,FCheckDate,FDescriptions) 
        Values (1,@fid,0,@Fkbh,0,-1,-1,0, @FUserID,'',GetDate(),'审核')

	Insert Into ICClassCheckRecords200000013(FPage,FBillID,FBillEntryID,FBillNo, FBillEntryIndex,FCheckLevel,FCheckLevelTo,FMode,FCheckMan, FCheckIdea,FCheckDate,FDescriptions)
		Values (1,@fid,0, @Fkbh,0,-1, 1,0,@FUserID,'',GetDate(),'审核')

	Update ICClassCheckStatus200000013 Set  FBillNo = @Fkbh, FCurrentLevel = FCurrentLevel + 1, FCheckMan1 = @FUserID, FCheckDate1 = GetDate(), FCheckIdea1 = ''
		Where FBillID = @fid And FPage = 1 And FBillEntryID = 0 

	Update a_Fkbg Set FHhzt = (Select FInterID from t_Submessage where FParentID = 10004 and FID = '01') where FID = @fid

	Select @lHhzt = FInterID from t_Submessage where FParentID = 10004 and FID = '01'

	INSERT INTO [A_Fkbg_checkLog] ([FBillID],[FBillNo],[FCheckMan],[FOperationID],[FCheckIdea],[FPreCheckDate],[FCheckDate],[FDescriptions])
                VALUES(@fid,@Fkbh,@FUserID,@lHhzt,'',NULL,GETDATE(),'提交反馈报告')

	if exists(Select a.* From t_Item  a INNER JOIN t_ItemClass b ON a.FItemClassID=b.FItemClassID where b.FNumber= 'FKStatus' and a.FNumber = '02')
		Select @FStatus = a.FItemID From t_Item  a INNER JOIN t_ItemClass b ON a.FItemClassID=b.FItemClassID where b.FNumber= 'FKStatus' and a.FNumber = '02'
	else
		set @FStatus = 0

	IF (@electronicCertificate <> '')
		BEGIN
			update a_Fkbg  set fdzzs =  @electronicCertificate,fdzdate = getdate() from a_Fkbg where FID = @fid
			if exists(SELECT * FROM WWW_DZZS_HH WHERE fbillno  = @fid)
				begin
					delete  FROM WWW_DZZS_HH WHERE fbillno  =  @fid
					if exists(select 1 from t_BOSWqianzhang t1 inner join t_Accessory t2 on  t1.FID = t2.FItemID  and t2.FTypeID = 200000039 and t1.Fzt = 0 where t1.fbillno =  Left(@electronicCertificate, charindex('|',@electronicCertificate) - 1))
						insert into WWW_DZZS_HH (fbillno,fzsnumber) values ( @fid, Left(@electronicCertificate, charindex('|',@electronicCertificate))) 
						update t1 set t1.fdzzs = t3.fdata,t1.FZSname = t3.ffilename from  WWW_DZZS_HH t1 inner join t_BOSWqianzhang  t2 on t1.fzsnumber = t2.fbillno inner join t_Accessory t3 on  t2.FID = t3.FItemID  and t3.FTypeID = 200000039  where t1.fbillno  = @fid
				end
			else
				begin
					if exists(select 1 from t_BOSWqianzhang t1 inner join t_Accessory t2 on  t1.FID = t2.FItemID  and t2.FTypeID = 200000039 and t1.Fzt = 0 where t1.fbillno =  Left(@electronicCertificate, charindex('|',@electronicCertificate) - 1))
						insert into WWW_DZZS_HH (fbillno,fzsnumber) values ( @fid, Left(@electronicCertificate, charindex('|',@electronicCertificate) - 1)) 
						update t1 set t1.fdzzs = t3.fdata,t1.FZSname = t3.ffilename from  WWW_DZZS_HH t1 inner join t_BOSWqianzhang  t2 on t1.fzsnumber = t2.fbillno inner join t_Accessory t3 on  t2.FID = t3.FItemID  and t3.FTypeID = 200000039  where t1.fbillno  = @fid
				end
		END
	

	Select a.FDate as documentDate,a.fid,a.FBillNo as feedbackNumber,a.Fhhzt,a.F1_1 as embeddedSecurity,a.F1_2 as stentsFallOff,a.F1_3 as cardGodet,a.F1_4 as unpackFindProblem,a.F1_5 as otherQuality,a.F1_6 as otherQualityProblems,
	a.F2_1 as hospitalName,a.F2_2 as hospitalLevel,a.F2_3 as surgeon,a.F2_4 as workingExperience,a.F2_5 as doctorPhone,a.F2_6 as surgeryDate,
	a.F3_1 as distributorName,a.F3_2 as distributorPhone,a.F3_3 as salesman,a.F4_1 as PatientSex,a.F4_2 as PatientAge,a.F4_3 as diagnosis,a.F4_4 as diseasedRegion,
	a.F5_1 as isIntoBody,a.F5_2 as problemTime,a.F5_3 as isPressure,a.F5_4 as diseasedRegionDetails,a.F5_5 as isPreExpansion,a.F5_6 as isRatedPressure,
	a.F5_7 as isCalcification,a.F5_8 as isCurved,a.F5_9 as isToDisinfect,a.F5_10 as gtbasotc,a.F5_11 as basogw,a.F5_12 as brandSpecificationBalloonCatheter,a.F5_13 as dealAbsentLesion,
	a.F6_1 as productName,a.F6_2 as productModel,a.F6_3 as batchNumber,a.F6_4 as expiryDate,a.F6_5 as productNumber,a.F6_6 as isTechnologyAssessment,a.F6_7 as packaging,
	a.F6_8 as balloonCatheter,a.F6_9 as SupportHead,a.F6_10 as leadWire,a.F6_11 as OtherEvaluationContentsDetails,a.F6_12 as isCd,a.F6_13 as doctorSuggests,a.F6_14 as otherNote,
	a.F7_1 as clinicalOutcome,a.F7_2 as patientInjury,a.F7_3 as patientComplication,a.F7_4 as complicationDetail,a.F7_5 as selectedSite,a.F7_6 as isSurgery,a.F7_7 as incidentDescription,
	a.FYY as hospitalId,a.FFXS as distributorId,w.fname as ProductTypeName From a_Fkbg a left join t_SubMessage w on a.t_DJLB = w.FInterID AND w.FInterID <>0  WHERE a.FID = @FID

	
	
	


	IF @@ERROR <> 0 

		ROLLBACK TRANSACTION
 	ELSE
		COMMIT  TRANSACTION
END
