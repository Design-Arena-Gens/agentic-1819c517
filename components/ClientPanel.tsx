'use client';

import { useState } from 'react';
import { CheckCircle2, XCircle, Star, MessageSquare } from 'lucide-react';
import { Photo } from '@/app/page';

interface ClientPanelProps {
  photos: Photo[];
  onStatusUpdate: (photoId: string, status: 'approved' | 'rejected') => void;
}

export default function ClientPanel({ photos, onStatusUpdate }: ClientPanelProps) {
  const [selectedPhoto, setSelectedPhoto] = useState<Photo | null>(null);
  const [feedback, setFeedback] = useState('');

  const approvedCount = photos.filter(p => p.clientStatus === 'approved').length;
  const rejectedCount = photos.filter(p => p.clientStatus === 'rejected').length;
  const pendingCount = photos.filter(p => p.clientStatus === 'pending').length;

  const handleApprove = (photo: Photo) => {
    onStatusUpdate(photo.id, 'approved');
    setSelectedPhoto(null);
  };

  const handleReject = (photo: Photo) => {
    onStatusUpdate(photo.id, 'rejected');
    setSelectedPhoto(null);
  };

  return (
    <div className="space-y-6">
      {/* Client Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white dark:bg-slate-800 rounded-xl shadow-lg p-6">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-green-100 dark:bg-green-900 rounded-lg flex items-center justify-center">
              <CheckCircle2 className="w-6 h-6 text-green-600 dark:text-green-400" />
            </div>
            <div>
              <p className="text-sm text-slate-600 dark:text-slate-400">Approved</p>
              <p className="text-2xl font-bold text-slate-900 dark:text-white">{approvedCount}</p>
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-slate-800 rounded-xl shadow-lg p-6">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-red-100 dark:bg-red-900 rounded-lg flex items-center justify-center">
              <XCircle className="w-6 h-6 text-red-600 dark:text-red-400" />
            </div>
            <div>
              <p className="text-sm text-slate-600 dark:text-slate-400">Rejected</p>
              <p className="text-2xl font-bold text-slate-900 dark:text-white">{rejectedCount}</p>
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-slate-800 rounded-xl shadow-lg p-6">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-blue-100 dark:bg-blue-900 rounded-lg flex items-center justify-center">
              <Star className="w-6 h-6 text-blue-600 dark:text-blue-400" />
            </div>
            <div>
              <p className="text-sm text-slate-600 dark:text-slate-400">Pending Review</p>
              <p className="text-2xl font-bold text-slate-900 dark:text-white">{pendingCount}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Instructions */}
      <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-xl p-6">
        <h3 className="text-lg font-semibold text-blue-900 dark:text-blue-100 mb-2">
          Welcome to Your Photo Review
        </h3>
        <p className="text-blue-800 dark:text-blue-200">
          Click on any photo below to review it. Approve photos you love or reject ones you don't want.
          You can also leave feedback for your photographer.
        </p>
      </div>

      {/* Photo Grid */}
      <div className="photo-grid">
        {photos.map(photo => (
          <div
            key={photo.id}
            onClick={() => setSelectedPhoto(photo)}
            className={`cursor-pointer bg-white dark:bg-slate-800 rounded-xl shadow-lg overflow-hidden transition-all hover:shadow-2xl ${
              photo.clientStatus === 'approved'
                ? 'ring-4 ring-green-500'
                : photo.clientStatus === 'rejected'
                ? 'ring-4 ring-red-500 opacity-60'
                : ''
            }`}
          >
            <div className="relative aspect-[4/3] bg-slate-200 dark:bg-slate-700">
              <img
                src={photo.url}
                alt={photo.name}
                className="w-full h-full object-cover"
              />

              {/* Status Badge */}
              {photo.clientStatus === 'approved' && (
                <div className="absolute top-3 right-3 bg-green-500 text-white px-3 py-1 rounded-full font-bold text-sm shadow-lg flex items-center gap-1">
                  <CheckCircle2 className="w-4 h-4" />
                  Approved
                </div>
              )}

              {photo.clientStatus === 'rejected' && (
                <div className="absolute top-3 right-3 bg-red-500 text-white px-3 py-1 rounded-full font-bold text-sm shadow-lg flex items-center gap-1">
                  <XCircle className="w-4 h-4" />
                  Rejected
                </div>
              )}

              {/* AI Score */}
              <div className="absolute top-3 left-3 bg-blue-600 text-white px-3 py-1 rounded-full font-bold text-sm shadow-lg flex items-center gap-1">
                <Star className="w-4 h-4 fill-current" />
                {photo.score}
              </div>
            </div>

            <div className="p-4">
              <h3 className="text-sm font-medium text-slate-900 dark:text-white truncate">
                {photo.name}
              </h3>
            </div>
          </div>
        ))}
      </div>

      {/* Review Modal */}
      {selectedPhoto && (
        <div
          className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4"
          onClick={() => setSelectedPhoto(null)}
        >
          <div
            className="bg-white dark:bg-slate-800 rounded-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="p-6">
              <img
                src={selectedPhoto.url}
                alt={selectedPhoto.name}
                className="w-full rounded-lg mb-4"
              />

              <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-2">
                {selectedPhoto.name}
              </h3>

              <div className="flex items-center gap-2 mb-4">
                <div className="bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 px-3 py-1 rounded-full text-sm font-medium flex items-center gap-1">
                  <Star className="w-4 h-4 fill-current" />
                  AI Score: {selectedPhoto.score}
                </div>
              </div>

              {/* Feedback */}
              <div className="mb-6">
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2 flex items-center gap-2">
                  <MessageSquare className="w-4 h-4" />
                  Feedback (optional)
                </label>
                <textarea
                  value={feedback}
                  onChange={(e) => setFeedback(e.target.value)}
                  placeholder="Share your thoughts about this photo..."
                  className="w-full px-4 py-3 rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-700 text-slate-900 dark:text-white placeholder-slate-400 focus:ring-2 focus:ring-blue-500 outline-none"
                  rows={3}
                />
              </div>

              {/* Actions */}
              <div className="flex gap-3">
                <button
                  onClick={() => handleApprove(selectedPhoto)}
                  className="flex-1 bg-green-600 hover:bg-green-700 text-white font-medium py-3 rounded-lg flex items-center justify-center gap-2 transition-colors"
                >
                  <CheckCircle2 className="w-5 h-5" />
                  Approve Photo
                </button>
                <button
                  onClick={() => handleReject(selectedPhoto)}
                  className="flex-1 bg-red-600 hover:bg-red-700 text-white font-medium py-3 rounded-lg flex items-center justify-center gap-2 transition-colors"
                >
                  <XCircle className="w-5 h-5" />
                  Reject Photo
                </button>
              </div>

              <button
                onClick={() => setSelectedPhoto(null)}
                className="w-full mt-3 bg-slate-200 hover:bg-slate-300 dark:bg-slate-700 dark:hover:bg-slate-600 text-slate-700 dark:text-slate-300 font-medium py-3 rounded-lg transition-colors"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
