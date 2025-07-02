import React, { useEffect, useState } from 'react';

interface UploadedProject {
  _id: string;
  topic: string;
  timestamp: string;
  content: string;
  status: string;
  driveLink?: string;
  youtubeLink?: string;
  title?: string;
}

const getYouTubeEmbedUrl = (url: string) => {
  if (!url) return '';
  // Match youtu.be or youtube.com/watch?v= links
  const match = url.match(/(?:youtu\.be\/|youtube\.com\/watch\?v=)([\w-]+)/);
  return match ? `https://www.youtube.com/embed/${match[1]}` : '';
};

export default function UploadedVideosTab() {
  const [uploadedProjects, setUploadedProjects] = useState<UploadedProject[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    setLoading(true);
    fetch('http://localhost:5000/api/uploaded-projects')
      .then(res => {
        if (!res.ok) throw new Error('Failed to fetch uploaded projects');
        return res.json();
      })
      .then(data => {
        console.log('Fetched uploaded projects:', data);
        setUploadedProjects(data);
        setLoading(false);
      })
      .catch(err => {
        setError(err.message);
        setLoading(false);
      });
  }, []);

  return (
    <div className="w-full max-w-4xl bg-gray-800 rounded-xl shadow-lg p-8 border border-gray-700 flex flex-col items-center min-h-[400px]">
      <h2 className="text-3xl font-bold text-white mb-2 text-center">Uploaded Videos</h2>
      <p className="text-gray-300 mb-8 text-center">Your videos that have been uploaded to YouTube</p>
      {loading ? (
        <p className="text-gray-400">Loading...</p>
      ) : error ? (
        <p className="text-red-400">{error}</p>
      ) : uploadedProjects.length === 0 ? (
        <p className="text-gray-400">No uploaded videos.</p>
      ) : (
        <div className="w-full flex flex-col gap-6">
          {uploadedProjects.map(project => (
            <div key={project._id} className="flex flex-col md:flex-row items-center bg-gray-700 rounded-lg p-6 mb-2 shadow border border-gray-600">
              {/* Video Preview (YouTube or Drive) */}
              <div className="flex flex-col items-center justify-center w-64 h-40 bg-gray-600 rounded-md mr-0 md:mr-8 mb-4 md:mb-0 relative">
                {project.youtubeLink ? (
                  <iframe
                    src={getYouTubeEmbedUrl(project.youtubeLink)}
                    title="YouTube video preview"
                    className="w-full h-full rounded-md bg-black"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                  />
                ) : project.driveLink ? (
                  <a href={project.driveLink} target="_blank" rel="noopener noreferrer" className="w-full h-full flex items-center justify-center text-white underline">
                    View Drive Video
                  </a>
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-gray-400">No video preview</div>
                )}
              </div>
              {/* Project Info */}
              <div className="flex-1 flex flex-col md:flex-row md:items-center md:justify-between w-full">
                <div>
                  <div className="text-xl font-semibold text-white mb-2">{project.topic}</div>
                  <div className="text-grey-300 mb-2">{project.title}</div>
                  <div className="text-gray-400 text-sm mb-2">{new Date(project.timestamp).toLocaleString()}</div>
                  <div className="text-gray-300 mb-2">Status: <span className="text-green-400 font-bold">uploaded</span></div>
                  {/* {project.driveLink && (
                    <a href={project.driveLink} target="_blank" rel="noopener noreferrer" className="text-red-400 underline text-sm mr-4">View Drive Link</a>
                  )} */}
                  {project.youtubeLink && (
                    <a href={project.youtubeLink} target="_blank" rel="noopener noreferrer" className="text-blue-400 underline text-sm">View YouTube Video</a>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
} 