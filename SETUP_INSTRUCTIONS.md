# How to Save Survey Responses to Google Sheets

Since your site is hosted on GitHub Pages (which is static), you need a backend to receive the data. Google Sheets + Apps Script is a free and easy way to do this.

## Step 1: Create a Google Sheet
1. Go to [Google Sheets](https://sheets.google.com) and create a new sheet.
2. Name it "Survey Responses".
3. In the first row, add headers for your data fields: `Timestamp`, `data` (or specific columns if you prefer).

## Step 2: Create the Apps Script
1. In your Google Sheet, go to **Extensions > Apps Script**.
2. Delete any code in the `Code.gs` file and paste this:

```javascript
function doPost(e) {
  var sheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();
  var data = JSON.parse(e.postData.contents);
  
  // Basic example: saves timestamp and the whole JSON data string
  // You can customize this to save specific fields in specific columns
  sheet.appendRow([new Date(), JSON.stringify(data)]);
  
  return ContentService.createTextOutput(JSON.stringify({"result":"success"}))
    .setMimeType(ContentService.MimeType.JSON);
}
```

3. Click the **Save** icon (floppy disk).

## Step 3: Deploy the Script
1. Click the blue **Deploy** button > **New deployment**.
2. Click the gear icon next to "Select type" and choose **Web app**.
3. Description: "Survey API".
4. Execute as: **Me**.
5. Who has access: **Anyone** (This is crucial so your public site can send data).
6. Click **Deploy**.
7. Authorize access if prompted.
8. Copy the **Web App URL** (it ends in `/exec`).

## Step 4: Update Your React App
1. Open `src/App.jsx`.
2. Find the `handleSubmitSurvey` function.
3. Replace the URL in the `fetch` call with your new Web App URL.

## Troubleshooting 404 Error
If you see a 404 error on your GitHub Pages site:
1. Ensure you are visiting `https://playtym.github.io/Survey/` (note the capital 'S' and trailing slash).
2. Go to your repo settings > **Pages** and ensure "Source" is set to `gh-pages` branch.
3. It can take up to 10 minutes for the first deployment to propagate.
