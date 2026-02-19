function doPost(e) {
  var lock = LockService.getScriptLock();
  lock.tryLock(10000);

  try {
    var doc = SpreadsheetApp.create("Survey Responses " + new Date().toISOString());
    var sheet = doc.getSheets()[0];
    
    var data = JSON.parse(e.postData.contents);
    
    // Create headers if needed (first run logic usually manual, but we can try)
    // For now, just append as a row with timestamp and JSON string for reliability
    
    // Better: flattens the object to columns if keys are consistent
    var headers = Object.keys(data);
    // If it's a new sheet, set headers? (Not ideal for every request)
    // Simpler approach: Just append the raw data for now
    
    sheet.appendRow([new Date(), JSON.stringify(data)]);
    
    // To make it truly useful, we should append values in specific order
    // But since keys might change, JSON string is safest for "no-maintenance" backup
    // Or we iterate:
    // var row = [new Date()];
    // for (var key in data) { row.push(data[key]); }
    // sheet.appendRow(row);

    return ContentService
      .createTextOutput(JSON.stringify({ "result": "success", "sheetUrl": doc.getUrl() }))
      .setMimeType(ContentService.MimeType.JSON);
  } catch (e) {
    return ContentService
      .createTextOutput(JSON.stringify({ "result": "error", "error": e }))
      .setMimeType(ContentService.MimeType.JSON);
  } finally {
    lock.releaseLock();
  }
}

function doGet(e) {
  return ContentService.createTextOutput("Survey API is running.");
}