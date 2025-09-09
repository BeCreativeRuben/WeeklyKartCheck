# Google Sheets Setup - Simple Version

## Quick Setup for Your Spreadsheet

Your spreadsheet is already set up at: https://docs.google.com/spreadsheets/d/1sCTKJzF1b7pZ5bB1AFD8Y-Hzx2HXI4x5AhVMNVi6gM8/edit?usp=sharing

### To Enable API Access:

1. **Open your spreadsheet** and go to "Extensions" > "Apps Script"

2. **Replace the default code** with this:

```javascript
function doPost(e) {
  try {
    const sheet = SpreadsheetApp.getActiveSheet();
    const data = JSON.parse(e.postData.contents);
    
    // Add headers if this is the first row
    if (sheet.getLastRow() === 0) {
      sheet.appendRow(['Date', 'Center', 'Karts with Issues', 'Individual Problems', 'Other Failures', 'Inspector', 'Timestamp']);
    }
    
    const row = [
      data.date,
      data.center,
      data.kartsWithIssues.join(', '),
      Object.keys(data.kartProblems).map(kartNum => {
        const problems = data.kartProblems[kartNum];
        return `Kart ${kartNum}: ${problems.issues.join(', ')}${problems.otherFailures ? ` (${problems.otherFailures})` : ''}`;
      }).join('; '),
      data.otherFailures || 'None',
      data.inspector,
      new Date().toLocaleString()
    ];
    
    sheet.appendRow(row);
    
    return ContentService
      .createTextOutput(JSON.stringify({success: true}))
      .setMimeType(ContentService.MimeType.JSON);
  } catch (error) {
    return ContentService
      .createTextOutput(JSON.stringify({success: false, error: error.toString()}))
      .setMimeType(ContentService.MimeType.JSON);
  }
}
```

3. **Save the script** (Ctrl+S) and give it a name like "Kart Check Handler"

4. **Deploy as Web App:**
   - Click "Deploy" > "New deployment"
   - Choose "Web app" as the type
   - Set access to "Anyone"
   - Click "Deploy"
   - Copy the web app URL

5. **Update the JavaScript:**
   - Open `script.js`
   - Find the `submitToGoogleSheets` function
   - Replace the `SPREADSHEET_ID` and `API_KEY` with your web app URL
   - Change the fetch URL to use your web app URL instead

### That's it! 

Your kart check system will now automatically log all submissions to your Google Sheet. Each submission will create a new row with all the details about which karts had issues and what specific problems were found.
