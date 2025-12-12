'use client';

import { motion } from 'framer-motion';
import { ArrowRight, Zap } from 'lucide-react';
import { CodeBlock } from './CodeBlock';
import type { MigrationSample } from '@/data/migration-samples';

interface SideBySideViewProps {
  sample: MigrationSample;
}

export function SideBySideView({ sample }: SideBySideViewProps) {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-3">
        <span className="text-4xl">{sample.icon}</span>
        <div>
          <h2 className="text-2xl font-bold">{sample.name}</h2>
          <p className="text-slate-400">{sample.description}</p>
        </div>
      </div>

      {/* Side by Side Code */}
      <div className="grid lg:grid-cols-2 gap-4 relative">
        {/* Legacy Code */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5 }}
        >
          <div className="mb-2 flex items-center gap-2">
            <span className="text-amber-400 font-semibold">Before</span>
            <span className="text-sm text-slate-500">レガシーコード</span>
          </div>
          <CodeBlock
            code={sample.legacy.code}
            language={sample.legacy.language}
            filename={sample.legacy.filename}
            highlights={sample.legacy.highlights}
            variant="legacy"
          />
        </motion.div>

        {/* Arrow */}
        <div className="hidden lg:flex absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-10">
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.5, type: 'spring' }}
            className="w-14 h-14 rounded-full bg-gradient-to-r from-blue-600 to-purple-600
                       flex items-center justify-center shadow-lg shadow-purple-500/30"
          >
            <ArrowRight className="w-6 h-6 text-white" />
          </motion.div>
        </div>

        {/* Modern Code */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <div className="mb-2 flex items-center gap-2">
            <span className="text-emerald-400 font-semibold">After</span>
            <span className="text-sm text-slate-500">Next.js / TypeScript</span>
          </div>
          <CodeBlock
            code={sample.modern.code}
            language={sample.modern.language}
            filename={sample.modern.filename}
            highlights={sample.modern.highlights}
            variant="modern"
          />
        </motion.div>
      </div>

      {/* Features & Metrics */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="grid md:grid-cols-3 gap-4"
      >
        {/* Transformation Features */}
        <div className="md:col-span-2 bg-slate-800/50 rounded-lg p-5 border border-slate-700">
          <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
            <Zap className="w-5 h-5 text-yellow-400" />
            変換ポイント
          </h3>
          <div className="grid sm:grid-cols-2 gap-2">
            {sample.features.map((feature, idx) => (
              <div
                key={idx}
                className="flex items-start gap-2 text-sm p-2 rounded bg-slate-900/50"
              >
                <span className="text-emerald-400 mt-0.5">→</span>
                <span className="text-slate-300">{feature}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Metrics */}
        <div className="bg-slate-800/50 rounded-lg p-5 border border-slate-700">
          <h3 className="text-lg font-semibold mb-4">移行効果</h3>
          <div className="space-y-4">
            <div>
              <div className="flex justify-between text-sm mb-1">
                <span className="text-slate-400">コード削減</span>
                <span className="font-bold text-emerald-400">
                  {sample.metrics.linesReduced}
                </span>
              </div>
              <div className="h-2 bg-slate-700 rounded-full overflow-hidden">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: sample.metrics.linesReduced }}
                  transition={{ delay: 0.6, duration: 0.8 }}
                  className="h-full bg-gradient-to-r from-emerald-500 to-emerald-400"
                />
              </div>
            </div>
            <div>
              <div className="flex justify-between text-sm mb-1">
                <span className="text-slate-400">性能向上</span>
                <span className="font-bold text-blue-400">
                  {sample.metrics.performanceGain}
                </span>
              </div>
              <div className="h-2 bg-slate-700 rounded-full overflow-hidden">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: '80%' }}
                  transition={{ delay: 0.7, duration: 0.8 }}
                  className="h-full bg-gradient-to-r from-blue-500 to-blue-400"
                />
              </div>
            </div>
            <div className="pt-2 border-t border-slate-700">
              <div className="flex justify-between text-sm">
                <span className="text-slate-400">保守性</span>
                <span className="font-bold text-purple-400">
                  {sample.metrics.maintainability}
                </span>
              </div>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
