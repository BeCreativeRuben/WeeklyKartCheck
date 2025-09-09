# Google Sheets Integration Setup

This document explains how to set up Google Sheets integration for the Kart Check System.

## Prerequisites

1. A Google account
2. Access to Google Sheets API
3. A Google Cloud Project

## Setup Steps

### 1. Create a Google Cloud Project

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select an existing one
3. Enable the Google Sheets API:
   - Go to "APIs & Services" > "Library"
   - Search for "Google Sheets API"
   - Click on it and press "Enable"

### 2. Create Credentials

1. Go to "APIs & Services" > "Credentials"
2. Click "Create Credentials" > "Service Account"
3. Fill in the service account details:
   - Name: "Kart Check System"
   - Description: "Service account for kart maintenance logging"
4. Click "Create and Continue"
5. Skip the optional steps and click "Done"

### 3. Generate API Key

1. Click on the created service account
2. Go to the "Keys" tab
3. Click "Add Key" > "Create new key"
4. Choose "JSON" format
5. Download the JSON file and keep it secure

### 4. Create Google Sheet

1. Go to [Google Sheets](https://sheets.google.com/)
2. Create a new spreadsheet
3. Name it "Kart Maintenance Log"
4. Set up the following columns in row 1:
   - A: Kart Number
   - B: Status
   - C: Timestamp
   - D: Issues
   - E: Inspector
   - F: Notes

### 5. Share the Sheet

1. Click "Share" in the top-right corner
2. Add the service account email (from the JSON file) as an editor
3. The email will look like: `kart-check-system@your-project.iam.gserviceaccount.com`

### 6. Update the JavaScript Code

Replace the placeholder Google Sheets function in `script.js` with the actual implementation:

```javascript
// Add this to the top of script.js
const GOOGLE_SHEETS_CONFIG = {
    spreadsheetId: 'YOUR_SPREADSHEET_ID', // Get this from the sheet URL
    apiKey: 'YOUR_API_KEY', // From the JSON credentials file
    range: 'Sheet1!A:F' // Adjust based on your sheet name
};

// Replace the submitToGoogleSheets function with:
async function submitToGoogleSheets(data) {
    try {
        const response = await fetch(`https://sheets.googleapis.com/v4/spreadsheets/${GOOGLE_SHEETS_CONFIG.spreadsheetId}/values/${GOOGLE_SHEETS_CONFIG.range}:append?valueInputOption=USER_ENTERED&key=${GOOGLE_SHEETS_CONFIG.apiKey}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                values: [[
                    data.kartNumber,
                    data.everythingOk ? 'OK' : 'Issues Found',
                    data.timestamp,
                    data.everythingOk ? 'None' : formatIssues(data.issues),
                    data.inspector,
                    '' // Notes column
                ]]
            })
        });

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        const result = await response.json();
        console.log('Data submitted to Google Sheets:', result);
        return result;
    } catch (error) {
        console.error('Error submitting to Google Sheets:', error);
        throw error;
    }
}
```

## Alternative: Using Google Apps Script

If you prefer a simpler setup without API keys, you can use Google Apps Script:

### 1. Create Apps Script

1. In your Google Sheet, go to "Extensions" > "Apps Script"
2. Replace the default code with:

```javascript
function doPost(e) {
    try {
        const sheet = SpreadsheetApp.getActiveSheet();
        const data = JSON.parse(e.postData.contents);
        
        const row = [
            data.kartNumber,
            data.everythingOk ? 'OK' : 'Issues Found',
            data.timestamp,
            data.everythingOk ? 'None' : data.issues,
            data.inspector,
            ''
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

### 2. Deploy as Web App

1. Click "Deploy" > "New deployment"
2. Choose "Web app" as the type
3. Set access to "Anyone"
4. Click "Deploy"
5. Copy the web app URL

### 3. Update JavaScript

Replace the `submitToGoogleSheets` function with:

```javascript
async function submitToGoogleSheets(data) {
    try {
        const response = await fetch('YOUR_WEB_APP_URL', {
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

        console.log('Data submitted to Google Sheets:', result);
        return result;
    } catch (error) {
        console.error('Error submitting to Google Sheets:', error);
        throw error;
    }
}
```

## Testing

1. Open the website
2. Select a kart and fill out the checklist
3. Submit the form
4. Check your Google Sheet to see if the data appears

## Troubleshooting

- **403 Forbidden**: Check that the service account has access to the sheet
- **404 Not Found**: Verify the spreadsheet ID is correct
- **CORS errors**: Make sure you're testing from a web server, not file://
- **API quota exceeded**: Check your Google Cloud billing and quotas

## Security Notes

- Never commit API keys or credentials to version control
- Use environment variables for production deployments
- Regularly rotate your API keys
- Monitor API usage in Google Cloud Console
