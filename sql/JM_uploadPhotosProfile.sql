
USE [JWMS_TEST]
GO
-- ================================================================  
-- Author:Frank
-- Create date:07/19/2019  
-- Description:存储图片信息
-- exec JM_uploadPhotosProfile 39846,'190006',2019,07,19,'./upload/2019/07/19/img-1f447340-a9c2-11e9-92cb-c9d6b79ffeff.JPEG',16641
-- ================================================================  
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
alter PROCEDURE [dbo].[JM_uploadPhotosProfile] 
(	
	@FkbgFid int,
	@feedbackNumber VarChar(100),
	@year int,
	@month int,
	@day int,
	@photoUrl VarChar(500),
	@FUserID int
)
as
begin
	set nocount on 
	declare @photoId int
	
	declare @p1 int
	set @p1 = 0
	exec GetICMaxNum 't_BOSFeedback_Photos', @p1 output select @photoId = @p1 

	insert into t_BOSFeedback_Photos(FID,FkbgID,FkbgBillNo,Year,Month,day,picture,createUserId) values (@photoId,@FkbgFid,@feedbackNumber,@year,@month,@day,@photoUrl,@FUserID)
	update a_Fkbg set ffj = '1' where fid = @FkbgFid
end