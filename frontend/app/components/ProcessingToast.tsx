'use client';
import React, { useEffect } from 'react';
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

  // Debug logging (no window usage)
  console.log('Toast:', { isProcessing, processedTab, currentTab, showToast });

  // Only clear processedTab if you are on the process tab AND processing is NOT running
  useEffect(() => {
    if (processedTab && processedTab === currentTab && !isProcessing) {
      const timeout = setTimeout(() => setProcessedTab(null), 300);
      return () => clearTimeout(timeout);
    }
  }, [currentTab, processedTab, setProcessedTab, isProcessing]);

  if (!showToast) return null;

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
      transition: 'opacity 0.3s',
    }}>
      <span style={{ fontSize: 22, color: '#f87171' }}>●</span>
      <span>
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
    </div>
  );
};

export default ProcessingToast; 