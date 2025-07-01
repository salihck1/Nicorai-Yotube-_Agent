import React, { useState, ReactNode } from 'react';

interface DrawerProps {
  newProject: ReactNode;
  pendingUploads: ReactNode;
  uploadedVideos: ReactNode;
}

const tabList = [
  { key: 'new', label: 'New Project' },
  { key: 'pending', label: 'Pending Uploads' },
  { key: 'uploaded', label: 'Uploaded Videos' },
];

export default function Drawer({ newProject, pendingUploads, uploadedVideos }: DrawerProps) {
  const [selectedTab, setSelectedTab] = useState<'new' | 'pending' | 'uploaded'>('new');

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
        {selectedTab === 'pending' && pendingUploads}
        {selectedTab === 'uploaded' && uploadedVideos}
      </div>
    </div>
  );
} 