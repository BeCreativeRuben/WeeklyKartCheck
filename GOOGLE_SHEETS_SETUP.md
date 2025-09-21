# Google Sheets Setup - Step by Step Guide

## 🆕 NEW SYSTEM OVERVIEW

The system now creates **4 sheets** in your Google Spreadsheet:

1. **Submissions_OLD** - Your existing data (preserved and continues working)
2. **Kart_Overview** - Complete tracking of all 36 karts for every check
3. **Error_Log** - Detailed log of all problems found
4. **Submissions_Summary** - Weekly check summaries

### What's New:
- ✅ **All 36 karts tracked** on every submission (even "good" ones)
- ✅ **Individual problem tracking** with specific details
- ✅ **Easy filtering** by kart number, date, or problem type
- ✅ **Old system preserved** - no data loss
- ✅ **Unique submission IDs** for tracking

## Method 1: Google Apps Script (Recommended - Easiest)

### Step 1: Open Your Spreadsheet
1. Go to: https://docs.google.com/spreadsheets/d/1sCTKJzF1b7pZ5bB1AFD8Y-Hzx2HXI4x5AhVMNVi6gM8/edit?usp=sharing
2. Make sure you're signed in to your Google account

### Step 2: Create the Apps Script
1. In your spreadsheet, click **"Extensions"** in the menu bar
2. Click **"Apps Script"**
3. Delete all the existing code in the editor
4. Copy and paste the **NEW** code from `google-apps-script-new.gs`:

**⚠️ IMPORTANT**: Use the new script file (`google-apps-script-new.gs`) which includes both old and new systems!

The new script will:
- ✅ Preserve your existing "Submissions" sheet as "Submissions_OLD"
- ✅ Create 3 new sheets: "Kart_Overview", "Error_Log", "Submissions_Summary"
- ✅ Track all 36 karts on every submission
- ✅ Generate unique submission IDs
- ✅ Maintain backward compatibility

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
5. Check your Google Sheet - you should see data in all 4 sheets!

## 📊 Understanding the New Sheets

### 1. **Submissions_OLD** (Your existing data)
- Contains all your previous submissions
- Same format as before
- Continues to work exactly as before

### 2. **Kart_Overview** (Main tracking sheet)
- **One row per kart per check** (36 rows per submission)
- Shows status: "Good" or "Issues"
- Lists all problems found for that kart
- Includes kart-specific remarks
- **Perfect for**: Tracking individual kart history

### 3. **Error_Log** (Problems tracking)
- **One row per problem found**
- Shows which kart had which specific problem
- Includes problem descriptions
- **Perfect for**: Finding all karts with "brakes" issues, etc.

### 4. **Submissions_Summary** (Weekly overview)
- **One row per weekly check**
- Shows total karts checked, issues found, etc.
- **Perfect for**: Weekly progress tracking

## 🔍 How to Use the New System

### Find Problems by Kart:
1. Go to **Kart_Overview** sheet
2. Filter by Kart_Number column
3. See complete history for any specific kart

### Find All Karts with Specific Problem:
1. Go to **Error_Log** sheet
2. Filter by Problem_Type column
3. See all karts that had "brakes" issues, etc.

### Track Weekly Progress:
1. Go to **Submissions_Summary** sheet
2. See overview of each weekly check
3. Track improvement over time

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
