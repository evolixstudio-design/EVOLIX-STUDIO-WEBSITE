// ============================================
// GOOGLE APPS SCRIPT — EVOLIX LEAD STORAGE
// ============================================
// 
// HOW TO SET UP (5 minutes, one-time):
//
// 1. Go to Google Sheets → Create a new spreadsheet
//    Name it: "EVOLIX Purple Cow Leads"
//
// 2. In Row 1, paste these headers (one per column, A through AH):
//    Lead ID | Timestamp | Campaign Source | Name | Business Name | WhatsApp | Industry | Website/Instagram | Consent | Consent Timestamp | Q1 Answer | Q1 Points | Q2 Answer | Q2 Points | Q3 Answer | Q3 Points | Q4 Answer | Q4 Points | Q5 Answer | Q5 Points | Q6 Answer | Q6 Points | Q7 Answer | Q7 Points | EVOLIX Score | Score Band | Strongest Area | Weakest Area | Second Weakest | Recommendations | Roadmap CTA Clicked | WhatsApp CTA Clicked
//
// 3. Go to Extensions → Apps Script
//
// 4. Delete any existing code and paste EVERYTHING below this line
//
// 5. Click Deploy → New deployment
//    - Type: Web app
//    - Description: "EVOLIX Lead Capture"
//    - Execute as: Me
//    - Who has access: Anyone
//    - Click Deploy
//
// 6. Copy the Web App URL (looks like: https://script.google.com/macros/s/XXXXX/exec)
//
// 7. Paste that URL into your event.js file where it says:
//    GOOGLE_SHEET_URL: ''
//    Change it to:
//    GOOGLE_SHEET_URL: 'https://script.google.com/macros/s/XXXXX/exec'
//
// 8. Done! Every lead will now auto-populate in your Google Sheet.
//
// ============================================

function doPost(e) {
  try {
    var sheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();
    var data = JSON.parse(e.postData.contents);
    
    // Generate Lead ID
    var leadId = 'EV-' + new Date().getTime().toString(36).toUpperCase();
    
    // Append row with all lead data
    sheet.appendRow([
      leadId,
      data.timestamp || new Date().toISOString(),
      data.campaign_source || '100_NOTE',
      data.name || '',
      data.business_name || '',
      data.whatsapp || '',
      data.industry || '',
      data.website_or_instagram || '',
      data.consent ? 'Yes' : 'No',
      data.consent_timestamp || '',
      data.q1_answer || '',
      data.q1_points || 0,
      data.q2_answer || '',
      data.q2_points || 0,
      data.q3_answer || '',
      data.q3_points || 0,
      data.q4_answer || '',
      data.q4_points || 0,
      data.q5_answer || '',
      data.q5_points || 0,
      data.q6_answer || '',
      data.q6_points || 0,
      data.q7_answer || '',
      data.q7_points || 0,
      data.evolix_score || 0,
      data.score_band || '',
      data.strongest_area || '',
      data.weakest_area || '',
      data.second_weakest_area || '',
      data.recommendations || '',
      data.roadmap_cta_clicked || 'No',
      data.whatsapp_cta_clicked || 'No'
    ]);
    
    return ContentService
      .createTextOutput(JSON.stringify({ status: 'success', leadId: leadId }))
      .setMimeType(ContentService.MimeType.JSON);
      
  } catch (error) {
    return ContentService
      .createTextOutput(JSON.stringify({ status: 'error', message: error.toString() }))
      .setMimeType(ContentService.MimeType.JSON);
  }
}

// Handle GET requests (for testing)
function doGet(e) {
  return ContentService
    .createTextOutput(JSON.stringify({ status: 'ok', message: 'EVOLIX Lead API is running.' }))
    .setMimeType(ContentService.MimeType.JSON);
}
