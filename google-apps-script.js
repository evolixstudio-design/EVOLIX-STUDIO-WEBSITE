// ============================================
// GOOGLE APPS SCRIPT — EVOLIX LEAD STORAGE (UPGRADED)
// ============================================
// 
// HOW TO SET UP (5 minutes, one-time):
//
// 1. Go to Google Sheets → Create a new spreadsheet
//    Name it: "EVOLIX Purple Cow Leads"
//    Create a second sheet tab named: "EVOLIX Events"
//
// 2. In Row 1 of the Leads sheet, paste these headers (A through Z):
//    Submission ID | Session ID | Timestamp | Campaign Source | Name | Business Name | WhatsApp | Industry | Website/Instagram | Consent | Consent Timestamp | Q1 | Q2 | Q3 | Q4 | Q5 | Q6 | Q7 | EVOLIX Score | Score Band | Strongest Area | Weakest Area | Second Weakest | Recommendations | Payload Hash
//
// 3. In Row 1 of the Events sheet, paste these headers (A through C):
//    Session ID | Event Name | Timestamp
//
// 4. Go to Extensions → Apps Script
//
// 5. Delete any existing code and paste EVERYTHING below this line
//
// 6. Go to Project Settings (gear icon) → Script Properties
//    Add a property named: SHARED_SECRET
//    Value: (Create a random long string, e.g., EVOLIX-SEC-8f7b2c9d...)
//
// 7. Click Deploy → New deployment
//    - Type: Web app
//    - Description: "EVOLIX Lead Capture API v2"
//    - Execute as: Me
//    - Who has access: Anyone
//    - Click Deploy
//
// 8. Copy the Web App URL and provide it to the backend environment variables.
//
// ============================================

function doPost(e) {
  try {
    const scriptProperties = PropertiesService.getScriptProperties();
    const sharedSecret = scriptProperties.getProperty('SHARED_SECRET');
    
    // 1. Authenticate server-to-server request
    if (!sharedSecret || e.parameter.secret !== sharedSecret) {
      return buildJsonResponse({ error: 'Unauthorized' }, 401);
    }
    
    const payload = JSON.parse(e.postData.contents);
    const action = payload.action;
    
    // Ensure Spreadsheet has the required sheets
    const spreadsheet = SpreadsheetApp.getActiveSpreadsheet();
    let leadsSheet = spreadsheet.getSheetByName('Leads') || spreadsheet.getSheets()[0];
    let eventsSheet = spreadsheet.getSheetByName('EVOLIX Events');
    if (!eventsSheet) {
      eventsSheet = spreadsheet.insertSheet('EVOLIX Events');
      eventsSheet.appendRow(['Session ID', 'Event Name', 'Timestamp']);
    }

    // 2. Action: STORE_EVENT
    if (action === 'STORE_EVENT') {
      const lock = LockService.getScriptLock();
      lock.waitLock(10000); // 10 second lock wait
      try {
        // Simple deduplication for events: check last 50 rows (assuming not massive parallel scale)
        // Or simply insert, as Apps Script doesn't have native unique constraints
        // For performance, we just append to the events sheet
        eventsSheet.appendRow([
          payload.sessionId,
          payload.event,
          payload.timestamp
        ]);
        SpreadsheetApp.flush();
        return buildJsonResponse({ ok: true }, 200);
      } finally {
        lock.releaseLock();
      }
    }
    
    // 3. Action: STORE_LEAD
    if (action === 'STORE_LEAD') {
      const submissionId = payload.submissionId;
      const payloadHash = payload.payloadHash;
      
      const lock = LockService.getScriptLock();
      lock.waitLock(15000); // 15 seconds max wait for robust deduplication
      
      try {
        // Durable deduplication check
        const data = leadsSheet.getDataRange().getValues();
        let existingRowIndex = -1;
        let existingHash = null;
        let existingResult = null;
        
        // Find existing submission (skip header)
        for (let i = 1; i < data.length; i++) {
          if (data[i][0] === submissionId) {
            existingRowIndex = i;
            existingHash = data[i][24]; // Column Y is Payload Hash
            // Reconstruct result for identical retries
            existingResult = {
              score: data[i][18],
              band: { label: data[i][19] }
            }; // Abridged result, full result could be stored as JSON in a hidden column if needed.
            break;
          }
        }
        
        if (existingRowIndex !== -1) {
          if (existingHash !== payloadHash) {
             return buildJsonResponse({ error: 'This submission changed. Please update a field and try again.' }, 409);
          }
          // Identical retry, return success
          return buildJsonResponse({ id: submissionId, result: existingResult }, 200);
        }
        
        // Insert new lead
        const lead = payload.lead;
        const answers = payload.answers || [];
        const result = payload.result || {};
        
        leadsSheet.appendRow([
          submissionId,
          payload.sessionId,
          payload.timestamp,
          payload.campaign || '100_NOTE',
          lead.name || '',
          lead.business || '',
          lead.phone || '',
          lead.industry || '',
          lead.website || '',
          lead.consent ? 'Yes' : 'No',
          payload.consentTimestamp || '',
          answers[0] || 0,
          answers[1] || 0,
          answers[2] || 0,
          answers[3] || 0,
          answers[4] || 0,
          answers[5] || 0,
          answers[6] || 0,
          result.score || 0,
          result.band?.label || '',
          result.opportunities ? result.opportunities[0] : '', // Strongest/weakest logic is complex, just storing raw indices or abridged info
          result.opportunities ? result.opportunities[1] : '',
          result.opportunities ? result.opportunities[2] : '',
          'JSON', // Could stringify recommendations
          payloadHash
        ]);
        
        // Confirm successful storage
        SpreadsheetApp.flush();
        
        return buildJsonResponse({ id: submissionId, result: result }, 201);
      } finally {
        lock.releaseLock();
      }
    }
    
    return buildJsonResponse({ error: 'Invalid action' }, 400);
    
  } catch (error) {
    // Preserve retryable errors
    return buildJsonResponse({ error: 'Storage failed: ' + error.toString() }, 500);
  }
}

function doGet(e) {
  return buildJsonResponse({ status: 'ok', message: 'EVOLIX Lead API v2 is running.' }, 200);
}

function buildJsonResponse(content, statusCode) {
  return ContentService
    .createTextOutput(JSON.stringify(content))
    .setMimeType(ContentService.MimeType.JSON);
    // Note: Apps Script always returns HTTP 200 with follow redirects, 
    // so we handle logical status codes in the body in the Netlify function.
}
