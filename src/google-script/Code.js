function doGet(e) {
  return ContentService.createTextOutput("Survey Backend is Active. Use POST to submit data.");
}

function doPost(e) {
  var lock = LockService.getScriptLock();
  lock.tryLock(10000);

  try {
    // You must create a Sheet manually first and paste its ID here
    // Open a Google Sheet -> Copy ID from URL: https://docs.google.com/spreadsheets/d/YOUR_ID_HERE/edit
    var SPREADSHEET_ID = "1W9GU1u0bFP2OLAvdxKqKZMGF3OtgN3siwcqHxljfqrU"; 
    
    var doc;
    try {
       doc = SpreadsheetApp.openById(SPREADSHEET_ID);
    } catch(err) {
       // Return error if sheet cannot be opened (avoids needing Drive scope for .create)
       return ContentService
         .createTextOutput(JSON.stringify({ "result": "error", "error": "Invalid Spreadsheet ID or Permission Denied. Please check SPREADSHEET_ID in Code.js" }))
         .setMimeType(ContentService.MimeType.JSON);
    }

    var sheet = doc.getSheets()[0];
    
    // Parse data - handle different content types if necessary
    var data = JSON.parse(e.postData.contents);
    
    // Get existing headers or initialize empty array
    var lastCol = sheet.getLastColumn();
    var headers = [];

    if (lastCol > 0) {
      headers = sheet.getRange(1, 1, 1, lastCol).getValues()[0];
    }

    // Initialize headers if sheet is empty
    if (headers.length === 0) {
      // Create headers from the keys of the incoming data object
      // Always include 'Timestamp' as the first column
      var keys = Object.keys(data);
      headers = ["Timestamp"].concat(keys);
      sheet.appendRow(headers);
    } else {
        // Basic schema evolution: Check if new fields exist in data but not headers
        var newKeys = Object.keys(data).filter(k => headers.indexOf(k) === -1);
        if (newKeys.length > 0) {
             // Append new headers to the first row
             var lastCol = headers.length; 
             sheet.getRange(1, lastCol + 1, 1, newKeys.length).setValues([newKeys]);
             // Update our local headers array
             headers = headers.concat(newKeys);
        }
    }
    
    // Map data to headers
    var row = [new Date()];
    for (var i = 1; i < headers.length; i++) {
      var key = headers[i];
      // Convert arrays to strings for readability
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


function doGet(e) {
  return ContentService.createTextOutput("Survey API is running.");
}