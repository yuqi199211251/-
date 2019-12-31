const {ExcelReader} = require('node-excel-stream');
const fs = require('fs');
const path = require('path');
const basePath=path.join(__dirname,"../../upload/final-line/final-line-20181128.xlsx")
let missingFields,errorLogs=[];

let dataStream = fs.createReadStream(basePath+'');
let headers=[
  {name: 'Line No',key: 'lineNo'} 
  ,{name: 'Project Code',key: 'workOrder'}
  ,{name: 'Operation',key: 'operation'}
  ,{name: 'Scan Barcode (Label)',key: 'scanBarcodeLabel'}
  ,{name: 'Scan Barcode (Foil Bag)',key: 'scanBarcodeFoilBag'}
  ,{name: 'Serial No (Label)',key: 'serialNoLabel'}
  ,{name: 'Serial No (Foil bag)',key: 'serialNoFoilBag'}
  ,{name: 'Accept/Reject',key: 'acceptReject'}
  ,{name: 'OK / Wrong',key: 'okWrong'}
  ,{name: 'User',key: 'user'}
]
let reader = new ExcelReader(dataStream, {
    sheets: [{
        name: 'template',
        rows: {
            headerRow: 1,
            allowedHeaders:headers
        }
      },{
        name: 'instruction'
    }]
})
reader.eachRow(function(row, rowNum, sheetSchema) {
    
    // console.log("Insert into dbo.SAP_EANCodes values('"+rowData.EAN+"','"+rowData.material+"',"+rowData.convertUnit+")");
    // console.log(row.barcode+"--"+row.carton);
    missingFields=[];
    headers.forEach(function(col){
      if (!row[col.key]){
        missingFields.push(col.name);
      }
    })

    if (missingFields.length===0){
      console.log(`${row.lineNo},${row.workOrder},${row.operation},${row.scanBarcodeLabel},${row.scanBarcodeFoilBag},${row.serialNoLabel},${row.serialNoFoilBag},${row.acceptReject},${row.okWrong},${row.user}`)
    } else if(missingFields.length<9){
      errorLogs.push(`Missing Fields:${missingFields.join(",")} in line ${rowNum}`)
    }
    
})
.then(function() {
    console.log('done parsing');
    if (errorLogs.length>0){
      console.log('The folllowing lines are not processed due to:');
      
      errorLogs.forEach(function(log){
        console.log(log);
      })
    }
});