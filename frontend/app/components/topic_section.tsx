import React from 'react';

interface FormData {
  topic: string
  tone: 'Professional' | 'Casual' | 'Funny'
  genre: 'Educational' | 'Entertainment' | 'Tutorial'
  time: string
}

interface TopicSectionProps {
  formData: FormData;
  setFormData: React.Dispatch<React.SetStateAction<FormData>>;
  handleSubmit: (e: React.FormEvent) => Promise<void>;
  isLoading: boolean;
  title?: string;
}

export default function TopicSection({ formData, setFormData, handleSubmit, isLoading, title }: TopicSectionProps) {
  return (
    <div className="w-full max-w-2xl bg-gray-800 rounded-xl shadow-lg p-4 sm:p-8 border border-gray-700">
      <div className="text-center mb-6 sm:mb-8">
        <h1 className="text-2xl sm:text-3xl font-bold text-white mb-1 sm:mb-2">{title || 'Create Your YouTube Script'}</h1>
        <p className="text-gray-400 text-sm sm:text-base">Generate engaging Avatar video</p>
      </div>
      <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-6">
        <div>
          <label htmlFor="topic" className="block text-xs sm:text-sm font-medium text-gray-300 mb-1">Video Topic <span className="text-red-500">*</span></label>
          <input
            type="text"
            id="topic"
            value={formData.topic}
            onChange={(e) => setFormData({ ...formData, topic: e.target.value })}
            className="mt-1 block w-full rounded-md border border-gray-600 bg-gray-700 text-white shadow-sm focus:border-red-500 focus:ring-red-500 px-3 py-2 text-xs sm:text-base"
            required
          />
        </div>
        <div>
          <label htmlFor="time" className="block text-xs sm:text-sm font-medium text-gray-300 mb-1">Time Preference <span className="text-red-500">*</span></label>
          <div className="flex gap-2 items-center mt-1">
            <input
              type="number"
              id="time-number"
              min="1"
              value={parseInt(formData.time) || ''}
              onChange={e => {
                const unit = formData.time.includes('hr') ? 'hrs' : 'minutes';
                setFormData({ ...formData, time: `${e.target.value} ${unit}` });
              }}
              className="block w-20 sm:w-32 rounded-md border border-gray-600 bg-gray-700 text-white shadow-sm focus:border-red-500 focus:ring-red-500 px-3 py-2 text-xs sm:text-base"
              required
            />
            <select
              id="time-unit"
              value={formData.time.includes('hr') ? 'hrs' : 'minutes'}
              onChange={e => {
                const num = parseInt(formData.time) || '';
                setFormData({ ...formData, time: `${num} ${e.target.value}` });
              }}
              className="block rounded-md border border-gray-600 bg-gray-700 text-white shadow-sm focus:border-red-500 focus:ring-red-500 px-3 py-2 text-xs sm:text-base"
            >
              <option value="minutes">minutes</option>
              <option value="hrs">hrs</option>
            </select>
          </div>
          <span className="text-xs text-gray-400">Please specify minutes or hours (e.g., "10 minutes" or "1 hr")</span>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-2 sm:gap-4">
          <div>
            <label htmlFor="tone" className="block text-xs sm:text-sm font-medium text-gray-300 mb-1">Tone</label>
            <select
              id="tone"
              value={formData.tone}
              onChange={(e) => setFormData({ ...formData, tone: e.target.value as FormData['tone'] })}
              className="mt-1 block w-full rounded-md border border-gray-600 bg-gray-700 text-white shadow-sm focus:border-red-500 focus:ring-red-500 px-3 py-2 text-xs sm:text-base"
            >
              <option value="Professional">Professional</option>
              <option value="Casual">Casual</option>
              <option value="Funny">Funny</option>
            </select>
          </div>
          <div>
            <label htmlFor="genre" className="block text-xs sm:text-sm font-medium text-gray-300 mb-1">Content Type</label>
            <select
              id="genre"
              value={formData.genre}
              onChange={(e) => setFormData({ ...formData, genre: e.target.value as FormData['genre'] })}
              className="mt-1 block w-full rounded-md border border-gray-600 bg-gray-700 text-white shadow-sm focus:border-red-500 focus:ring-red-500 px-3 py-2 text-xs sm:text-base"
            >
              <option value="Educational">Educational</option>
              <option value="Entertainment">Entertainment</option>
              <option value="Tutorial">Tutorial</option>
            </select>
          </div>
        </div>
        <button
          type="submit"
          disabled={isLoading}
          className="w-full bg-red-600 text-white py-2 sm:py-3 px-4 rounded-full hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 disabled:opacity-50 font-semibold text-base sm:text-lg transition-colors duration-200 flex items-center justify-center gap-2"
        >
          {isLoading ? (
            <>
              <span className="inline-block w-4 h-4 sm:w-5 sm:h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
              Generating....
            </>
          ) : (
            'Generate Script'
          )}
        </button>
      </form>
    </div>
  );
} 