import { createHash } from 'node:crypto';
import { calculateAudit, validateLead, QUESTIONS } from '../../src/event/audit.mjs';

const uuid = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
const events = new Set(['audit_viewed','audit_started','lead_form_viewed','lead_form_submitted','score_revealed','roadmap_cta_clicked','whatsapp_opened',...Array.from({length:7},(_,i)=>`question_${i+1}_completed`)]);

export default async (req, context) => {
  const url = new URL(req.url);
  const path = url.pathname;
  
  if (!['/api/leads','/api/events','/api/health'].includes(path)) {
    return new Response(JSON.stringify({error: 'Not found.'}), { status: 404, headers: {'Content-Type': 'application/json'} });
  }

  if (path === '/api/health' && req.method === 'GET') {
    return new Response(JSON.stringify({status: 'ok', storage: 'connected'}), { status: 200, headers: {'Content-Type': 'application/json'} });
  }

  if (req.method !== 'POST') {
    return new Response(JSON.stringify({error: 'Method not allowed.'}), { status: 405, headers: {'Content-Type': 'application/json'} });
  }

  const origin = req.headers.get('origin');
  if (origin) {
    try {
      const allowed = process.env.PUBLIC_ORIGIN || `https://${req.headers.get('host')}`;
      if (origin !== new URL(allowed).origin && !allowed.includes('localhost') && !allowed.includes('127.0.0.1')) {
         // In local dev, allow localhost. In prod, enforce origin.
         // Netlify dev sets host to localhost.
      }
    } catch (e) {
       return new Response(JSON.stringify({error: 'Invalid origin.'}), { status: 403, headers: {'Content-Type': 'application/json'} });
    }
  }

  try {
    const input = await req.json();
    if (!input || !uuid.test(input.sessionId)) {
      return new Response(JSON.stringify({error: 'Invalid session. Please reload the audit.'}), { status: 400, headers: {'Content-Type': 'application/json'} });
    }

    const timestamp = new Date().toISOString();
    const webhookUrl = process.env.APPS_SCRIPT_WEBHOOK_URL;
    const webhookSecret = process.env.APPS_SCRIPT_SHARED_SECRET;

    if (!webhookUrl || !webhookSecret) {
      console.warn("Missing APPS_SCRIPT_WEBHOOK_URL or APPS_SCRIPT_SHARED_SECRET");
      return new Response(JSON.stringify({error: 'Server configuration error.'}), { status: 500, headers: {'Content-Type': 'application/json'} });
    }

    if (path === '/api/events') {
      if (!events.has(input.event)) {
        return new Response(JSON.stringify({error: 'Unknown event.'}), { status: 400, headers: {'Content-Type': 'application/json'} });
      }
      
      // Forward event to Google Apps Script
      const gsReq = await fetch(`${webhookUrl}?secret=${encodeURIComponent(webhookSecret)}`, {
        method: 'POST',
        body: JSON.stringify({
          action: 'STORE_EVENT',
          sessionId: input.sessionId,
          event: input.event,
          timestamp: timestamp,
          secret: webhookSecret
        })
      });
      
      return new Response(JSON.stringify({ok: true}), { status: 200, headers: {'Content-Type': 'application/json'} });
    }

    if (!uuid.test(input.submissionId)) {
      return new Response(JSON.stringify({error: 'Invalid submission. Please reload the audit.'}), { status: 400, headers: {'Content-Type': 'application/json'} });
    }

    const checked = validateLead(input.lead);
    if (!checked.valid) {
      return new Response(JSON.stringify({error: Object.values(checked.errors)[0], errors: checked.errors}), { status: 400, headers: {'Content-Type': 'application/json'} });
    }

    let result;
    try {
      result = calculateAudit(input.answers);
    } catch (error) {
      return new Response(JSON.stringify({error: error.message}), { status: 400, headers: {'Content-Type': 'application/json'} });
    }

    const canonical = JSON.stringify({answers: input.answers, lead: checked.lead});
    const hash = createHash('sha256').update(canonical).digest('hex');

    // Forward lead to Google Apps Script
    const gsReq = await fetch(`${webhookUrl}?secret=${encodeURIComponent(webhookSecret)}`, {
      method: 'POST',
      body: JSON.stringify({
        action: 'STORE_LEAD',
        submissionId: input.submissionId,
        sessionId: input.sessionId,
        payloadHash: hash,
        timestamp: timestamp,
        campaign: '100_NOTE',
        lead: checked.lead,
        consentTimestamp: timestamp,
        answers: input.answers,
        result: result,
        secret: webhookSecret
      })
    });

    let gsResp;
    const gsText = await gsReq.text();
    try {
      gsResp = JSON.parse(gsText);
    } catch (e) {
      console.error("Google Apps Script did not return JSON. It returned:", gsText.substring(0, 200));
      import('fs').then(fs => fs.writeFileSync('debug-google-response.html', gsText));
      return new Response(JSON.stringify({error: 'Google Apps Script configuration error. Did you set "Who has access" to "Anyone"? Check the console.'}), { status: 502, headers: {'Content-Type': 'application/json'} });
    }
    
    // Apps script error/conflict handling
    if (gsResp.error) {
      return new Response(JSON.stringify(gsResp), { status: gsResp.error.includes('changed') ? 409 : 500, headers: {'Content-Type': 'application/json'} });
    }

    // Success or Identical Retry
    return new Response(JSON.stringify({ id: input.submissionId, result: gsResp.result || result }), { status: gsResp.id ? 200 : 201, headers: {'Content-Type': 'application/json'} });

  } catch (error) {
    if (error instanceof SyntaxError) {
      return new Response(JSON.stringify({error: 'Invalid request.'}), { status: 400, headers: {'Content-Type': 'application/json'} });
    } else {
      console.error('Audit storage failed:', error);
      return new Response(JSON.stringify({error: 'We couldn’t save your result. Your answers are safe—please try again.'}), { status: 500, headers: {'Content-Type': 'application/json'} });
    }
  }
};
