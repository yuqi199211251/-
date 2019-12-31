USE [JWMS_TEST]
GO
-- ================================================================  
-- Author:Frank
-- Create date:06/04/2019  
-- Description:新增或修改投诉反馈数据
-- exec JM_InsertComplaintRequestProfile '20190311001','支架系统' 
-- ================================================================  
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
ALTER PROCEDURE [dbo].[JM_InsertComplaintRequestProfile] 
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
 DECLARE @TmpID INT 
 DECLARE @fprojectval varchar(80) 
 DECLARE @Fkbh varchar(80)
 DECLARE @FHhzt INT
 
 

 Select @FHhzt = FInterID from t_Submessage where FParentID = 10004 and FID = '001'

 select @hospitalName = FName from t_Organization too where too.FItemID =@hospitalId;

 IF (@FID <> -1) 
	begin
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
	end
else
	begin
		select  @fprojectval=''  SET @TmpID = (SELECT FID FROM t_BillCodeRule WITH(READUNCOMMITTED) WHERE fbilltypeid='200000013' and fprojectid=3)
		update t_billcoderule set fprojectval = fprojectval+1,@fprojectval=isnull(fprojectval,1),flength=case when (flength-len(fprojectval)) >= 0 then flength else len(fprojectval) end where FID = @TmpID
		select @Fkbh = right('000000'+FProjectVal,FLength) from t_billcoderule where FBilltypeid = 200000013 
		--select @Fkbh = '000000'+FProjectVal from t_billcoderule where FBilltypeid = 200000013 
		--select @Fkbh = right(@Fkbh,FLength) from t_billcoderule where FBilltypeid = 200000013 

        declare @P1 int  set @P1=1001 exec GetICMaxNum 'a_Fkbg', @P1 output select @FID = @P1  

		insert into a_Fkbg 
		(FHhzt,FID,FClassTypeID,FBillNo,FBiller,FDate,FCustID,F1_1,F1_2,F1_3,F1_4,F1_5,F1_6,F2_1,F2_2,F2_3,F2_4,F2_5,F2_6,
		F3_1,F3_2,F3_3,F3_4,F4_1,F4_2,F4_3,F4_4,
		F5_1,F5_2,F5_3,F5_4,F5_5,F5_6,F5_7,F5_8,F5_9,F5_10,F5_11,F5_12,F5_13,
		F6_1,F6_2,F6_3,F6_4,F6_5,F6_6,F6_7,F6_8,F6_9,F6_10,F6_11,F6_12,F6_13,F6_14,
		F7_1,F7_2,F7_3,F7_4,F7_5,F7_6,F7_7,FYY,FFXS,t_DJLB,FFXSPla,FFXSPlaName
		) 
		values 
		(@FHhzt,@FID,200000013,@Fkbh,@FUserID,@documentDate,@hospitalId,@embeddedSecurity,@stentsFallOff,@cardGodet,@unpackFindProblem,@otherQuality,@otherQualityProblems,@hospitalName,@hospitalLevel,@surgeon,@workingExperience,@doctorPhone,@surgeryDate,
		@distributorName,@distributorPhone,@salesman,@email,@PatientSex,@PatientAge,@diagnosis,@diseasedRegion,
		@isIntoBody,@problemTime,@isPressure,@diseasedRegionDetails,@isPreExpansion,@isRatedPressure,@isCalcification,@isCurved,@isToDisinfect,@gtbasotc,@basogw,@brandSpecificationBalloonCatheter,@dealAbsentLesion,
		@productName,@productModel,@batchNumber,@expiryDate,@productNumber,@isTechnologyAssessment,@packaging,@balloonCatheter,@SupportHead,@leadWire,@OtherEvaluationContentsDetails,@isCd,@doctorSuggests,@otherNote,
		@clinicalOutcome,@patientInjury,@patientComplication,@complicationDetail,@selectedSite,@isSurgery,@incidentDescription,@hospitalId,@distributorId,@ProductTypeId,@FFXSPlaId,@FFXSPlaName
		)
	end

	--SELECT a.fdzzs,a.FBiller, a.FDate, a.FBillNO, a.FID, i0.FName AS FUserName, F6_5 AS FSerialNum, ISNULL(b.Fname, a.F2_1) AS FName, F6_2
	--, i1.FName AS FCheckName1, i.FCheckDate1, i2.FName AS FCheckName2, i.FCheckDate2, s.Fname AS FHhzt_CurrName, w.fname AS lieBie
	--, CASE WHEN a.ffj = '1' THEN '有图片' ELSE '' END AS picture, a.FMailDate, a.FMailNumber
	--, (SELECT MAX(FCheckDate) AS FCurCheckDate FROM ICClassCheckRecords200000013 WHERE ICClassCheckRecords200000013.FBillID = a.FID) AS FCurCheckDate
	--FROM a_Fkbg a LEFT JOIN t_Organization b ON a.FYY = b.FItemID LEFT JOIN t_Organization c ON a.FFXS = c.FItemID LEFT JOIN ICClassCheckStatus200000013 i ON a.FID = i.FBillID
	--LEFT JOIN t_User i0 ON a.FBiller = i0.FUserID LEFT JOIN t_User i1 ON i.FCheckMan1 = i1.FUserID LEFT JOIN t_User i2 ON i.FCheckMan2 = i2.FUserID AND i2.FUserID <> 0
	--LEFT JOIN t_SubMessage w ON a.t_DJLB = w.FInterID AND w.FInterID <> 0 LEFT JOIN t_SubMessage s ON a.Fhhzt = s.FInterID 
	--WHERE (b.FitemID IN (SELECT FitemID FROM view_Cust WHERE FuserID = @FUserID) OR a.FBiller = @FUserID) order by a. FDate desc

	Select a.FDate as documentDate,a.fid,a.FBillNo as feedbackNumber,a.Fhhzt,a.F1_1 as embeddedSecurity,a.F1_2 as stentsFallOff,a.F1_3 as cardGodet,a.F1_4 as unpackFindProblem,a.F1_5 as otherQuality,a.F1_6 as otherQualityProblems,
	a.F2_1 as hospitalName,a.F2_2 as hospitalLevel,a.F2_3 as surgeon,a.F2_4 as workingExperience,a.F2_5 as doctorPhone,a.F2_6 as surgeryDate,
	a.F3_1 as distributorName,a.F3_2 as distributorPhone,a.F3_3 as salesman,a.F4_1 as PatientSex,a.F4_2 as PatientAge,a.F4_3 as diagnosis,a.F4_4 as diseasedRegion,
	a.F5_1 as isIntoBody,a.F5_2 as problemTime,a.F5_3 as isPressure,a.F5_4 as diseasedRegionDetails,a.F5_5 as isPreExpansion,a.F5_6 as isRatedPressure,
	a.F5_7 as isCalcification,a.F5_8 as isCurved,a.F5_9 as isToDisinfect,a.F5_10 as gtbasotc,a.F5_11 as basogw,a.F5_12 as brandSpecificationBalloonCatheter,a.F5_13 as dealAbsentLesion,
	a.F6_1 as productName,a.F6_2 as productModel,a.F6_3 as batchNumber,a.F6_4 as expiryDate,a.F6_5 as productNumber,a.F6_6 as isTechnologyAssessment,a.F6_7 as packaging,
	a.F6_8 as balloonCatheter,a.F6_9 as SupportHead,a.F6_10 as leadWire,a.F6_11 as OtherEvaluationContentsDetails,a.F6_12 as isCd,a.F6_13 as doctorSuggests,a.F6_14 as otherNote,
	a.F7_1 as clinicalOutcome,a.F7_2 as patientInjury,a.F7_3 as patientComplication,a.F7_4 as complicationDetail,a.F7_5 as selectedSite,a.F7_6 as isSurgery,a.F7_7 as incidentDescription,
	a.FYY as hospitalId,a.FFXS as distributorId,w.fname as ProductTypeName,a.FDZZS AS electronicCertificate,a.t_DJLB as ProductTypeId,a.F3_4 as email From a_Fkbg a left join t_SubMessage w on a.t_DJLB = w.FInterID AND w.FInterID <>0  WHERE a.FID = @FID
END
