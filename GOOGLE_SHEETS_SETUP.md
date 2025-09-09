# Google Sheets Setup - Step by Step Guide

## Method 1: Google Apps Script (Recommended - Easiest)

### Step 1: Open Your Spreadsheet
1. Go to: https://docs.google.com/spreadsheets/d/1sCTKJzF1b7pZ5bB1AFD8Y-Hzx2HXI4x5AhVMNVi6gM8/edit?usp=sharing
2. Make sure you're signed in to your Google account

### Step 2: Create the Apps Script
1. In your spreadsheet, click **"Extensions"** in the menu bar
2. Click **"Apps Script"**
3. Delete all the existing code in the editor
4. Copy and paste this code:

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

### Step 3: Save the Script
1. Click **"Save"** (Ctrl+S)
2. Give it a name like "Kart Check Handler"
3. Click **"Save"**

### Step 4: Deploy as Web App
1. Click **"Deploy"** button
2. Click **"New deployment"**
3. Choose **"Web app"** as the type
4. Set **"Execute as"** to **"Me"**
5. Set **"Who has access"** to **"Anyone"**
6. Click **"Deploy"**
7. Click **"Authorize access"** and follow the prompts
8. **COPY THE WEB APP URL** - it will look like: `https://script.google.com/macros/s/YOUR_SCRIPT_ID/exec`

### Step 5: Update the Website
1. Open `script.js` in your project
2. Find the `submitToGoogleSheets` function (around line 630)
3. Replace the entire function with this:

```javascript
async function submitToGoogleSheets(data) {
    const WEB_APP_URL = 'YOUR_WEB_APP_URL_HERE'; // Replace with your actual URL
    
    try {
        const response = await fetch(WEB_APP_URL, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(data)
        });
        
        const result = await response.json();
        
        if (!result.success) {
            throw new Error(result.error);
        }
        
        console.log('Data submitted to Google Sheets successfully:', result);
        return result;
        
    } catch (error) {
        console.error('Error submitting to Google Sheets:', error);
        throw error;
    }
}
```

4. Replace `'YOUR_WEB_APP_URL_HERE'` with the actual URL you copied from Step 4
5. Save the file

### Step 6: Test It!
1. Open your website
2. Select some karts with issues
3. Fill out the problems
4. Click "Submit All Checklists"
5. Check your Google Sheet - you should see a new row with the data!

---

## Method 2: Google Sheets API (Advanced)

If you prefer the API method, you'll need to:

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select existing
3. Enable Google Sheets API
4. Create credentials (API Key)
5. Share your spreadsheet with the service account email
6. Update the API key in the JavaScript

But I recommend Method 1 (Apps Script) as it's much simpler!

---

## Troubleshooting

**If it doesn't work:**
1. Make sure you copied the web app URL correctly
2. Check that the spreadsheet is shared with "Anyone with the link can edit"
3. Look at the browser console (F12) for error messages
4. Make sure the Apps Script is deployed as "Anyone" can access

**Need help?** Let me know what error messages you see!
