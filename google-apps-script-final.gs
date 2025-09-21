// Complete Google Apps Script for Kart Check System
const SHEET_ID = '1sCTKJzF1b7pZ5bB1AFD8Y-Hzx2HXI4x5AhVMNVi6gM8';
const OLD_SHEET_NAME = 'Submissions_OLD';
const KART_OVERVIEW_SHEET = 'Kart_Overview';
const ERROR_LOG_SHEET = 'Error_Log';
const SUBMISSIONS_SUMMARY_SHEET = 'Submissions_Summary';

// REQUIRED: doGet function for basic connectivity testing
function doGet(e) {
  console.log('doGet called');
  return ContentService.createTextOutput(JSON.stringify({
    success: true,
    message: 'Google Apps Script is working!',
    timestamp: new Date().toISOString()
  })).setMimeType(ContentService.MimeType.JSON);
}

// Main function to handle POST requests from the website
function doPost(e) {
  console.log('doPost called with:', e);
  
  const out = ContentService.createTextOutput().setMimeType(ContentService.MimeType.JSON);
  
  try {
    let data = {};
    if (e && e.postData) {
      console.log('postData type:', e.postData.type);
      console.log('postData contents:', e.postData.contents);
      
      const t = (e.postData.type || '').toLowerCase();
      if (t.includes('application/json') || t.includes('text/plain')) {
        data = JSON.parse(e.postData.contents || '{}');
      } else {
        data = e.parameter || {};
      }
    }
    
    console.log('Parsed data:', data);
    
    const ss = SpreadsheetApp.openById(SHEET_ID);
    console.log('Spreadsheet opened:', ss.getName());
    
    // Generate unique submission ID
    const submissionId = 'SUB_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
    console.log('Generated submission ID:', submissionId);
    
    // Process old system (preserve existing functionality)
    processOldSystem(ss, data, submissionId);
    
    // Process new system
    processNewSystem(ss, data, submissionId);
    
    const result = {
      success: true,
      submissionId: submissionId,
      spreadsheetUrl: ss.getUrl(),
      message: 'Data processed successfully in both old and new systems'
    };
    
    console.log('Returning result:', result);
    out.setContent(JSON.stringify(result));
    
  } catch (err) {
    console.error('Error in doPost:', err);
    const errorResult = {
      success: false,
      error: String(err)
    };
    console.log('Returning error:', errorResult);
    out.setContent(JSON.stringify(errorResult));
  }
  
  return out;
}

// Process data for the old system (preserve existing functionality)
function processOldSystem(ss, data, submissionId) {
  console.log('Processing old system...');
  
  // Rename existing sheet if it exists and is still called 'Submissions'
  let oldSheet = ss.getSheetByName('Submissions');
  if (oldSheet) {
    oldSheet.setName(OLD_SHEET_NAME);
    console.log('Renamed Submissions sheet to Submissions_OLD');
  } else {
    oldSheet = ss.getSheetByName(OLD_SHEET_NAME);
    if (!oldSheet) {
      oldSheet = ss.insertSheet(OLD_SHEET_NAME);
      console.log('Created new Submissions_OLD sheet');
    }
  }
  
  // Add headers if sheet is empty
  if (oldSheet.getLastRow() === 0) {
    console.log('Adding headers to old sheet');
    oldSheet.appendRow(['Date','Center','Karts with Issues','Individual Problems','Other Failures','Inspector','Timestamp','Submission_ID']);
  }
  
  const kartsWithIssues = Array.isArray(data.kartsWithIssues) ? data.kartsWithIssues : [];
  const kp = (data.kartProblems && typeof data.kartProblems === 'object') ? data.kartProblems : {};
  
  console.log('kartsWithIssues:', kartsWithIssues);
  console.log('kartProblems:', kp);
  
  const individual = Object.keys(kp).map(n => {
    const p = kp[n] || {};
    const issues = Array.isArray(p.issues) ? p.issues.join(', ') : '';
    const extra = p.otherFailures ? ` (${p.otherFailures})` : '';
    return `Kart ${n}: ${issues}${extra}`;
  }).join('; ');
  
  console.log('Individual problems string:', individual);
  
  const rowData = [
    data.date || '',
    data.center || '',
    kartsWithIssues.join(', '),
    individual,
    data.otherFailures || 'None',
    data.inspector || '',
    new Date(),
    submissionId
  ];
  
  console.log('Old system row data to append:', rowData);
  
  oldSheet.appendRow(rowData);
  console.log('Old system row appended successfully. New last row:', oldSheet.getLastRow());
}

// Process data for the new system
function processNewSystem(ss, data, submissionId) {
  console.log('Processing new system...');
  
  const currentDate = data.date || new Date().toLocaleDateString();
  const currentTime = new Date().toLocaleTimeString();
  const center = data.center || 'Gent 2025';
  const inspector = data.inspector || 'User';
  const kartsWithIssues = Array.isArray(data.kartsWithIssues) ? data.kartsWithIssues : [];
  const kartProblems = (data.kartProblems && typeof data.kartProblems === 'object') ? data.kartProblems : {};
  const otherFailures = data.otherFailures || '';
  
  // Create or get sheets
  const kartOverviewSheet = getOrCreateSheet(ss, KART_OVERVIEW_SHEET, [
    'Date', 'Time', 'Kart_Number', 'Status', 'Problems_Found', 'Kart_Specific_Remarks', 'Inspector', 'Submission_ID'
  ]);
  
  const errorLogSheet = getOrCreateSheet(ss, ERROR_LOG_SHEET, [
    'Date', 'Time', 'Kart_Number', 'Problem_Type', 'Problem_Description', 'Inspector', 'Submission_ID'
  ]);
  
  const submissionsSummarySheet = getOrCreateSheet(ss, SUBMISSIONS_SUMMARY_SHEET, [
    'Date', 'Center', 'Total_Karts_Checked', 'Karts_with_Issues', 'Total_Problems_Found', 'General_Failures', 'Inspector', 'Submission_ID'
  ]);
  
  // Process all 36 karts for Kart_Overview
  console.log('Processing all 36 karts for overview...');
  const allKartData = [];
  let totalProblemsFound = 0;
  
  for (let kartNumber = 1; kartNumber <= 36; kartNumber++) {
    const hasIssues = kartsWithIssues.includes(kartNumber);
    const kartData = kartProblems[kartNumber] || {};
    const problems = Array.isArray(kartData.issues) ? kartData.issues : [];
    const kartRemarks = kartData.otherFailures || '';
    
    const status = hasIssues ? 'Issues' : 'Good';
    const problemsFound = problems.join(', ') || (hasIssues ? 'No specific problems marked' : '');
    
    allKartData.push([
      currentDate,
      currentTime,
      kartNumber,
      status,
      problemsFound,
      kartRemarks,
      inspector,
      submissionId
    ]);
    
    // Add individual problems to Error_Log
    if (hasIssues && problems.length > 0) {
      totalProblemsFound += problems.length;
      problems.forEach(problem => {
        errorLogSheet.appendRow([
          currentDate,
          currentTime,
          kartNumber,
          problem,
          kartRemarks,
          inspector,
          submissionId
        ]);
      });
    }
  }
  
  // Add all kart data to Kart_Overview at once (more efficient)
  if (allKartData.length > 0) {
    kartOverviewSheet.getRange(
      kartOverviewSheet.getLastRow() + 1, 
      1, 
      allKartData.length, 
      allKartData[0].length
    ).setValues(allKartData);
  }
  
  // Add summary to Submissions_Summary
  submissionsSummarySheet.appendRow([
    currentDate,
    center,
    36, // Total karts checked
    kartsWithIssues.length, // Karts with issues
    totalProblemsFound,
    otherFailures || 'None',
    inspector,
    submissionId
  ]);
  
  console.log('New system processing complete');
  console.log('- Kart Overview entries:', allKartData.length);
  console.log('- Error Log entries:', totalProblemsFound);
  console.log('- Summary entry added');
}

// Helper function to get or create a sheet with headers
function getOrCreateSheet(ss, sheetName, headers) {
  let sheet = ss.getSheetByName(sheetName);
  if (!sheet) {
    sheet = ss.insertSheet(sheetName);
    console.log('Created new sheet:', sheetName);
  }
  
  // Add headers if sheet is empty
  if (sheet.getLastRow() === 0) {
    sheet.appendRow(headers);
    console.log('Added headers to sheet:', sheetName);
  }
  
  return sheet;
}

// Test function to verify setup
function testSetup() {
  try {
    const ss = SpreadsheetApp.openById(SHEET_ID);
    console.log('Spreadsheet name:', ss.getName());
    console.log('Spreadsheet URL:', ss.getUrl());
    
    // Test all sheets
    const sheetNames = [OLD_SHEET_NAME, KART_OVERVIEW_SHEET, ERROR_LOG_SHEET, SUBMISSIONS_SUMMARY_SHEET];
    
    sheetNames.forEach(sheetName => {
      let sh = ss.getSheetByName(sheetName);
      if (!sh) {
        sh = ss.insertSheet(sheetName);
        console.log('Created new sheet:', sheetName);
      } else {
        console.log('Found existing sheet:', sheetName);
      }
      
      console.log(`Sheet ${sheetName} has ${sh.getLastRow()} rows and ${sh.getLastColumn()} columns`);
    });
    
    return 'Setup test successful - all sheets ready';
  } catch (err) {
    console.error('Setup test failed:', err);
    return 'Setup test failed: ' + err.toString();
  }
}

// Function to migrate existing data (run once if needed)
function migrateExistingData() {
  try {
    const ss = SpreadsheetApp.openById(SHEET_ID);
    
    // Check if old data exists in 'Submissions' sheet
    const oldSubmissionsSheet = ss.getSheetByName('Submissions');
    if (oldSubmissionsSheet && oldSubmissionsSheet.getLastRow() > 1) {
      console.log('Found existing data in Submissions sheet, migrating...');
      
      // Rename to preserve old data
      oldSubmissionsSheet.setName(OLD_SHEET_NAME);
      console.log('Renamed Submissions to Submissions_OLD');
      
      return 'Migration completed - old data preserved in Submissions_OLD sheet';
    } else {
      return 'No existing data found to migrate';
    }
  } catch (err) {
    console.error('Migration failed:', err);
    return 'Migration failed: ' + err.toString();
  }
}
