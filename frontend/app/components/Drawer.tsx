import React, { useState, ReactNode, useEffect } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';

interface DrawerProps {
  newProject: ReactNode;
  pendingUploads: ReactNode;
  uploadedVideos: ReactNode;
  createAvatarVideo?: ReactNode;
  defaultTab?: 'new' | 'pending' | 'uploaded' | 'avatar';
  mobileOpen: boolean;
  setMobileOpen: (open: boolean) => void;
}

const tabList = [
  { key: 'new', label: 'Create Podacast' },
  { key: 'avatar', label: 'Create Avatar Video' },
  { key: 'pending', label: 'Pending Uploads' },
  { key: 'uploaded', label: 'Uploaded Videos' },
];

export default function Drawer({ newProject, pendingUploads, uploadedVideos, createAvatarVideo, defaultTab, mobileOpen, setMobileOpen }: DrawerProps) {
  const [selectedTab, setSelectedTab] = useState<'new' | 'pending' | 'uploaded' | 'avatar'>(defaultTab || 'new');
  const searchParams = useSearchParams();
  const router = useRouter();

  useEffect(() => {
    const tabParam = searchParams.get('tab') as 'new' | 'pending' | 'uploaded' | 'avatar';
    if (tabParam && ['new', 'pending', 'uploaded', 'avatar'].includes(tabParam)) {
      setSelectedTab(tabParam);
    }
  }, [searchParams]);

  const drawerContent = (
    <nav className="h-full bg-gray-800 text-white flex flex-col py-8 px-4 z-30">
      {tabList.map(tab => (
        <button
          key={tab.key}
          className={`text-left px-4 py-3 rounded-lg mb-2 font-medium transition-colors duration-200 ${
            selectedTab === tab.key ? 'bg-red-500 text-white' : 'hover:bg-gray-700 text-gray-200'
          }`}
          onClick={() => {
            setSelectedTab(tab.key as any);
            setMobileOpen(false);
            router.push(`/?tab=${tab.key}`);
          }}
        >
          {tab.label}
        </button>
      ))}
    </nav>
  );

  return (
    <div className="flex w-full min-h-screen">
      {/* Drawer Navigation - Desktop */}
      <div className="hidden md:block fixed left-0 top-[70px] sm:top-[80px] md:top-[90px] h-[calc(100vh-70px)] sm:h-[calc(100vh-80px)] md:h-[calc(100vh-90px)] z-30">
        {drawerContent}
      </div>
      {/* Drawer Navigation - Mobile Overlay */}
      {mobileOpen && (
        <div className="fixed inset-0 z-50 flex">
          {/* Overlay */}
          <div className="fixed inset-0 bg-black bg-opacity-40 transition-opacity" onClick={() => setMobileOpen(false)} />
          {/* Drawer */}
          <div className="relative h-full w-4/5 max-w-xs">
            <div className="fixed left-0 top-0 h-full w-4/5 max-w-xs bg-gray-800 text-white flex flex-col py-8 px-4 animate-slide-in-left shadow-2xl rounded-r-2xl border-r-2 border-gray-700 z-50">
              {/* Close button */}
              <button
                className="absolute top-7 right-7 p-1.5 rounded-full bg-gray-700/90 border border-gray-600 hover:bg-gray-600 text-white focus:outline-none focus:ring-2 focus:ring-red-500 shadow-md z-50"
                aria-label="Close navigation menu"
                onClick={() => setMobileOpen(false)}
                style={{ boxShadow: '0 2px 8px rgba(0,0,0,0.10)' }}
              >
                <svg width="26" height="26" fill="none" viewBox="0 0 24 24" stroke="currentColor" className="text-white">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
              <div className="mt-10">{drawerContent}</div>
            </div>
          </div>
        </div>
      )}
      {/* Tab Content */}
      <div className="flex-1 flex items-start justify-center md:ml-64 px-2 sm:px-4 py-4 mt-8">
        {selectedTab === 'new' && newProject}
        {selectedTab === 'avatar' && (createAvatarVideo || <div className="w-full max-w-2xl bg-gray-800 rounded-xl shadow-lg p-4 sm:p-8 border border-gray-700 flex flex-col items-center justify-center min-h-[200px] sm:min-h-[300px]"><h2 className="text-xl sm:text-2xl font-bold text-white mb-2 sm:mb-4">Create Avatar Video</h2><p className="text-gray-400 text-sm sm:text-base">This is a placeholder for the Create Avatar Video tab.</p></div>)}
        {selectedTab === 'pending' && pendingUploads}
        {selectedTab === 'uploaded' && uploadedVideos}
      </div>
      <style jsx global>{`
        @keyframes slide-in-left {
          0% { transform: translateX(-100%); }
          100% { transform: translateX(0); }
        }
        .animate-slide-in-left {
          animation: slide-in-left 0.3s cubic-bezier(0.4,0,0.2,1);
        }
      `}</style>
    </div>
  );
} 