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
       // Fallback: Create one if ID is invalid (will create a new file every time if not fixed)
       doc = SpreadsheetApp.create("Survey Responses (Backup)");
    }

    var sheet = doc.getSheets()[0];
    
    // Parse data - handle different content types if necessary
    var data = JSON.parse(e.postData.contents);
    
    // Get headers from the first row to ensure column consistency
    var headers = sheet.getRange(1, 1, 1, sheet.getLastColumn()).getValues()[0];
    
    // If sheet is empty, create headers from the first response
    if (headers.length === 0 || (headers.length === 1 && headers[0] === "")) {
      headers = ["Timestamp"].concat(Object.keys(data));
      sheet.appendRow(headers);
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