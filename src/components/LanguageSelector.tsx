'use client';

import { motion } from 'framer-motion';
import type { MigrationSample } from '@/data/migration-samples';

interface LanguageSelectorProps {
  samples: MigrationSample[];
  selectedId: string;
  onSelect: (id: string) => void;
}

export function LanguageSelector({
  samples,
  selectedId,
  onSelect,
}: LanguageSelectorProps) {
  return (
    <div className="flex flex-wrap gap-3 justify-center">
      {samples.map((sample) => {
        const isSelected = sample.id === selectedId;

        return (
          <motion.button
            key={sample.id}
            onClick={() => onSelect(sample.id)}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className={`
              relative px-6 py-3 rounded-xl font-medium
              transition-all duration-200
              ${isSelected
                ? 'bg-gradient-to-r text-white shadow-lg'
                : 'bg-slate-800 text-slate-300 hover:bg-slate-700 border border-slate-700'
              }
            `}
            style={isSelected ? {
              backgroundImage: `linear-gradient(135deg, ${sample.color}dd, ${sample.color}88)`,
              boxShadow: `0 10px 40px -10px ${sample.color}66`,
            } : {}}
          >
            <span className="flex items-center gap-2">
              <span className="text-xl">{sample.icon}</span>
              <span>{sample.name}</span>
            </span>

            {isSelected && (
              <motion.div
                layoutId="selector-indicator"
                className="absolute -bottom-1 left-1/2 -translate-x-1/2
                           w-2 h-2 rounded-full bg-white"
                transition={{ type: 'spring', stiffness: 500, damping: 30 }}
              />
            )}
          </motion.button>
        );
      })}
    </div>
  );
}
