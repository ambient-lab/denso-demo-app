'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { ArrowLeft, Home, ChevronLeft, ChevronRight } from 'lucide-react';
import { migrationSamples } from '@/data/migration-samples';
import { SideBySideView } from '@/components/SideBySideView';

export default function ComparePage() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const currentSample = migrationSamples[currentIndex];

  const goToPrevious = () => {
    setCurrentIndex((prev) =>
      prev === 0 ? migrationSamples.length - 1 : prev - 1
    );
  };

  const goToNext = () => {
    setCurrentIndex((prev) =>
      prev === migrationSamples.length - 1 ? 0 : prev + 1
    );
  };

  return (
    <div className="min-h-screen bg-slate-900">
      {/* Header */}
      <header className="border-b border-slate-800 bg-slate-900/80 backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Link
                href="/"
                className="flex items-center gap-2 text-slate-400 hover:text-white transition-colors"
              >
                <ArrowLeft className="w-5 h-5" />
                戻る
              </Link>
              <div className="h-6 w-px bg-slate-700" />
              <h1 className="text-xl font-semibold">並列比較ビュー</h1>
            </div>

            <Link
              href="/"
              className="flex items-center gap-2 text-slate-400 hover:text-white transition-colors"
            >
              <Home className="w-5 h-5" />
            </Link>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-6 py-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-8"
        >
          {/* Navigation */}
          <div className="flex items-center justify-between">
            <button
              onClick={goToPrevious}
              className="flex items-center gap-2 px-4 py-2 rounded-lg
                       bg-slate-800 hover:bg-slate-700 transition-colors"
            >
              <ChevronLeft className="w-5 h-5" />
              前の言語
            </button>

            {/* Language Indicators */}
            <div className="flex items-center gap-2">
              {migrationSamples.map((sample, idx) => (
                <button
                  key={sample.id}
                  onClick={() => setCurrentIndex(idx)}
                  className={`w-3 h-3 rounded-full transition-all ${
                    idx === currentIndex
                      ? 'bg-blue-500 scale-125'
                      : 'bg-slate-700 hover:bg-slate-600'
                  }`}
                  title={sample.name}
                />
              ))}
            </div>

            <button
              onClick={goToNext}
              className="flex items-center gap-2 px-4 py-2 rounded-lg
                       bg-slate-800 hover:bg-slate-700 transition-colors"
            >
              次の言語
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>

          {/* Current Language Info */}
          <div className="text-center">
            <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full
                           bg-slate-800 border border-slate-700 text-sm">
              <span className="text-2xl">{currentSample.icon}</span>
              <span className="font-medium">{currentSample.name}</span>
              <span className="text-slate-500">
                ({currentIndex + 1} / {migrationSamples.length})
              </span>
            </span>
          </div>

          {/* Side by Side View */}
          <SideBySideView
            key={currentSample.id}
            sample={currentSample}
          />

          {/* Quick Navigation */}
          <div className="flex flex-wrap justify-center gap-2 pt-4 border-t border-slate-800">
            {migrationSamples.map((sample, idx) => (
              <button
                key={sample.id}
                onClick={() => setCurrentIndex(idx)}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-all ${
                  idx === currentIndex
                    ? 'bg-blue-600 text-white'
                    : 'bg-slate-800 text-slate-400 hover:bg-slate-700 hover:text-white'
                }`}
              >
                <span>{sample.icon}</span>
                <span className="hidden sm:inline">{sample.name}</span>
              </button>
            ))}
          </div>
        </motion.div>
      </main>

      {/* Footer */}
      <footer className="py-8 border-t border-slate-800 mt-auto">
        <div className="container mx-auto px-6 text-center text-slate-500">
          <p>統合システムモダナイゼーション移行計画 デモアプリケーション</p>
        </div>
      </footer>
    </div>
  );
}
