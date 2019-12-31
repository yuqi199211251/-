'use strict';

const sqlSvc=require("./sqlService");
  //get user List
  exports.getPerformanceReporterList=function(param){
    //dummy code
    let salesPromotionData=require("./../config/salesPromotionData.json");
    let businessPrice=require("./../config/businessPrice.json");
    let people=require("./../config/people.json");
    return {salesPromotionData:salesPromotionData,businessPrice:businessPrice,people:people,}
  }


  


  