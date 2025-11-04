'use client';

import { useState, useEffect } from 'react';
import { Upload, Star, Download, Send, Filter, TrendingUp, Image as ImageIcon, CheckCircle2, XCircle } from 'lucide-react';
import PhotoAnalyzer from '@/components/PhotoAnalyzer';
import PhotoCard from '@/components/PhotoCard';
import StatsPanel from '@/components/StatsPanel';
import ClientPanel from '@/components/ClientPanel';

export interface Photo {
  id: string;
  url: string;
  name: string;
  score: number;
  uploadDate: Date;
  analysisMetrics: {
    composition: number;
    sharpness: number;
    exposure: number;
    colorBalance: number;
    subjectClarity: number;
  };
  selected: boolean;
  clientStatus?: 'pending' | 'approved' | 'rejected';
}

export default function Home() {
  const [photos, setPhotos] = useState<Photo[]>([]);
  const [selectedPhotos, setSelectedPhotos] = useState<Set<string>>(new Set());
  const [filterMode, setFilterMode] = useState<'all' | 'top' | 'selected'>('all');
  const [sortBy, setSortBy] = useState<'score' | 'date' | 'name'>('score');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [clientMode, setClientMode] = useState(false);

  // Demo photos with sample data
  useEffect(() => {
    const demoPhotos: Photo[] = Array.from({ length: 24 }, (_, i) => ({
      id: `demo-${i}`,
      url: `https://source.unsplash.com/random/800x600?photography,portrait&sig=${i}`,
      name: `photo-${String(i + 1).padStart(4, '0')}.jpg`,
      score: Math.round(50 + Math.random() * 50),
      uploadDate: new Date(Date.now() - Math.random() * 7 * 24 * 60 * 60 * 1000),
      analysisMetrics: {
        composition: Math.round(60 + Math.random() * 40),
        sharpness: Math.round(60 + Math.random() * 40),
        exposure: Math.round(60 + Math.random() * 40),
        colorBalance: Math.round(60 + Math.random() * 40),
        subjectClarity: Math.round(60 + Math.random() * 40),
      },
      selected: false,
      clientStatus: 'pending',
    }));
    setPhotos(demoPhotos);
  }, []);

  const handleFileUpload = async (files: FileList | null) => {
    if (!files || files.length === 0) return;

    setIsAnalyzing(true);
    const newPhotos: Photo[] = [];

    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      const url = URL.createObjectURL(file);

      await new Promise(resolve => setTimeout(resolve, 100));

      const photo: Photo = {
        id: `${Date.now()}-${i}`,
        url,
        name: file.name,
        score: Math.round(50 + Math.random() * 50),
        uploadDate: new Date(),
        analysisMetrics: {
          composition: Math.round(60 + Math.random() * 40),
          sharpness: Math.round(60 + Math.random() * 40),
          exposure: Math.round(60 + Math.random() * 40),
          colorBalance: Math.round(60 + Math.random() * 40),
          subjectClarity: Math.round(60 + Math.random() * 40),
        },
        selected: false,
        clientStatus: 'pending',
      };
      newPhotos.push(photo);
    }

    setPhotos(prev => [...newPhotos, ...prev]);
    setIsAnalyzing(false);
  };

  const togglePhotoSelection = (photoId: string) => {
    setSelectedPhotos(prev => {
      const newSet = new Set(prev);
      if (newSet.has(photoId)) {
        newSet.delete(photoId);
      } else {
        newSet.add(photoId);
      }
      return newSet;
    });

    setPhotos(prev => prev.map(p =>
      p.id === photoId ? { ...p, selected: !p.selected } : p
    ));
  };

  const updateClientStatus = (photoId: string, status: 'approved' | 'rejected') => {
    setPhotos(prev => prev.map(p =>
      p.id === photoId ? { ...p, clientStatus: status } : p
    ));
  };

  const filteredAndSortedPhotos = () => {
    let filtered = photos;

    if (filterMode === 'top') {
      filtered = photos.filter(p => p.score >= 85);
    } else if (filterMode === 'selected') {
      filtered = photos.filter(p => selectedPhotos.has(p.id));
    }

    return filtered.sort((a, b) => {
      if (sortBy === 'score') return b.score - a.score;
      if (sortBy === 'date') return b.uploadDate.getTime() - a.uploadDate.getTime();
      return a.name.localeCompare(b.name);
    });
  };

  const displayPhotos = filteredAndSortedPhotos();
  const topPhotos = photos.filter(p => p.score >= 85).length;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800">
      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h1 className="text-4xl font-bold text-slate-900 dark:text-white flex items-center gap-3">
                <ImageIcon className="w-10 h-10 text-blue-600" />
                PhotoSelect AI
              </h1>
              <p className="text-slate-600 dark:text-slate-400 mt-2">
                Intelligent photo selection dashboard for professional photographers
              </p>
            </div>
            <button
              onClick={() => setClientMode(!clientMode)}
              className={`px-6 py-3 rounded-lg font-medium transition-all ${
                clientMode
                  ? 'bg-purple-600 text-white hover:bg-purple-700'
                  : 'bg-slate-200 text-slate-700 hover:bg-slate-300 dark:bg-slate-700 dark:text-slate-200'
              }`}
            >
              {clientMode ? 'Exit Client View' : 'Client View'}
            </button>
          </div>

          {/* Upload Area */}
          {!clientMode && (
            <div className="bg-white dark:bg-slate-800 rounded-xl shadow-lg p-6 border-2 border-dashed border-slate-300 dark:border-slate-600">
              <label className="cursor-pointer flex flex-col items-center justify-center">
                <Upload className="w-12 h-12 text-blue-600 mb-3" />
                <span className="text-lg font-medium text-slate-700 dark:text-slate-300 mb-2">
                  Upload Photos for Analysis
                </span>
                <span className="text-sm text-slate-500 dark:text-slate-400 mb-4">
                  Drag & drop or click to select images
                </span>
                <input
                  type="file"
                  multiple
                  accept="image/*"
                  className="hidden"
                  onChange={(e) => handleFileUpload(e.target.files)}
                />
                <span className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
                  Choose Files
                </span>
              </label>
              {isAnalyzing && (
                <div className="mt-4 text-center">
                  <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                  <p className="mt-2 text-slate-600 dark:text-slate-400">Analyzing photos...</p>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Stats Panel */}
        <StatsPanel
          totalPhotos={photos.length}
          topPhotos={topPhotos}
          selectedPhotos={selectedPhotos.size}
        />

        {/* Controls */}
        <div className="bg-white dark:bg-slate-800 rounded-xl shadow-lg p-6 mb-6">
          <div className="flex flex-wrap gap-4 items-center justify-between">
            <div className="flex gap-2">
              <button
                onClick={() => setFilterMode('all')}
                className={`px-4 py-2 rounded-lg font-medium transition-all ${
                  filterMode === 'all'
                    ? 'bg-blue-600 text-white'
                    : 'bg-slate-100 text-slate-700 hover:bg-slate-200 dark:bg-slate-700 dark:text-slate-300'
                }`}
              >
                All Photos ({photos.length})
              </button>
              <button
                onClick={() => setFilterMode('top')}
                className={`px-4 py-2 rounded-lg font-medium transition-all flex items-center gap-2 ${
                  filterMode === 'top'
                    ? 'bg-blue-600 text-white'
                    : 'bg-slate-100 text-slate-700 hover:bg-slate-200 dark:bg-slate-700 dark:text-slate-300'
                }`}
              >
                <Star className="w-4 h-4" />
                Top Rated ({topPhotos})
              </button>
              <button
                onClick={() => setFilterMode('selected')}
                className={`px-4 py-2 rounded-lg font-medium transition-all ${
                  filterMode === 'selected'
                    ? 'bg-blue-600 text-white'
                    : 'bg-slate-100 text-slate-700 hover:bg-slate-200 dark:bg-slate-700 dark:text-slate-300'
                }`}
              >
                Selected ({selectedPhotos.size})
              </button>
            </div>

            <div className="flex gap-2 items-center">
              <span className="text-sm text-slate-600 dark:text-slate-400">Sort by:</span>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as any)}
                className="px-4 py-2 rounded-lg bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-300 border-none outline-none cursor-pointer"
              >
                <option value="score">AI Score</option>
                <option value="date">Upload Date</option>
                <option value="name">File Name</option>
              </select>
            </div>
          </div>
        </div>

        {/* Client Panel */}
        {clientMode && (
          <ClientPanel
            photos={photos}
            onStatusUpdate={updateClientStatus}
          />
        )}

        {/* Photo Grid */}
        {!clientMode && (
          <div className="photo-grid">
            {displayPhotos.map(photo => (
              <PhotoCard
                key={photo.id}
                photo={photo}
                isSelected={selectedPhotos.has(photo.id)}
                onToggleSelect={togglePhotoSelection}
              />
            ))}
          </div>
        )}

        {displayPhotos.length === 0 && !clientMode && (
          <div className="bg-white dark:bg-slate-800 rounded-xl shadow-lg p-12 text-center">
            <ImageIcon className="w-16 h-16 text-slate-400 mx-auto mb-4" />
            <p className="text-xl text-slate-600 dark:text-slate-400">
              {filterMode === 'all' ? 'No photos uploaded yet' : 'No photos match this filter'}
            </p>
          </div>
        )}

        {/* Action Bar */}
        {!clientMode && selectedPhotos.size > 0 && (
          <div className="fixed bottom-8 left-1/2 transform -translate-x-1/2 bg-blue-600 text-white rounded-full shadow-2xl px-8 py-4 flex items-center gap-6">
            <span className="font-medium">{selectedPhotos.size} photos selected</span>
            <button className="flex items-center gap-2 px-4 py-2 bg-white text-blue-600 rounded-full hover:bg-blue-50 transition-colors font-medium">
              <Download className="w-5 h-5" />
              Export
            </button>
            <button className="flex items-center gap-2 px-4 py-2 bg-white text-blue-600 rounded-full hover:bg-blue-50 transition-colors font-medium">
              <Send className="w-5 h-5" />
              Send to Client
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
