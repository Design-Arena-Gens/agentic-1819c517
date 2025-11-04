'use client';

import { Image, Star, CheckCircle2, TrendingUp } from 'lucide-react';

interface StatsPanelProps {
  totalPhotos: number;
  topPhotos: number;
  selectedPhotos: number;
}

export default function StatsPanel({ totalPhotos, topPhotos, selectedPhotos }: StatsPanelProps) {
  const topPercentage = totalPhotos > 0 ? Math.round((topPhotos / totalPhotos) * 100) : 0;

  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
      {/* Total Photos */}
      <div className="bg-white dark:bg-slate-800 rounded-xl shadow-lg p-6">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-slate-600 dark:text-slate-400 mb-1">Total Photos</p>
            <p className="text-3xl font-bold text-slate-900 dark:text-white">{totalPhotos}</p>
          </div>
          <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900 rounded-lg flex items-center justify-center">
            <Image className="w-6 h-6 text-blue-600 dark:text-blue-400" />
          </div>
        </div>
      </div>

      {/* Top Rated */}
      <div className="bg-white dark:bg-slate-800 rounded-xl shadow-lg p-6">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-slate-600 dark:text-slate-400 mb-1">Top Rated</p>
            <p className="text-3xl font-bold text-slate-900 dark:text-white">{topPhotos}</p>
            <p className="text-xs text-green-600 dark:text-green-400 mt-1 font-medium">
              {topPercentage}% of total
            </p>
          </div>
          <div className="w-12 h-12 bg-yellow-100 dark:bg-yellow-900 rounded-lg flex items-center justify-center">
            <Star className="w-6 h-6 text-yellow-600 dark:text-yellow-400 fill-current" />
          </div>
        </div>
      </div>

      {/* Selected */}
      <div className="bg-white dark:bg-slate-800 rounded-xl shadow-lg p-6">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-slate-600 dark:text-slate-400 mb-1">Selected</p>
            <p className="text-3xl font-bold text-slate-900 dark:text-white">{selectedPhotos}</p>
          </div>
          <div className="w-12 h-12 bg-green-100 dark:bg-green-900 rounded-lg flex items-center justify-center">
            <CheckCircle2 className="w-6 h-6 text-green-600 dark:text-green-400" />
          </div>
        </div>
      </div>

      {/* Average Score */}
      <div className="bg-white dark:bg-slate-800 rounded-xl shadow-lg p-6">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-slate-600 dark:text-slate-400 mb-1">Avg Score</p>
            <p className="text-3xl font-bold text-slate-900 dark:text-white">
              {totalPhotos > 0 ? Math.round((topPhotos * 90 + (totalPhotos - topPhotos) * 75) / totalPhotos) : 0}
            </p>
          </div>
          <div className="w-12 h-12 bg-purple-100 dark:bg-purple-900 rounded-lg flex items-center justify-center">
            <TrendingUp className="w-6 h-6 text-purple-600 dark:text-purple-400" />
          </div>
        </div>
      </div>
    </div>
  );
}
