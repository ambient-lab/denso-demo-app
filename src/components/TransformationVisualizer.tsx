'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowRight, Sparkles, Code2, Cpu } from 'lucide-react';
import { CodeBlock } from './CodeBlock';
import type { MigrationSample } from '@/data/migration-samples';

interface TransformationVisualizerProps {
  sample: MigrationSample;
}

export function TransformationVisualizer({ sample }: TransformationVisualizerProps) {
  const [isTransforming, setIsTransforming] = useState(false);
  const [showModern, setShowModern] = useState(false);

  const handleTransform = () => {
    setIsTransforming(true);
    setTimeout(() => {
      setShowModern(true);
      setIsTransforming(false);
    }, 1500);
  };

  const handleReset = () => {
    setShowModern(false);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <span className="text-4xl">{sample.icon}</span>
          <div>
            <h2 className="text-2xl font-bold">{sample.name}</h2>
            <p className="text-slate-400">{sample.description}</p>
          </div>
        </div>

        <div className="flex gap-2">
          {!showModern ? (
            <button
              onClick={handleTransform}
              disabled={isTransforming}
              className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600
                         rounded-lg font-medium hover:from-blue-500 hover:to-purple-500
                         disabled:opacity-50 disabled:cursor-not-allowed transition-all
                         shadow-lg shadow-blue-500/25"
            >
              {isTransforming ? (
                <>
                  <Cpu className="w-5 h-5 animate-spin" />
                  変換中...
                </>
              ) : (
                <>
                  <Sparkles className="w-5 h-5" />
                  Next.jsに変換
                </>
              )}
            </button>
          ) : (
            <button
              onClick={handleReset}
              className="flex items-center gap-2 px-6 py-3 bg-slate-700
                         rounded-lg font-medium hover:bg-slate-600 transition-all"
            >
              <Code2 className="w-5 h-5" />
              元に戻す
            </button>
          )}
        </div>
      </div>

      {/* Transformation View */}
      <div className="relative">
        <AnimatePresence mode="wait">
          {!showModern ? (
            <motion.div
              key="legacy"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -50, scale: 0.95 }}
              transition={{ duration: 0.3 }}
            >
              <CodeBlock
                code={sample.legacy.code}
                language={sample.legacy.language}
                filename={sample.legacy.filename}
                highlights={sample.legacy.highlights}
                variant="legacy"
              />
            </motion.div>
          ) : (
            <motion.div
              key="modern"
              initial={{ opacity: 0, x: 50, scale: 0.95 }}
              animate={{ opacity: 1, x: 0, scale: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.5, ease: 'easeOut' }}
            >
              <CodeBlock
                code={sample.modern.code}
                language={sample.modern.language}
                filename={sample.modern.filename}
                highlights={sample.modern.highlights}
                variant="modern"
              />
            </motion.div>
          )}
        </AnimatePresence>

        {/* Transformation Animation Overlay */}
        <AnimatePresence>
          {isTransforming && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 bg-slate-900/90 backdrop-blur-sm
                         flex items-center justify-center rounded-lg"
            >
              <div className="text-center">
                <motion.div
                  animate={{
                    rotate: 360,
                    scale: [1, 1.2, 1],
                  }}
                  transition={{
                    rotate: { duration: 2, repeat: Infinity, ease: 'linear' },
                    scale: { duration: 0.5, repeat: Infinity },
                  }}
                  className="w-16 h-16 mx-auto mb-4 rounded-full
                             bg-gradient-to-r from-blue-500 to-purple-500
                             flex items-center justify-center"
                >
                  <Sparkles className="w-8 h-8 text-white" />
                </motion.div>
                <p className="text-lg font-medium">AIが変換しています...</p>
                <p className="text-sm text-slate-400 mt-1">
                  {sample.legacy.language.toUpperCase()} → TypeScript/Next.js
                </p>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Features & Metrics */}
      {showModern && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="grid md:grid-cols-2 gap-6"
        >
          {/* Transformation Features */}
          <div className="bg-slate-800/50 rounded-lg p-5 border border-slate-700">
            <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
              <ArrowRight className="w-5 h-5 text-blue-400" />
              変換ポイント
            </h3>
            <ul className="space-y-2">
              {sample.features.map((feature, idx) => (
                <li key={idx} className="flex items-start gap-2 text-sm">
                  <span className="text-emerald-400 mt-0.5">✓</span>
                  <span className="text-slate-300">{feature}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Metrics */}
          <div className="bg-slate-800/50 rounded-lg p-5 border border-slate-700">
            <h3 className="text-lg font-semibold mb-4">移行効果</h3>
            <div className="grid grid-cols-3 gap-4">
              <div className="text-center">
                <div className="text-2xl font-bold text-emerald-400">
                  {sample.metrics.linesReduced}
                </div>
                <div className="text-xs text-slate-400 mt-1">コード削減</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-blue-400">
                  {sample.metrics.performanceGain}
                </div>
                <div className="text-xs text-slate-400 mt-1">性能向上</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-purple-400">
                  {sample.metrics.maintainability}
                </div>
                <div className="text-xs text-slate-400 mt-1">保守性</div>
              </div>
            </div>
          </div>
        </motion.div>
      )}
    </div>
  );
}
