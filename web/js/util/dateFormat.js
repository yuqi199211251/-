$scope.dateToString = function(date){
    var dateTime;
    if(typeof date == 'string'){
        dateTime = date.substring(0,10);
    }else {
        var year = date.getFullYear(); 
        var month =(date.getMonth() + 1).toString(); 
        var day = (date.getDate()).toString();  
        if (month.length == 1) { 
            month = "0" + month; 
        } 
        if (day.length == 1) { 
            day = "0" + day; 
        }
        dateTime = year + "-" + month + "-" + day;
    }
    return dateTime;
}