'use client';

import React, { createContext, useContext, useState, ReactNode, useEffect } from 'react';

interface ProcessingContextType {
  isProcessing: boolean;
  setIsProcessing: (value: boolean) => void;
  message: string;
  setMessage: (msg: string) => void;
  processedTab: string | null;
  setProcessedTab: (tab: string | null) => void;
}

const ProcessingContext = createContext<ProcessingContextType | undefined>(undefined);

export const useProcessing = () => {
  const context = useContext(ProcessingContext);
  if (!context) {
    throw new Error('useProcessing must be used within a ProcessingProvider');
  }
  return context;
};

export const ProcessingProvider = ({ children }: { children: ReactNode }) => {
  const [isProcessing, setIsProcessing] = useState(false);
  const [message, setMessage] = useState('Processing...');
  const [processedTab, setProcessedTab] = useState<string | null>(null);

  useEffect(() => {
    console.log('ProcessingContext:', { isProcessing, processedTab });
  }, [isProcessing, processedTab]);

  return (
    <ProcessingContext.Provider value={{ isProcessing, setIsProcessing, message, setMessage, processedTab, setProcessedTab }}>
      {children}
    </ProcessingContext.Provider>
  );
}; 