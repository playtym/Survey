function doGet(e) {
  // If 'data' param exists, treat as form submission
  if (e && e.parameter && e.parameter.data) {
    return handleSubmission(e.parameter.data);
  }
  return ContentService.createTextOutput("Survey Backend is Active. Use POST to submit data.");
}

function doPost(e) {
  return handleSubmission(e.postData.contents);
}

function handleSubmission(rawData) {
  var lock = LockService.getScriptLock();
  lock.tryLock(10000);

  try {
    var SPREADSHEET_ID = "1W9GU1u0bFP2OLAvdxKqKZMGF3OtgN3siwcqHxljfqrU"; 
    var doc;
    try {
       doc = SpreadsheetApp.openById(SPREADSHEET_ID);
    } catch(err) {
       return ContentService
         .createTextOutput(JSON.stringify({ "result": "error", "error": "Invalid Spreadsheet ID or Permission Denied. ID: " + SPREADSHEET_ID }))
         .setMimeType(ContentService.MimeType.JSON);
    }

    var sheet = doc.getSheets()[0];
    var data = JSON.parse(rawData);
    var lastCol = sheet.getLastColumn();
    var headers = [];

    if (lastCol > 0) {
      headers = sheet.getRange(1, 1, 1, lastCol).getValues()[0];
    } else {
      var keys = Object.keys(data);
      headers = ["Timestamp"].concat(keys);
      sheet.appendRow(headers);
    }

    // Handle new columns dynamically
    var newKeys = Object.keys(data).filter(function(k) { return headers.indexOf(k) === -1; });
    if (newKeys.length > 0) {
         var startCol = headers.length + 1;
         sheet.getRange(1, startCol, 1, newKeys.length).setValues([newKeys]);
         headers = headers.concat(newKeys);
    }
    
    // Create new row
    var row = [new Date()];
    for (var i = 1; i < headers.length; i++) {
      var key = headers[i];
      var val = data[key];
      if (Array.isArray(val)) val = val.join(", ");
      row.push(val || "");
    }
    sheet.appendRow(row);

    return ContentService
      .createTextOutput(JSON.stringify({ "result": "success" }))
      .setMimeType(ContentService.MimeType.JSON);
      
  } catch (e) {
    return ContentService
      .createTextOutput(JSON.stringify({ "result": "error", "error": e.toString() }))
      .setMimeType(ContentService.MimeType.JSON);
  } finally {
    lock.releaseLock();
  }
}