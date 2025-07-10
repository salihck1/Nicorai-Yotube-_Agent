'use client';
import React, { useEffect, useState } from 'react';
import { useProcessing } from './ProcessingContext';
import { useRouter, useSearchParams } from 'next/navigation';

const tabLabels: Record<string, string> = {
  new: 'Create Podcast',
  avatar: 'Create Avatar Video',
  pending: 'Pending Uploads',
  uploaded: 'Uploaded Videos',
};

const ProcessingToast = () => {
  const { isProcessing, message, processedTab, setProcessedTab } = useProcessing();
  const router = useRouter();
  const searchParams = useSearchParams();
  const currentTab = searchParams.get('tab') || 'new';

  // Only show the toast if processedTab is set and user is NOT on the process tab
  const showToast = processedTab && processedTab !== currentTab;

  // Minimize state
  const [minimized, setMinimized] = useState(false);

  // Debug logging (no window usage)
  console.log('Toast:', { isProcessing, processedTab, currentTab, showToast, minimized });

  // Only clear processedTab if you are on the process tab AND processing is NOT running
  useEffect(() => {
    if (processedTab && processedTab === currentTab && !isProcessing) {
      const timeout = setTimeout(() => setProcessedTab(null), 300);
      return () => clearTimeout(timeout);
    }
  }, [currentTab, processedTab, setProcessedTab, isProcessing]);

  if (!showToast && !minimized) return null;

  // Minimized icon button
  if (minimized) {
    return (
      <button
        aria-label="Expand toast notification"
        style={{
          position: 'fixed',
          bottom: 28,
          right: 28,
          zIndex: 10000,
          width: 48,
          height: 48,
          borderRadius: '50%',
          background: '#222',
          border: '2px solid #f87171',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          boxShadow: '0 2px 8px rgba(0,0,0,0.2)',
          cursor: 'pointer',
          transition: 'all 0.3s',
        }}
        onClick={() => setMinimized(false)}
      >
        {/* Notification bell icon */}
        <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="#f87171" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 8a6 6 0 0 0-12 0c0 7-3 9-3 9h18s-3-2-3-9"/><path d="M13.73 21a2 2 0 0 1-3.46 0"/></svg>
      </button>
    );
  }

  return (
    <div style={{
      position: 'fixed',
      bottom: 24,
      right: 24,
      zIndex: 10000,
      background: '#222',
      color: '#fff',
      borderRadius: 12,
      boxShadow: '0 2px 8px rgba(0,0,0,0.2)',
      padding: '16px 24px',
      display: 'flex',
      alignItems: 'center',
      minWidth: 280,
      fontWeight: 500,
      fontSize: 16,
      gap: 12,
      border: '2px solid #f87171',
      transition: 'all 0.3s',
      maxWidth: '90vw',
    }}>
      <span style={{ fontSize: 22, color: '#f87171' }}>●</span>
      <span style={{ flex: 1 }}>
        {isProcessing
          ? `Processing on "${tabLabels[processedTab] || processedTab}" tab...`
          : 'Process completed.'}
      </span>
      {!isProcessing && (
        <button
          style={{
            marginLeft: 16,
            background: '#f87171',
            color: '#fff',
            border: 'none',
            borderRadius: 8,
            padding: '6px 14px',
            cursor: 'pointer',
            fontWeight: 600,
            fontSize: 15,
          }}
          onClick={() => {
            router.push(`/?tab=${processedTab}`);
            setProcessedTab(null);
          }}
        >
          Go to {tabLabels[processedTab] || processedTab}
        </button>
      )}
      <button
        aria-label="Minimize toast notification"
        style={{
          marginLeft: 8,
          background: 'transparent',
          color: '#fff',
          border: 'none',
          borderRadius: 8,
          padding: 4,
          cursor: 'pointer',
          fontWeight: 600,
          fontSize: 20,
          lineHeight: 1,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          transition: 'background 0.2s',
        }}
        onClick={() => setMinimized(true)}
      >
        <svg width="20" height="20" viewBox="0 0 20 20" fill="none" stroke="#fff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="4" y1="4" x2="16" y2="16"/><line x1="16" y1="4" x2="4" y2="16"/></svg>
      </button>
    </div>
  );
};

export default ProcessingToast; 