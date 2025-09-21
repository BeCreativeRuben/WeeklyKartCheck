const SHEET_ID = '1sCTKJzF1b7pZ5bB1AFD8Y-Hzx2HXI4x5AhVMNVi6gM8'; // Your spreadsheet ID

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
    
    // Test basic functionality first
    const result = {
      success: true,
      message: 'Google Apps Script is working!',
      submissionId: submissionId,
      receivedData: data,
      timestamp: new Date().toISOString(),
      spreadsheetUrl: ss.getUrl()
    };
    
    console.log('Returning result:', result);
    out.setContent(JSON.stringify(result));
    
  } catch (err) {
    console.error('Error in doPost:', err);
    const errorResult = {
      success: false,
      error: String(err),
      message: 'Error occurred in Google Apps Script'
    };
    console.log('Returning error:', errorResult);
    out.setContent(JSON.stringify(errorResult));
  }
  
  return out;
}

function doGet(e) {
  console.log('doGet called with:', e);
  
  const out = ContentService.createTextOutput().setMimeType(ContentService.MimeType.JSON);
  
  try {
    const result = {
      success: true,
      message: 'Google Apps Script is accessible via GET request',
      timestamp: new Date().toISOString(),
      method: 'GET'
    };
    
    console.log('Returning GET result:', result);
    out.setContent(JSON.stringify(result));
    
  } catch (err) {
    console.error('Error in doGet:', err);
    const errorResult = {
      success: false,
      error: String(err),
      message: 'Error occurred in doGet'
    };
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
    
    return {
      success: true,
      message: 'Setup test successful',
      spreadsheetName: ss.getName(),
      spreadsheetUrl: ss.getUrl()
    };
  } catch (err) {
    console.error('Setup test failed:', err);
    return {
      success: false,
      error: String(err),
      message: 'Setup test failed'
    };
  }
}
