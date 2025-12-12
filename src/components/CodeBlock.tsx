'use client';

import { Highlight, themes } from 'prism-react-renderer';

interface CodeBlockProps {
  code: string;
  language: string;
  filename?: string;
  highlights?: string[];
  variant?: 'legacy' | 'modern';
}

// 言語マッピング (prism-react-rendererがサポートする言語に変換)
const languageMap: Record<string, string> = {
  cobol: 'clike',
  rpg: 'clike',
  vb: 'clike',
  java: 'java',
  typescript: 'tsx',
  xml: 'markup',
};

export function CodeBlock({
  code,
  language,
  filename,
  highlights = [],
  variant = 'legacy',
}: CodeBlockProps) {
  const mappedLanguage = languageMap[language] || language;
  const isLegacy = variant === 'legacy';

  return (
    <div className={`rounded-lg overflow-hidden border ${
      isLegacy
        ? 'border-amber-500/30 bg-amber-950/20'
        : 'border-emerald-500/30 bg-emerald-950/20'
    }`}>
      {/* Header */}
      <div className={`px-4 py-2 flex items-center justify-between border-b ${
        isLegacy
          ? 'bg-amber-900/30 border-amber-500/30'
          : 'bg-emerald-900/30 border-emerald-500/30'
      }`}>
        <div className="flex items-center gap-2">
          <div className="flex gap-1.5">
            <div className="w-3 h-3 rounded-full bg-red-500/80" />
            <div className="w-3 h-3 rounded-full bg-yellow-500/80" />
            <div className="w-3 h-3 rounded-full bg-green-500/80" />
          </div>
          {filename && (
            <span className="text-sm text-slate-400 ml-2 font-mono">
              {filename}
            </span>
          )}
        </div>
        <span className={`text-xs px-2 py-1 rounded ${
          isLegacy
            ? 'bg-amber-500/20 text-amber-300'
            : 'bg-emerald-500/20 text-emerald-300'
        }`}>
          {language.toUpperCase()}
        </span>
      </div>

      {/* Code */}
      <div className="overflow-auto max-h-[500px]">
        <Highlight
          theme={themes.nightOwl}
          code={code.trim()}
          language={mappedLanguage}
        >
          {({ className, style, tokens, getLineProps, getTokenProps }) => (
            <pre
              className={`${className} text-sm leading-relaxed`}
              style={{
                ...style,
                background: 'transparent',
                margin: 0,
                padding: '1rem',
              }}
            >
              {tokens.map((line, i) => (
                <div
                  key={i}
                  {...getLineProps({ line })}
                  className="table-row"
                >
                  <span className="table-cell pr-4 text-slate-600 select-none text-right w-8">
                    {i + 1}
                  </span>
                  <span className="table-cell">
                    {line.map((token, key) => (
                      <span key={key} {...getTokenProps({ token })} />
                    ))}
                  </span>
                </div>
              ))}
            </pre>
          )}
        </Highlight>
      </div>

      {/* Highlights */}
      {highlights.length > 0 && (
        <div className={`px-4 py-3 border-t ${
          isLegacy
            ? 'border-amber-500/30 bg-amber-900/20'
            : 'border-emerald-500/30 bg-emerald-900/20'
        }`}>
          <div className="flex flex-wrap gap-2">
            {highlights.map((highlight, idx) => (
              <span
                key={idx}
                className={`text-xs px-2 py-1 rounded-full ${
                  isLegacy
                    ? 'bg-amber-500/20 text-amber-200'
                    : 'bg-emerald-500/20 text-emerald-200'
                }`}
              >
                {highlight}
              </span>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
