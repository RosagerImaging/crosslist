import React, { useEffect, useState } from 'react';
import { decrypt } from '../services/encryption';
import { Session } from '@supabase/supabase-js';

export default function Popup() {
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadSession = async () => {
    try {
      setLoading(true);
      const data = await chrome.storage.local.get(['supabase_session_encrypted']);
      const encrypted = data.supabase_session_encrypted;

      if (encrypted) {
        const decrypted = await decrypt(encrypted);
        if (decrypted) {
          const parsedSession = JSON.parse(decrypted) as Session;
          setSession(parsedSession);
        } else {
          setSession(null);
          // Only show error if we had data but failed to decrypt
          // setError('Failed to decrypt session'); 
        }
      } else {
        setSession(null);
      }
    } catch (err) {
      console.error(err);
      setError('Failed to load session');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadSession();

    // Listen for changes
    const listener = (changes: { [key: string]: chrome.storage.StorageChange }) => {
      if (changes.supabase_session_encrypted) {
        loadSession();
      }
    };
    chrome.storage.onChanged.addListener(listener);

    return () => {
      chrome.storage.onChanged.removeListener(listener);
    };
  }, []);

  if (loading) {
    return (
      <div style={{ padding: '20px', textAlign: 'center' }}>
        Loading...
      </div>
    );
  }

  if (error) {
    return (
      <div style={{ padding: '20px', color: 'red', textAlign: 'center' }}>
        Error: {error}
      </div>
    );
  }

  return (
    <div style={{ padding: '20px', textAlign: 'center' }}>
      <h2 style={{ margin: '0 0 10px 0', fontSize: '18px' }}>Crosslist</h2>
      
      {session?.user ? (
        <div>
          <div style={{ 
            backgroundColor: '#d1fae5', 
            color: '#065f46', 
            padding: '8px 12px', 
            borderRadius: '9999px',
            fontSize: '14px',
            marginBottom: '10px',
            display: 'inline-block'
          }}>
            ● Connected
          </div>
          <p style={{ margin: '5px 0', fontSize: '14px', wordBreak: 'break-all' }}>
            Logged in as:<br/>
            <strong>{session.user.email}</strong>
          </p>
        </div>
      ) : (
        <div>
          <div style={{ 
            backgroundColor: '#fee2e2', 
            color: '#b91c1c', 
            padding: '8px 12px', 
            borderRadius: '9999px',
            fontSize: '14px',
            marginBottom: '10px',
            display: 'inline-block'
          }}>
            ○ Not Connected
          </div>
          <p style={{ margin: '5px 0', fontSize: '14px' }}>
            Please log in to the <a href="http://localhost:3000" target="_blank" rel="noreferrer">Web App</a> to sync your session.
          </p>
        </div>
      )}
    </div>
  );
}
