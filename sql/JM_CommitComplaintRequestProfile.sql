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
	@FID int,
	@hospitalId int,
	@distributorId int,
	@FUserID int,
	@dealAbsentLesion nvarchar(50),
	@ProductTypeId int,
	@embeddedSecurity nvarchar(50),
	@documentDate nvarchar(50),
	@stentsFallOff nvarchar(50),
	@cardGodet nvarchar(50),
	@unpackFindProblem nvarchar(50),
	@otherQuality nvarchar(50),
	@otherQualityProblems nvarchar(50),
	@electronicCertificate nvarchar(50),
	@distributorName nvarchar(50),
	@hospitalName nvarchar(50),
	@hospitalLevel nvarchar(50),
	@distributorPhone nvarchar(50),
	@surgeon nvarchar(50),
	@workingExperience nvarchar(50),
	@salesman nvarchar(50),
	@doctorPhone nvarchar(50),
	@surgeryDate nvarchar(50),
	@PatientSex nvarchar(50),
	@PatientAge nvarchar(50),
	@isIntoBody nvarchar(50),
	@problemTime nvarchar(50),
	@diagnosis nvarchar(50),
	@isPressure nvarchar(50),
	@diseasedRegion nvarchar(50),
	@diseasedRegionDetails nvarchar(50),
	@isPreExpansion nvarchar(50),
	@isRatedPressure nvarchar(50),
	@productNumber nvarchar(50),
	@productName nvarchar(50),
	@isCalcification nvarchar(50),
	@isCurved nvarchar(50),
	@productModel nvarchar(50),
	@batchNumber nvarchar(50),
	@expiryDate nvarchar(50),
	@isToDisinfect nvarchar(50),
	@isTechnologyAssessment nvarchar(50),
	@gtbasotc nvarchar(50),
	@packaging nvarchar(50),
	@balloonCatheter nvarchar(50),
	@SupportHead nvarchar(50),
	@leadWire nvarchar(50),
	@OtherEvaluationContents nvarchar(50),
	@OtherEvaluationContentsDetails nvarchar(50),
	@basogw nvarchar(50),
	@isCd nvarchar(50),
	@brandSpecificationBalloonCatheter nvarchar(50),
	@otherNote nvarchar(50),
	@clinicalOutcome nvarchar(50),
	@patientInjury nvarchar(50),
	@patientComplication nvarchar(50),
	@complicationDetail nvarchar(50),
	@selectedSite nvarchar(50),
	@isSurgery nvarchar(50),
	@doctorSuggests nvarchar(50),
	@incidentDescription nvarchar(50),
	@email nvarchar(50),
	@FFXSPlaId int,
	@FFXSPlaName nvarchar(50)
)
AS
BEGIN
 set nocount on 
 DECLARE @Fkbh varchar(80)
 DECLARE @lHhzt INT
 DECLARE @FStatus INT
 DECLARE @digitalSealId INT
 
 BEGIN TRANSACTION
	

	UPDATE a_Fkbg
        set F1_1 = @embeddedSecurity,
            F1_2 = @stentsFallOff,
            F1_3 = @cardGodet,
            F1_4 = @unpackFindProblem,
            F1_5 = @otherQuality,
            F1_6 = @otherQualityProblems,
			F2_1 = @hospitalName,
            F2_2 = @hospitalLevel,
            F2_3 = @surgeon,
            F2_4 = @workingExperience,
            F2_5 = @doctorPhone,
            F2_6 = @surgeryDate,
			F3_1 = @distributorName,
            F3_2 = @distributorPhone,
            F3_3 = @salesman,
			F3_4 = @email,
			F4_1 = @PatientSex,
            F4_2 = @PatientAge,
            F4_3 = @diagnosis,
            F4_4 = @diseasedRegion,
			F5_1 = @isIntoBody,
            F5_2 = @problemTime,
            F5_3 = @isPressure,
            F5_4 = @diseasedRegionDetails,
            F5_5 = @isPreExpansion,
            F5_6 = @isRatedPressure,
			F5_7 = @isCalcification,
            F5_8 = @isCurved,
            F5_9 = @isToDisinfect,
            F5_10 = @gtbasotc,
            F5_11 = @basogw,
            F5_12 = @brandSpecificationBalloonCatheter,
			F5_13 = @dealAbsentLesion,
			F6_1 = @productName,
            F6_2 = @productModel,
            F6_3 = @batchNumber,
            F6_4 = @expiryDate,
            F6_5 = @productNumber,
            F6_6 = @isTechnologyAssessment,
			F6_7 = @packaging,
            F6_8 = @balloonCatheter,
            F6_9 = @SupportHead,
            F6_10 = @leadWire,
            F6_11 = @OtherEvaluationContentsDetails,
            F6_12 = @isCd,
			F6_13 = @doctorSuggests,
			F6_14 = @otherNote,
			F7_1 = @clinicalOutcome,
            F7_2 = @patientInjury,
            F7_3 = @patientComplication,
            F7_4 = @complicationDetail,
            F7_5 = @selectedSite,
            F7_6 = @isSurgery,
			F7_7 = @incidentDescription,
			FYY = @hospitalId,
			FFXS = @distributorId,
			--fdzzs = @electronicCertificate,
			t_DJLB = @ProductTypeId,
			FFXSPla = @FFXSPlaId,
			FFXSPlaName = @FFXSPlaName
        where FID = @FID



	SELECT @Fkbh = FBillNo FROM a_Fkbg WHERE FID = @FID

	delete from ICClassCheckRecords200000013 Where FBillID =@FID
	delete from ICClassCheckStatus200000013 where FBillID = @FID

	Insert Into ICClassCheckStatus200000013 (FPage,FBillID,FBillEntryID,FBillEntryIndex,FCurrentLevel) Values (1,@FID,0,0,0)

	Insert Into ICClassCheckRecords200000013(FPage,FBillID,FBillEntryID,FBillNo, FBillEntryIndex,FCheckLevel,FCheckLevelTo,FMode,FCheckMan, FCheckIdea,FCheckDate,FDescriptions) 
        Values (1,@FID,0,@Fkbh,0,-1,-1,0, @FUserID,'',GetDate(),'审核')

	Insert Into ICClassCheckRecords200000013(FPage,FBillID,FBillEntryID,FBillNo, FBillEntryIndex,FCheckLevel,FCheckLevelTo,FMode,FCheckMan, FCheckIdea,FCheckDate,FDescriptions)
		Values (1,@FID,0, @Fkbh,0,-1, 1,0,@FUserID,'',GetDate(),'审核')

	Update ICClassCheckStatus200000013 Set  FBillNo = @Fkbh, FCurrentLevel = FCurrentLevel + 1, FCheckMan1 = @FUserID, FCheckDate1 = GetDate(), FCheckIdea1 = ''
		Where FBillID = @FID And FPage = 1 And FBillEntryID = 0 

	Update a_Fkbg Set FHhzt = (Select FInterID from t_Submessage where FParentID = 10004 and FID = '01') where FID = @FID

	Select @lHhzt = FInterID from t_Submessage where FParentID = 10004 and FID = '01'

	INSERT INTO [A_Fkbg_checkLog] ([FBillID],[FBillNo],[FCheckMan],[FOperationID],[FCheckIdea],[FPreCheckDate],[FCheckDate],[FDescriptions])
                VALUES(@FID,@Fkbh,@FUserID,@lHhzt,'',NULL,GETDATE(),'提交反馈报告')

	if exists(Select a.* From t_Item  a INNER JOIN t_ItemClass b ON a.FItemClassID=b.FItemClassID where b.FNumber= 'FKStatus' and a.FNumber = '02')
		Select @FStatus = a.FItemID From t_Item  a INNER JOIN t_ItemClass b ON a.FItemClassID=b.FItemClassID where b.FNumber= 'FKStatus' and a.FNumber = '02'
	else
		set @FStatus = 0

	--IF (@electronicCertificate <> '')
		--BEGIN
			--select @digitalSealId = t2.FID from t_BOSWqianzhang t1 inner join t_Accessory t2 on  t1.FID = t2.FItemID  and t2.FTypeID = 200000039 and t1.Fzt = 0 where t1.fbillno = Left(@electronicCertificate, CHARINDEX('|',@electronicCertificate) - 1)
			--update a_Fkbg  set fdzzs =  @electronicCertificate,fdzdate = getdate(),digitalSealId = @digitalSealId from a_Fkbg where FID = @FID
		--END
	

	Select a.FDate as documentDate,a.fid,a.FBillNo as feedbackNumber,a.Fhhzt,a.F1_1 as embeddedSecurity,a.F1_2 as stentsFallOff,a.F1_3 as cardGodet,a.F1_4 as unpackFindProblem,a.F1_5 as otherQuality,a.F1_6 as otherQualityProblems,
	a.F2_1 as hospitalName,a.F2_2 as hospitalLevel,a.F2_3 as surgeon,a.F2_4 as workingExperience,a.F2_5 as doctorPhone,a.F2_6 as surgeryDate,
	a.F3_1 as distributorName,a.F3_2 as distributorPhone,a.F3_3 as salesman,a.F4_1 as PatientSex,a.F4_2 as PatientAge,a.F4_3 as diagnosis,a.F4_4 as diseasedRegion,
	a.F5_1 as isIntoBody,a.F5_2 as problemTime,a.F5_3 as isPressure,a.F5_4 as diseasedRegionDetails,a.F5_5 as isPreExpansion,a.F5_6 as isRatedPressure,
	a.F5_7 as isCalcification,a.F5_8 as isCurved,a.F5_9 as isToDisinfect,a.F5_10 as gtbasotc,a.F5_11 as basogw,a.F5_12 as brandSpecificationBalloonCatheter,a.F5_13 as dealAbsentLesion,
	a.F6_1 as productName,a.F6_2 as productModel,a.F6_3 as batchNumber,a.F6_4 as expiryDate,a.F6_5 as productNumber,a.F6_6 as isTechnologyAssessment,a.F6_7 as packaging,
	a.F6_8 as balloonCatheter,a.F6_9 as SupportHead,a.F6_10 as leadWire,a.F6_11 as OtherEvaluationContentsDetails,a.F6_12 as isCd,a.F6_13 as doctorSuggests,a.F6_14 as otherNote,
	a.F7_1 as clinicalOutcome,a.F7_2 as patientInjury,a.F7_3 as patientComplication,a.F7_4 as complicationDetail,a.F7_5 as selectedSite,a.F7_6 as isSurgery,a.F7_7 as incidentDescription,
	a.FYY as hospitalId,a.FFXS as distributorId,w.fname as ProductTypeName,a.t_DJLB as ProductTypeId,a.F3_4 as email From a_Fkbg a left join t_SubMessage w on a.t_DJLB = w.FInterID AND w.FInterID <>0  WHERE a.FID = @FID

	
	
	


	IF @@ERROR <> 0 

		ROLLBACK TRANSACTION
 	ELSE
		COMMIT  TRANSACTION
END
