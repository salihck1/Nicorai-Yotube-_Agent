import React, { useState, ReactNode } from 'react';

interface DrawerProps {
  newProject: ReactNode;
  pendingUploads: ReactNode;
  uploadedVideos: ReactNode;
  createAvatarVideo?: ReactNode;
}

const tabList = [
  { key: 'new', label: 'New Project' },
  { key: 'avatar', label: 'Create Avatar Video' },
  { key: 'pending', label: 'Pending Uploads' },
  { key: 'uploaded', label: 'Uploaded Videos' },
];

export default function Drawer({ newProject, pendingUploads, uploadedVideos, createAvatarVideo }: DrawerProps) {
  const [selectedTab, setSelectedTab] = useState<'new' | 'pending' | 'uploaded' | 'avatar'>('new');

  return (
    <div className="flex w-full" style={{ minHeight: 'calc(100vh - 72px)' }}>
      {/* Drawer Navigation */}
      <nav className="fixed left-0 top-[72px] h-[calc(100vh-72px)] w-64 bg-gray-800 text-white flex flex-col py-8 px-4 z-30">
        <h2 className="text-lg font-bold mb-8">Navigation</h2>
        {tabList.map(tab => (
          <button
            key={tab.key}
            className={`text-left px-4 py-3 rounded-lg mb-2 font-medium transition-colors duration-200 ${
              selectedTab === tab.key ? 'bg-red-500 text-white' : 'hover:bg-gray-700 text-gray-200'
            }`}
            onClick={() => setSelectedTab(tab.key as any)}
          >
            {tab.label}
          </button>
        ))}
      </nav>
      {/* Tab Content */}
      <div className="flex-1 flex items-start justify-center ml-64">
        {selectedTab === 'new' && newProject}
        {selectedTab === 'avatar' && (createAvatarVideo || <div className="w-full max-w-2xl bg-gray-800 rounded-xl shadow-lg p-8 border border-gray-700 flex flex-col items-center justify-center min-h-[300px]"><h2 className="text-2xl font-bold text-white mb-4">Create Avatar Video</h2><p className="text-gray-400">This is a placeholder for the Create Avatar Video tab.</p></div>)}
        {selectedTab === 'pending' && pendingUploads}
        {selectedTab === 'uploaded' && uploadedVideos}
      </div>
    </div>
  );
} 