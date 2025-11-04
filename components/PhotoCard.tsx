'use client';

import { useState } from 'react';
import { Star, Check, Info } from 'lucide-react';
import { Photo } from '@/app/page';

interface PhotoCardProps {
  photo: Photo;
  isSelected: boolean;
  onToggleSelect: (id: string) => void;
}

export default function PhotoCard({ photo, isSelected, onToggleSelect }: PhotoCardProps) {
  const [showDetails, setShowDetails] = useState(false);
  const [imageLoaded, setImageLoaded] = useState(false);

  const getScoreColor = (score: number) => {
    if (score >= 90) return 'bg-green-500';
    if (score >= 85) return 'bg-blue-500';
    if (score >= 75) return 'bg-yellow-500';
    return 'bg-orange-500';
  };

  const getScoreLabel = (score: number) => {
    if (score >= 90) return 'Excellent';
    if (score >= 85) return 'Great';
    if (score >= 75) return 'Good';
    return 'Fair';
  };

  return (
    <div className={`group relative bg-white dark:bg-slate-800 rounded-xl shadow-lg overflow-hidden transition-all hover:shadow-2xl ${
      isSelected ? 'ring-4 ring-blue-500' : ''
    }`}>
      {/* Image Container */}
      <div className="relative aspect-[4/3] bg-slate-200 dark:bg-slate-700 overflow-hidden">
        {!imageLoaded && (
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
          </div>
        )}
        <img
          src={photo.url}
          alt={photo.name}
          className={`w-full h-full object-cover transition-all duration-300 group-hover:scale-105 ${
            imageLoaded ? 'opacity-100' : 'opacity-0'
          }`}
          onLoad={() => setImageLoaded(true)}
        />

        {/* Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />

        {/* Score Badge */}
        <div className={`absolute top-3 right-3 ${getScoreColor(photo.score)} text-white px-3 py-1 rounded-full font-bold text-sm shadow-lg flex items-center gap-1`}>
          <Star className="w-4 h-4 fill-current" />
          {photo.score}
        </div>

        {/* Selection Checkbox */}
        <button
          onClick={() => onToggleSelect(photo.id)}
          className={`absolute top-3 left-3 w-8 h-8 rounded-full flex items-center justify-center transition-all ${
            isSelected
              ? 'bg-blue-600 text-white scale-110'
              : 'bg-white/90 text-slate-700 hover:bg-white'
          }`}
        >
          {isSelected && <Check className="w-5 h-5" />}
        </button>

        {/* Info Button */}
        <button
          onClick={() => setShowDetails(!showDetails)}
          className="absolute bottom-3 right-3 w-8 h-8 bg-white/90 hover:bg-white text-slate-700 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all"
        >
          <Info className="w-5 h-5" />
        </button>
      </div>

      {/* Photo Info */}
      <div className="p-4">
        <div className="flex items-center justify-between mb-2">
          <h3 className="text-sm font-medium text-slate-900 dark:text-white truncate flex-1">
            {photo.name}
          </h3>
          <span className={`text-xs font-semibold px-2 py-1 rounded ${getScoreColor(photo.score)} text-white`}>
            {getScoreLabel(photo.score)}
          </span>
        </div>

        <p className="text-xs text-slate-500 dark:text-slate-400">
          {photo.uploadDate.toLocaleDateString('en-US', {
            month: 'short',
            day: 'numeric',
            year: 'numeric',
          })}
        </p>

        {/* Analysis Metrics */}
        {showDetails && (
          <div className="mt-4 pt-4 border-t border-slate-200 dark:border-slate-700 space-y-2">
            <h4 className="text-xs font-semibold text-slate-700 dark:text-slate-300 mb-3">
              AI Analysis Metrics
            </h4>
            {Object.entries(photo.analysisMetrics).map(([key, value]) => (
              <div key={key} className="space-y-1">
                <div className="flex justify-between text-xs">
                  <span className="text-slate-600 dark:text-slate-400 capitalize">
                    {key.replace(/([A-Z])/g, ' $1').trim()}
                  </span>
                  <span className="font-medium text-slate-900 dark:text-white">{value}%</span>
                </div>
                <div className="w-full bg-slate-200 dark:bg-slate-700 rounded-full h-1.5">
                  <div
                    className={`h-1.5 rounded-full ${getScoreColor(value)}`}
                    style={{ width: `${value}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
