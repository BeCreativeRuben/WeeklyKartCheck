// Minimal Google Apps Script for Kart Check System
const SHEET_ID = '1sCTKJzF1b7pZ5bB1AFD8Y-Hzx2HXI4x5AhVMNVi6gM8';

function doGet(e) {
  console.log('doGet called');
  return ContentService.createTextOutput(JSON.stringify({
    success: true,
    message: 'Google Apps Script is working!',
    timestamp: new Date().toISOString()
  })).setMimeType(ContentService.MimeType.JSON);
}

function doPost(e) {
  console.log('doPost called with:', e);
  
  try {
    let data = {};
    if (e && e.postData) {
      data = JSON.parse(e.postData.contents || '{}');
    }
    
    console.log('Parsed data:', data);
    
    // Test basic functionality
    const result = {
      success: true,
      message: 'POST request received successfully!',
      receivedData: data,
      timestamp: new Date().toISOString()
    };
    
    console.log('Returning result:', result);
    return ContentService.createTextOutput(JSON.stringify(result)).setMimeType(ContentService.MimeType.JSON);
    
  } catch (err) {
    console.error('Error in doPost:', err);
    return ContentService.createTextOutput(JSON.stringify({
      success: false,
      error: String(err)
    })).setMimeType(ContentService.MimeType.JSON);
  }
}
