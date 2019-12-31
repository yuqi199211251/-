USE [JWMS_TEST]
GO
-- ================================================================  
-- Author:Frank
-- Create date:07/08/2019  
-- Description:获取用户提交的所有反馈信息
-- exec JM_getFeedbackNumberListProfile 16641
-- ================================================================  
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
ALTER PROCEDURE [dbo].[JM_getFeedbackNumberListProfile] 
(	
	@FUserID int
)
as
begin
	declare @FeedbackNote nvarchar(200)
	declare @embeddedSecurity int
	declare @stentsFallOff int
	declare @cardGodet int
	declare @unpackFindProblem int
	declare @otherQuality int
	declare @otherQualityProblems nvarchar(200)
	
	--CREATE TABLE 
	CREATE TABLE #EntryOrder (Fid [int] IDENTITY (1, 1) NOT NULL ,FkbgFid int,FBillNo nvarchar(100),hospitalName nvarchar(100) , agentName NVARCHAR(100),Fhhzt NVARCHAR(100),FNumber NVARCHAR(100),
	embeddedSecurity NVARCHAR(100), stentsFallOff NVARCHAR(100), cardGodet NVARCHAR(100), unpackFindProblem NVARCHAR(100), otherQualityProblems NVARCHAR(100), createTime datetime)
	
	INSERT INTO #EntryOrder (FkbgFid,FBillNo, hospitalName , agentName ,Fhhzt,FNumber,embeddedSecurity,stentsFallOff,cardGodet,unpackFindProblem,otherQualityProblems,createTime)
	select af.FID as FkbgFid,af.FBillNo,tor.FName as hospitalName,af.F3_1 as agentName,af.Fhhzt,af.F6_5 as FNumber,
	case af.F1_1 when 1 then '植入保障' else '' end as embeddedSecurity,
	case af.F1_2 when 1 then '支架脱落' else '' end as stentsFallOff,
	case af.F1_3 when 1 then '卡导线' else '' end as cardGodet,
	case af.F1_4 when 1 then '拆包即发现问题' else '' end as unpackFindProblem,
	case af.F1_5 when 1 then F1_6 else '' end as otherQualityProblems,
	convert(varchar(100),af.fdzdate,20) as fdzdate
	from a_Fkbg af left join t_Organization tor on tor.FItemID = af.FYY where FBiller = @FUserID
	
	select eoo.FkbgFid,eoo.FBillNo, eoo.hospitalName , eoo.agentName ,ts.FName as Fhhzt,eoo.FNumber,eoo.embeddedSecurity+eoo.stentsFallOff+eoo.cardGodet+eoo.unpackFindProblem+eoo.otherQualityProblems as FeedbackAbstract,eoo.createTime from #EntryOrder eoo
	inner join t_SubMessage ts on eoo.Fhhzt = ts.FInterID and ts.FTypeID = 10004 order by eoo.FkbgFid desc
	

	
	DROP TABLE #EntryOrder
end