import React, { useEffect, useState, useRef } from 'react';

interface PendingProject {
  _id: string;
  topic: string;
  timestamp: string;
  content: string;
  status: string;
  driveLink?: string;
}

export default function PendingUploadsTab() {
  const [pendingProjects, setPendingProjects] = useState<PendingProject[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  // Store uploaded video URLs by project ID
  const [uploadedVideos, setUploadedVideos] = useState<{ [projectId: string]: string }>({});
  // Store uploaded video files by project ID
  const [uploadedVideoFiles, setUploadedVideoFiles] = useState<{ [projectId: string]: File }>({});
  const [uploading, setUploading] = useState<{ [projectId: string]: boolean }>({});
  const fileInputs = useRef<{ [projectId: string]: HTMLInputElement | null }>({});

  useEffect(() => {
    setLoading(true);
    fetch('http://localhost:5000/api/pending-projects')
      .then(res => {
        if (!res.ok) throw new Error('Failed to fetch pending projects');
        return res.json();
      })
      .then(data => {
        setPendingProjects(data);
        setLoading(false);
      })
      .catch(err => {
        setError(err.message);
        setLoading(false);
      });
  }, []);

  const handleUploadClick = (projectId: string) => {
    if (fileInputs.current[projectId]) {
      fileInputs.current[projectId]!.click();
    }
  };

  const handleFileChange = (projectId: string, e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files && e.target.files[0];
    if (file) {
      const url = URL.createObjectURL(file);
      setUploadedVideos(prev => ({ ...prev, [projectId]: url }));
      setUploadedVideoFiles(prev => ({ ...prev, [projectId]: file }));
    }
  };

  const handleUploadNow = async (projectId: string) => {
    const file = uploadedVideoFiles[projectId];
    if (!file) {
      console.log('No file selected for project:', projectId);
      return;
    }
    setUploading(prev => ({ ...prev, [projectId]: true }));
    const formData = new FormData();
    formData.append('video', file);
    formData.append('projectId', projectId);

    // Log the form data keys and values
    console.log('Uploading video for project:', projectId);
    Array.from(formData.entries()).forEach(([key, value]) => {
      if (value instanceof File) {
        console.log(`FormData: ${key} = File(name=${value.name}, size=${value.size})`);
      } else {
        console.log(`FormData: ${key} = ${value}`);
      }
    });

    try {
      console.log('Sending POST request to /api/upload-video...');
      const res = await fetch('http://localhost:5000/api/upload-video', {
        method: 'POST',
        body: formData,
      });
      console.log('Response status:', res.status);

      if (!res.ok) {
        const errorText = await res.text();
        console.error('Upload failed. Status:', res.status, 'Response:', errorText);
        throw new Error('Upload failed');
      }

      // Optionally show a success message
      console.log('Upload successful for project:', projectId);

      // Refresh the pending projects list
      setUploadedVideos(prev => { const copy = { ...prev }; delete copy[projectId]; return copy; });
      setUploadedVideoFiles(prev => { const copy = { ...prev }; delete copy[projectId]; return copy; });
      setUploading(prev => { const copy = { ...prev }; delete copy[projectId]; return copy; });

      // Re-fetch projects
      setLoading(true);
      fetch('http://localhost:5000/api/pending-projects')
        .then(res => res.json())
        .then(data => {
          setPendingProjects(data);
          setLoading(false);
        });
    } catch (err) {
      alert('Upload failed: ' + (err as Error).message);
      setUploading(prev => { const copy = { ...prev }; delete copy[projectId]; return copy; });
    }
  };

  return (
    <div className="w-full max-w-4xl bg-gray-800 rounded-xl shadow-lg p-8 border border-gray-700 flex flex-col items-center min-h-[400px]">
      <h2 className="text-3xl font-bold text-white mb-2 text-center">Pending Uploads</h2>
      <p className="text-gray-300 mb-8 text-center">Your videos that are waiting to be uploaded to YouTube</p>
      {loading ? (
        <p className="text-gray-400">Loading...</p>
      ) : error ? (
        <p className="text-red-400">{error}</p>
      ) : pendingProjects.length === 0 ? null : (
        <div className="w-full flex flex-col gap-6">
          {pendingProjects.map(project => (
            <div key={project._id} className="flex flex-col md:flex-row items-center bg-gray-700 rounded-lg p-6 mb-2 shadow border border-gray-600">
              {/* Video Upload/Preview */}
              <div className="flex flex-col items-center justify-center w-64 h-40 bg-gray-600 rounded-md mr-0 md:mr-8 mb-4 md:mb-0 relative">
                {uploadedVideos[project._id] ? (
                  <>
                    <video src={uploadedVideos[project._id]} controls className="w-full h-full rounded-md object-contain bg-black" />
                    <button
                      className="absolute top-2 right-2 bg-black bg-opacity-60 text-white rounded-full w-7 h-7 flex items-center justify-center hover:bg-opacity-90"
                      onClick={() => setUploadedVideos(prev => { const copy = { ...prev }; delete copy[project._id]; return copy; })}
                      title="Remove video"
                    >
                      &times;
                    </button>
                  </>
                ) : (
                  <>
                    <svg className="w-12 h-12 text-gray-400 mb-2" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><rect x="3" y="5" width="18" height="14" rx="2" stroke="currentColor" strokeWidth="2" fill="none"/><path d="M10 9l5 3-5 3V9z" fill="currentColor"/></svg>
                    <button
                      className="mt-2 px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-400 text-sm"
                      onClick={() => handleUploadClick(project._id)}
                    >
                      Click to upload
                    </button>
                    <input
                      type="file"
                      accept="video/*"
                      style={{ display: 'none' }}
                      ref={el => { fileInputs.current[project._id] = el; }}
                      onChange={e => handleFileChange(project._id, e)}
                    />
                  </>
                )}
              </div>
              {/* Project Info and Upload Button */}
              <div className="flex-1 flex flex-col md:flex-row md:items-center md:justify-between w-full">
                <div>
                  <div className="text-xl font-semibold text-white mb-2">{project.topic}</div>
                  <div className="text-gray-300 mb-2">Status: <span className="text-yellow-400 font-bold">pending</span></div>
                  {project.driveLink && (
                    <a href={project.driveLink} target="_blank" rel="noopener noreferrer" className="text-red-400 underline text-sm">View Drive Link</a>
                  )}
                </div>
                {uploadedVideos[project._id] && (
                  <button
                    className="mt-4 md:mt-0 md:ml-8 px-6 py-2 bg-red-500 text-white rounded font-semibold text-base hover:bg-red-600 transition-colors duration-200"
                    disabled={uploading[project._id]}
                    onClick={() => handleUploadNow(project._id)}
                  >
                    {uploading[project._id] ? 'Uploading...' : 'Upload Now'}
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
} 