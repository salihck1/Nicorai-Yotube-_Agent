import React, { useState, ReactNode, useEffect } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';

interface DrawerProps {
  newProject: ReactNode;
  pendingUploads: ReactNode;
  uploadedVideos: ReactNode;
  createAvatarVideo?: ReactNode;
  defaultTab?: 'new' | 'pending' | 'uploaded' | 'avatar';
}

const tabList = [
  { key: 'new', label: 'Create Podacast' },
  { key: 'avatar', label: 'Create Avatar Video' },
  { key: 'pending', label: 'Pending Uploads' },
  { key: 'uploaded', label: 'Uploaded Videos' },
];

export default function Drawer({ newProject, pendingUploads, uploadedVideos, createAvatarVideo, defaultTab }: DrawerProps) {
  const [selectedTab, setSelectedTab] = useState<'new' | 'pending' | 'uploaded' | 'avatar'>(defaultTab || 'new');
  const [mobileOpen, setMobileOpen] = useState(false);
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
    <div className="flex w-full" style={{ minHeight: '100vh' }}>
      {/* Hamburger for mobile */}
      <button
        className="md:hidden fixed top-[90px] left-4 z-40 bg-gray-800 p-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
        aria-label="Open navigation menu"
        onClick={() => setMobileOpen(true)}
      >
        <svg width="28" height="28" fill="none" viewBox="0 0 24 24" stroke="currentColor" className="text-white">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
        </svg>
      </button>
      {/* Drawer Navigation - Desktop */}
      <div className="hidden md:block fixed left-0 top-[72px] h-[calc(100vh-72px)] z-30">
        {drawerContent}
      </div>
      {/* Drawer Navigation - Mobile Overlay */}
      {mobileOpen && (
        <div className="fixed inset-0 z-50 flex">
          {/* Overlay */}
          <div className="fixed inset-0 bg-black bg-opacity-40 transition-opacity" onClick={() => setMobileOpen(false)} />
          {/* Drawer */}
          <div className="relative h-full w-64">
            <div className="fixed left-0 top-[72px] h-[calc(100vh-72px)] w-64 bg-gray-800 text-white flex flex-col py-12 px-4 animate-slide-in-left shadow-xl z-50">
              {/* Close button */}
              <button
                className="absolute top-4 right-4 text-gray-400 hover:text-white focus:outline-none"
                aria-label="Close navigation menu"
                onClick={() => setMobileOpen(false)}
              >
                <svg width="24" height="24" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
              {drawerContent}
            </div>
          </div>
        </div>
      )}
      {/* Tab Content */}
      <div className="flex-1 flex items-start justify-center md:ml-64">
        {selectedTab === 'new' && newProject}
        {selectedTab === 'avatar' && (createAvatarVideo || <div className="w-full max-w-2xl bg-gray-800 rounded-xl shadow-lg p-8 border border-gray-700 flex flex-col items-center justify-center min-h-[300px]"><h2 className="text-2xl font-bold text-white mb-4">Create Avatar Video</h2><p className="text-gray-400">This is a placeholder for the Create Avatar Video tab.</p></div>)}
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