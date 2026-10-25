'use client';
import { useState } from 'react';

export function ProceedToPayment({ invoiceId, invoiceNumber }: { invoiceId:string; invoiceNumber:string }) {
  const [state, setState] = useState<'idle'|'loading'|'error'>('idle');
  const [message, setMessage] = useState('');

  async function pay() {
    setState('loading'); setMessage('');
    try {
      // In the live app the Supabase session token is attached here.
      const res = await fetch('/.netlify/functions/paystack-initialize', {
        method:'POST',
        headers:{ 'Content-Type':'application/json' /*, Authorization: `Bearer ${session.access_token}` */ },
        body: JSON.stringify({ invoiceId }),
      });
      const data = await res.json().catch(()=>({}));
      if (res.ok && data.authorizationUrl) { window.location.href = data.authorizationUrl; return; }
      setState('error');
      setMessage(data.error ?? (res.status === 404
        ? 'Demo mode: the Paystack function is not deployed yet. In the live system this button opens a server-initialised Paystack checkout — the amount is always read from the database, never from this page.'
        : 'Could not start the payment. Nothing has been charged.'));
    } catch {
      setState('error');
      setMessage('Demo mode: payment services are not connected. No charge was made. In production, a trusted Netlify Function initialises and later verifies the Paystack transaction before this invoice can be marked paid.');
    }
  }

  return (
    <div>
      <button className="btn btn-brass" onClick={pay} disabled={state==='loading'}>
        {state==='loading' ? 'Opening secure checkout…' : 'Proceed to Payment →'}
      </button>
      {state==='error' && <div className="notice" style={{marginTop:14,fontSize:'.82rem'}}><strong>No payment was taken.</strong>&nbsp; {message}</div>}
      <p className="small faint" style={{marginTop:12,maxWidth:'48ch'}}>
        Invoice {invoiceNumber}. You will be redirected to Paystack. We verify the transaction on our server before this invoice changes status — the browser success screen is never proof of payment.
      </p>
    </div>
  );
}
