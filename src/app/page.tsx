'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { ArrowRight, Layers, Sparkles, Zap, Code2, GitBranch } from 'lucide-react';
import { migrationSamples } from '@/data/migration-samples';
import { LanguageSelector } from '@/components/LanguageSelector';
import { SideBySideView } from '@/components/SideBySideView';

export default function HomePage() {
  const [selectedLanguage, setSelectedLanguage] = useState(migrationSamples[0].id);
  const selectedSample = migrationSamples.find(s => s.id === selectedLanguage)!;

  return (
    <div className="min-h-screen bg-slate-900">
      {/* Hero Section */}
      <header className="relative overflow-hidden">
        {/* Background gradient */}
        <div className="absolute inset-0 bg-gradient-to-br from-blue-600/20 via-purple-600/10 to-emerald-600/20" />
        <div className="absolute inset-0 bg-[url('/grid.svg')] opacity-20" />

        <div className="relative container mx-auto px-6 py-16">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center max-w-4xl mx-auto"
          >
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full
                          bg-blue-500/10 border border-blue-500/30 text-blue-300 text-sm mb-6">
              <Sparkles className="w-4 h-4" />
              モダナイゼーション デモ
            </div>

            <h1 className="text-5xl md:text-6xl font-bold mb-6 bg-gradient-to-r
                         from-white via-blue-100 to-purple-200 bg-clip-text text-transparent">
              レガシーシステムを<br />Next.jsへ変換
            </h1>

            <p className="text-xl text-slate-400 mb-8 max-w-2xl mx-auto">
              COBOL、Java、VB/.NET、OutSystems、RPG など、<br />
              各言語のレガシーコードがどのようにモダンなNext.jsアプリケーションに<br />
              変換されるかを視覚的に確認できます。
            </p>

            <div className="flex flex-wrap gap-4 justify-center">
              <Link
                href="/transform"
                className="inline-flex items-center gap-2 px-8 py-4 rounded-xl
                         bg-gradient-to-r from-blue-600 to-purple-600 text-white font-semibold
                         hover:from-blue-500 hover:to-purple-500 transition-all
                         shadow-lg shadow-blue-500/25"
              >
                <Zap className="w-5 h-5" />
                変換デモを試す
                <ArrowRight className="w-5 h-5" />
              </Link>

              <Link
                href="/compare"
                className="inline-flex items-center gap-2 px-8 py-4 rounded-xl
                         bg-slate-800 text-white font-semibold
                         hover:bg-slate-700 transition-all border border-slate-700"
              >
                <Code2 className="w-5 h-5" />
                並列比較ビュー
              </Link>
            </div>
          </motion.div>
        </div>
      </header>

      {/* Features */}
      <section className="py-16 border-t border-slate-800">
        <div className="container mx-auto px-6">
          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                icon: <Layers className="w-8 h-8" />,
                title: '5つの言語パターン',
                description: 'COBOL、Java、VB/.NET、OutSystems、RPGの実際の移行パターンを収録',
                color: 'text-blue-400',
              },
              {
                icon: <GitBranch className="w-8 h-8" />,
                title: 'BDD駆動型アプローチ',
                description: '振る舞い駆動開発を活用した移行手法のデモンストレーション',
                color: 'text-purple-400',
              },
              {
                icon: <Sparkles className="w-8 h-8" />,
                title: '視覚的な変換',
                description: 'レガシーコードからモダンコードへの変換をアニメーションで確認',
                color: 'text-emerald-400',
              },
            ].map((feature, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 + idx * 0.1 }}
                className="p-6 rounded-xl bg-slate-800/50 border border-slate-700"
              >
                <div className={`${feature.color} mb-4`}>{feature.icon}</div>
                <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
                <p className="text-slate-400">{feature.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Language Selector & Preview */}
      <section className="py-16 border-t border-slate-800">
        <div className="container mx-auto px-6">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
          >
            <h2 className="text-3xl font-bold text-center mb-4">
              言語を選択して比較
            </h2>
            <p className="text-slate-400 text-center mb-8">
              各レガシー言語の移行前後のコードを確認できます
            </p>

            <LanguageSelector
              samples={migrationSamples}
              selectedId={selectedLanguage}
              onSelect={setSelectedLanguage}
            />

            <div className="mt-10">
              <SideBySideView
                key={selectedLanguage}
                sample={selectedSample}
              />
            </div>
          </motion.div>
        </div>
      </section>

      {/* Stats */}
      <section className="py-16 border-t border-slate-800 bg-slate-800/30">
        <div className="container mx-auto px-6">
          <div className="grid md:grid-cols-4 gap-8 text-center">
            {[
              { value: '117', label: '対象システム数', suffix: 'システム' },
              { value: '5', label: '対応言語', suffix: '言語' },
              { value: '50%', label: '平均コード削減', suffix: '' },
              { value: 'FY26-30', label: '移行期間', suffix: '' },
            ].map((stat, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.5 + idx * 0.1 }}
              >
                <div className="text-4xl font-bold bg-gradient-to-r from-blue-400 to-purple-400
                              bg-clip-text text-transparent">
                  {stat.value}
                </div>
                <div className="text-slate-400 mt-2">{stat.label}</div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-8 border-t border-slate-800">
        <div className="container mx-auto px-6 text-center text-slate-500">
          <p>統合システムモダナイゼーション移行計画 デモアプリケーション</p>
        </div>
      </footer>
    </div>
  );
}
