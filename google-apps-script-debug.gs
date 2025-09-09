const SHEET_ID = '1sCTKJzF1b7pZ5bB1AFD8Y-Hzx2HXI4x5AhVMNVi6gM8'; // Jouw spreadsheet ID
const SHEET_NAME = 'Submissions'; // Tab naam

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
    
    let sh = ss.getSheetByName(SHEET_NAME);
    if (!sh) {
      console.log('Sheet not found, creating new sheet:', SHEET_NAME);
      sh = ss.insertSheet(SHEET_NAME);
    }
    console.log('Sheet found/created:', sh.getName());
    
    // Add headers if sheet is empty
    if (sh.getLastRow() === 0) {
      console.log('Adding headers to empty sheet');
      sh.appendRow(['Date','Center','Karts with Issues','Individual Problems','Other Failures','Inspector','Timestamp']);
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
      new Date()
    ];
    
    console.log('Row data to append:', rowData);
    
    sh.appendRow(rowData);
    console.log('Row appended successfully. New last row:', sh.getLastRow());
    
    const result = {
      success: true,
      spreadsheetUrl: ss.getUrl(),
      sheetName: sh.getName(),
      lastRow: sh.getLastRow()
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

// Test function to verify setup
function testSetup() {
  try {
    const ss = SpreadsheetApp.openById(SHEET_ID);
    console.log('Spreadsheet name:', ss.getName());
    console.log('Spreadsheet URL:', ss.getUrl());
    
    let sh = ss.getSheetByName(SHEET_NAME);
    if (!sh) {
      sh = ss.insertSheet(SHEET_NAME);
      console.log('Created new sheet:', SHEET_NAME);
    } else {
      console.log('Found existing sheet:', SHEET_NAME);
    }
    
    console.log('Sheet has', sh.getLastRow(), 'rows');
    console.log('Sheet has', sh.getLastColumn(), 'columns');
    
    return 'Setup test successful';
  } catch (err) {
    console.error('Setup test failed:', err);
    return 'Setup test failed: ' + err.toString();
  }
}
