'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { ArrowLeft, Home } from 'lucide-react';
import { migrationSamples } from '@/data/migration-samples';
import { LanguageSelector } from '@/components/LanguageSelector';
import { TransformationVisualizer } from '@/components/TransformationVisualizer';

export default function TransformPage() {
  const [selectedLanguage, setSelectedLanguage] = useState(migrationSamples[0].id);
  const selectedSample = migrationSamples.find(s => s.id === selectedLanguage)!;

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
              <h1 className="text-xl font-semibold">変換デモ</h1>
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
          {/* Description */}
          <div className="text-center max-w-2xl mx-auto">
            <h2 className="text-3xl font-bold mb-4">
              レガシーコードの変換デモ
            </h2>
            <p className="text-slate-400">
              言語を選択して「Next.jsに変換」ボタンをクリックすると、<br />
              レガシーコードがモダンなNext.jsコードに変換されるデモを確認できます。
            </p>
          </div>

          {/* Language Selector */}
          <LanguageSelector
            samples={migrationSamples}
            selectedId={selectedLanguage}
            onSelect={setSelectedLanguage}
          />

          {/* Transformation Visualizer */}
          <TransformationVisualizer
            key={selectedLanguage}
            sample={selectedSample}
          />
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
